<?php
namespace App\Imports\Themes;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;

class ExtractService
{
    private $entityManager;
    private $themeRepository;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->themeRepository = $entityManager->getRepository(Theme::class);
    }

    /**
     * Get Themes From Excel File with emissions data.
     *
     * @return array themes import from the excel file
     */
    public function GetThemesFromExcelFile(string $excel_file): array
    {
        $themes = [];
        if (!file_exists($excel_file)) {
            throw new FileNotFoundException(sprintf('Excel file "%s" not found', $excel_file));
        }

        $spreadsheet = IOFactory::load($excel_file);
        $sheet = $spreadsheet->getActiveSheet();
        
        // Get column headers to identify years
        $headerRow = 1;
        $yearColumns = [];
        $lastColumn = $sheet->getHighestColumn();
        $columnIndex = 'I'; // Starting from column I which should be 1990
        
        while ($columnIndex <= $lastColumn) {
            $yearValue = $sheet->getCell($columnIndex . $headerRow)->getValue();
            if (is_numeric($yearValue) || preg_match('/^\d{4}(\s*\([a-z]\))?$/', $yearValue)) {
                // Extract year from format like "2022 (e)"
                $year = (int) $yearValue;
                $yearColumns[$columnIndex] = $year;
            }
            // Move to next column
            $columnIndex++;
        }
        
        // Process each row
        foreach ($sheet->getRowIterator(2) as $row) { // Start from row 2 (skipping header)
            $rowIndex = $row->getRowIndex();
            
            $externalId = $sheet->getCell('A' . $rowIndex)->getValue();
            $categorieV02 = $sheet->getCell('B' . $rowIndex)->getValue();
            $categorieId = $sheet->getCell('C' . $rowIndex)->getValue();
            $parentInfo = $sheet->getCell('D' . $rowIndex)->getValue();
            $parentId = $sheet->getCell('E' . $rowIndex)->getValue();
            $isSection = $sheet->getCell('F' . $rowIndex)->getValue() === 'Section';
            $source = $sheet->getCell('G' . $rowIndex)->getValue();
            $lien = $sheet->getCell('H' . $rowIndex)->getValue();
            $geographie = $sheet->getCell('I' . $rowIndex)->getValue();
            $unite = $sheet->getCell('J' . $rowIndex)->getValue();
            
            // Skip rows without external ID
            if (empty($externalId)) {
                continue;
            }
            
            $theme = [
                'externalId' => $externalId,
                'name' => $categorieV02, // Using the category as name
                'categorieId' => $categorieId,
                'categorieV01' => null,
                'categorieV02' => $categorieV02,
                'isSection' => $isSection !== null ? $isSection : false,
                'parentId' => $parentId,
                'source' => $source,
                'lien' => $lien,
                'geographie' => $geographie,
                'unite' => $unite,
                'years' => []
            ];
            
            // Process values for each year
            foreach ($yearColumns as $column => $year) {
                $value = $sheet->getCell($column . $rowIndex)->getValue();
                if ($value !== null && $value !== '') {
                    $theme['years'][$year] = (float) str_replace(',', '.', $value);
                }
            }
            
            $themes[] = $theme;
        }
        
        return $themes;
    }

    private function getParentExternalId(string $externalId): ?string
    {
        $check_dot = strpos($externalId, '.');
        if (false !== $check_dot) {
            $level_array = explode('.', $externalId);
            array_pop($level_array);
            return implode('.', $level_array);
        } else {
            return null;
        }
    }
    
    public function PrepareThemesForDatabase(array $themes): array
    {
        return array_map(function ($theme) {
            $prepared = [
                'name' => $theme['name'],
                'externalId' => $theme['externalId'],
                'isSection' => $theme['isSection'] ?? true,
                'parentExternalId' => $theme['parentId'] ?: $this->getParentExternalId($theme['externalId']),
                'categorieId' => $theme['categorieId'] ?? null,
                'categorieV01' => $theme['categorieV01'] ?? null,
                'categorieV02' => $theme['categorieV02'] ?? null,
                'source' => $theme['source'] ?? null,
                'lien' => $theme['lien'] ?? null,
                'geographie' => $theme['geographie'] ?? null,
                'unite' => $theme['unite'] ?? null,
                'years' => $theme['years'] ?? []
            ];
            
            return $prepared;
        }, $themes);
    }

    /**
     * Vérifie la cohérence des données importées
     */
    public function validateImportedData(array $themes): array
    {
        $errors = [];
        $externalIds = [];
        
        foreach ($themes as $index => $theme) {
            // Vérifier les champs obligatoires
            if (empty($theme['externalId'])) {
                $errors[] = "Ligne " . ($index + 2) . ": ID externe manquant";
            }
            
            if (empty($theme['name'])) {
                $errors[] = "Ligne " . ($index + 2) . ": Nom manquant pour l'ID externe " . $theme['externalId'];
            }
            
            // Vérifier les doublons d'ID externe
            if (in_array($theme['externalId'], $externalIds)) {
                $errors[] = "Ligne " . ($index + 2) . ": ID externe en doublon: " . $theme['externalId'];
            }
            $externalIds[] = $theme['externalId'];
            
            // Vérifier que les valeurs annuelles sont numériques
            foreach ($theme['years'] ?? [] as $year => $value) {
                if (!is_numeric($value)) {
                    $errors[] = "Ligne " . ($index + 2) . ": Valeur non numérique pour l'année " . $year . " (" . $theme['externalId'] . ")";
                }
            }
        }
        
        return $errors;
    }

    public function SaveThemesOnDatabase(array $arrayThemes): int
    {
        $count = 0;
        
        foreach ($arrayThemes as $theme) {
            // Vérifier si le thème existe déjà
            $existing_theme = $this->themeRepository->findOneBy(['externalId' => $theme['externalId']]);
            
            if ($existing_theme) {
                // Récupérer l'ID du thème existant
                $themeId = $existing_theme->getId();
                
                // Supprimer d'abord toutes les valeurs associées à ce thème avec une requête DQL
                $queryBuilder = $this->entityManager->createQueryBuilder();
                $queryBuilder->delete('App\Entity\ThemeValue', 'tv')
                            ->where('tv.theme = :themeId')
                            ->setParameter('themeId', $themeId);
                $queryBuilder->getQuery()->execute();
                
                // Conserver le thème mais mettre à jour ses propriétés
                $theme_to_write = $existing_theme;
            } else {
                // Créer un nouveau thème
                $theme_to_write = new Theme();
                $theme_to_write->setExternalId($theme['externalId']);
            }
            
            $parent_external_id = $theme['parentExternalId'];
            $parent_theme = null;
            
            if ($parent_external_id) {
                $parent_theme = $this->themeRepository->findOneBy(['externalId' => $parent_external_id]);
            }
            
            $theme_to_write
                ->setName($theme['name'])
                ->setIsSection($theme['isSection'])
                ->setParentId($parent_theme ? $parent_theme->getId() : null)
                ->setParent($parent_theme)
                ->setCategorieId($theme['categorieId'])
                ->setCategorieV01($theme['categorieV01'])
                ->setCategorieV02($theme['categorieV02'])
                ->setSource($theme['source'])
                ->setLien($theme['lien'])
                ->setGeographie($theme['geographie'])
                ->setUnite($theme['unite']);
            
            // Sauvegarder le thème pour obtenir son ID
            $this->entityManager->persist($theme_to_write);
            $this->entityManager->flush();
            
            // Ajouter les valeurs annuelles
            if (!empty($theme['years'])) {
                foreach ($theme['years'] as $year => $value) {
                    // Créer une nouvelle valeur
                    $themeValue = new ThemeValue();
                    $themeValue->setTheme($theme_to_write);
                    $themeValue->setYear($year);
                    $themeValue->setValue($value);
                    $this->entityManager->persist($themeValue);
                }
                $this->entityManager->flush();
            }
            
            $count++;
        }
        
        return $count;
    }
    
    /**
     * Get hierarchical data structure of themes
     */
    public function getThemesHierarchy(): array
    {
        $allThemes = $this->themeRepository->findAll();
        $themesByParentId = [];
        $rootThemes = [];
        
        // Group themes by parent ID
        foreach ($allThemes as $theme) {
            $parentId = $theme->getParentId();
            
            if ($parentId === null) {
                $rootThemes[] = $theme;
            } else {
                if (!isset($themesByParentId[$parentId])) {
                    $themesByParentId[$parentId] = [];
                }
                $themesByParentId[$parentId][] = $theme;
            }
        }
        
        // Build tree structure
        $buildTree = function($themes, $themesByParentId) use (&$buildTree) {
            $result = [];
            
            foreach ($themes as $theme) {
                $themeData = [
                    'id' => $theme->getId(),
                    'name' => $theme->getName(),
                    'externalId' => $theme->getExternalId(),
                    'isSection' => $theme->getIsSection(),
                    'source' => $theme->getSource(),
                    'unite' => $theme->getUnite(),
                    'geographie' => $theme->getGeographie(),
                    'children' => []
                ];
                
                // Add values if available
                $values = [];
                foreach ($theme->getValues() as $value) {
                    $values[$value->getYear()] = $value->getValue();
                }
                $themeData['values'] = $values;
                
                // Add children if any
                if (isset($themesByParentId[$theme->getId()])) {
                    $themeData['children'] = $buildTree(
                        $themesByParentId[$theme->getId()],
                        $themesByParentId
                    );
                }
                
                $result[] = $themeData;
            }
            
            return $result;
        };
        
        return $buildTree($rootThemes, $themesByParentId);
    }
}