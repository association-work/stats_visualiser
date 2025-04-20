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
    // Activer le debug
    $debug = true;
    $debugFile = __DIR__ . '/excel_extraction_debug.log';
    
    // Fonction de logging
    $log = function($message) use ($debug, $debugFile) {
        if ($debug) {
            file_put_contents($debugFile, date('Y-m-d H:i:s') . ' - ' . $message . PHP_EOL, FILE_APPEND);
        }
    };
    
    $log("Début de l'analyse du fichier Excel: " . $excel_file);
    $spreadsheet = IOFactory::load($excel_file);
    $sheet = $spreadsheet->getActiveSheet();
    $log("Feuille active: " . $sheet->getTitle());

    // Utiliser la fonction séparée pour obtenir les colonnes d'années
    $yearColumns = $this->getYearColumns($log);
    
    // Traitement des lignes de données
    $log("Analyse des lignes de données...");
    $rowCount = 0;
    $themesWithValues = 0;
    $totalValues = 0;
    
    foreach ($sheet->getRowIterator(3) as $row) {
        $rowIndex = $row->getRowIndex();
        $rowCount++;
        
        // Données de base du thème
        $name = $sheet->getCell('A' . $rowIndex)->getValue();
        $externalId = $sheet->getCell('B' . $rowIndex)->getValue();
        
        if (empty($externalId)) {
            $log("Ligne {$rowIndex}: Pas d'ID externe, ignorée");
            continue;
        }
        
        $log("Ligne {$rowIndex}: Thème '{$name}' (ID: {$externalId})");
        
        $parentName = $sheet->getCell('C' . $rowIndex)->getValue();
        $parentId = $sheet->getCell('D' . $rowIndex)->getValue();
        $isSection = $sheet->getCell('E' . $rowIndex)->getValue() === 'S';
        $source = $sheet->getCell('F' . $rowIndex)->getValue();
        $link = $sheet->getCell('G' . $rowIndex)->getValue();
        $geography = $sheet->getCell('H' . $rowIndex)->getValue();
        $unit = $sheet->getCell('I' . $rowIndex)->getValue();
        
        $theme = [
            'externalId' => $externalId,
            'name' => $name,
            'parentName' => $parentName,
            'parentId' => $parentId,
            'isSection' => $isSection,
            'source' => $source,
            'link' => $link,
            'geography' => $geography,
            'unit' => $unit,
            'years' => []
        ];
        
        // Récupération des valeurs pour chaque année
        $valueCount = 0;
        foreach ($yearColumns as $column => $year) {
            // Essayer plusieurs méthodes pour obtenir la valeur
            $cell = $sheet->getCell($column . $rowIndex);
            $value = $cell->getValue();
            
            $log("  Année {$year} (cellule {$column}{$rowIndex}): Valeur = " . 
                 ($value !== null && $value !== '' ? $value : "vide"));
            
            if ($value !== null && $value !== '') {
                // Convertir la valeur (remplacer la virgule par un point si nécessaire)
                if (is_string($value)) {
                    $value = str_replace(',', '.', $value);
                }
                $numericValue = (float)$value;
                
                $theme['years'][$year] = $numericValue;
                $log("    -> Valeur ajoutée: {$numericValue}");
                $valueCount++;
                $totalValues++;
            }
        }
        
        if ($valueCount > 0) {
            $themesWithValues++;
            $log("  -> {$valueCount} valeurs annuelles trouvées pour ce thème");
        } else {
            $log("  -> Aucune valeur annuelle trouvée pour ce thème");
        }
        
        $themes[] = $theme;
    }
    
    $log("Analyse terminée:");
    $log("- {$rowCount} lignes traitées");
    $log("- " . count($themes) . " thèmes extraits");
    $log("- {$themesWithValues} thèmes avec des valeurs annuelles");
    $log("- {$totalValues} valeurs annuelles au total");
    
    // Vérifiez quelques thèmes avec leurs valeurs
    for ($i = 0; $i < min(5, count($themes)); $i++) {
        $log("Exemple de thème #" . ($i+1) . ":");
        $log("- Nom: " . $themes[$i]['name']);
        $log("- ID: " . $themes[$i]['externalId']);
        $log("- Valeurs: " . json_encode($themes[$i]['years']));
    }
    
    return $themes;
}

/**
 * Récupère manuellement les colonnes d'années dans le fichier Excel
 * 
 * @param callable $log Fonction de logging
 * @return array Tableau associatif [colonne => année]
 */
private function getYearColumns(callable $log): array 
{
    // Définir manuellement les années de 1990 à 2022
    $yearColumns = [];
    $columnLetters = ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
                     'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP'];
    $years = range(1990, 2022);
    
    foreach ($columnLetters as $index => $column) {
        if (isset($years[$index])) {
            $yearColumns[$column] = $years[$index];
            $log("Colonne {$column} assignée manuellement à l'année {$years[$index]}");
        }
    }
    
    $log("Total années assignées: " . count($yearColumns));
    $log("Années et colonnes: " . json_encode($yearColumns));
    
    return $yearColumns;
}

    /**
     * Prépare les thèmes pour l'importation en base de données
     */
    public function PrepareThemesForDatabase(array $themes): array
    {
        return array_map(function ($theme) {
            // Déterminer le parent externe ID à partir du Parent_id ou du format hierarchique de l'externalId
            $parentExternalId = $theme['parentId'] ?: $this->getParentExternalId($theme['externalId']);
            
            $prepared = [
                'name' => $theme['name'],
                'externalId' => $theme['externalId'],
                'isSection' => $theme['isSection'] ?? false,
                'parentExternalId' => $parentExternalId,
                'parentName' => $theme['parentName'] ?? null,
                'source' => $theme['source'] ?? null,
                'link' => $theme['link'] ?? null,
                'geography' => $theme['geography'] ?? null,
                'unit' => $theme['unit'] ?? null,
                'years' => $theme['years'] ?? []
            ];
            
            return $prepared;
        }, $themes);
    }

    /**
     * Détermine l'ID externe du parent à partir de l'ID externe hiérarchique
     */
    private function getParentExternalId(string $externalId): ?string
    {
        $parts = explode('.', $externalId);
        if (count($parts) > 1) {
            array_pop($parts);
            return implode('.', $parts);
        }
        return null;
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

/**
 * Sauvegarde les thèmes en base de données avec debugging détaillé
 */
public function SaveThemesOnDatabase(array $arrayThemes): int
{
    // Activer le debug
    $debug = true;
    $debugFile = __DIR__ . '/import_debug.log';
    
    // Fonction de logging
    $log = function($message) use ($debug, $debugFile) {
        if ($debug) {
            file_put_contents($debugFile, date('Y-m-d H:i:s') . ' - ' . $message . PHP_EOL, FILE_APPEND);
        }
    };
    
    $log('Début de l\'importation - ' . count($arrayThemes) . ' thèmes à importer');
    
    // Vider la base de données avec des requêtes SQL directes pour éviter les problèmes de cascade
    $log('Suppression des données existantes');
    $this->entityManager->getConnection()->executeQuery('DELETE FROM theme_value');
    $this->entityManager->getConnection()->executeQuery('DELETE FROM theme');
    
    // Première passe: créer tous les thèmes
    $log('Première passe: création des thèmes');
    $themesByExternalId = [];
    
    foreach ($arrayThemes as $index => $theme) {
        $theme_to_write = new Theme();
        $theme_to_write->setExternalId($theme['externalId'])
            ->setName($theme['name'])
            ->setIsSection($theme['isSection']);
        
        // Seules les propriétés vraiment nécessaires
        if (isset($theme['source'])) {
            $theme_to_write->setSource($theme['source']);
        }
        if (isset($theme['link'])) {
            $theme_to_write->setLink($theme['link']);
        }
        if (isset($theme['geography'])) {
            $theme_to_write->setGeography($theme['geography']);
        }
        if (isset($theme['unit'])) {
            $theme_to_write->setUnit($theme['unit']);
        }
        
        $this->entityManager->persist($theme_to_write);
        $themesByExternalId[$theme['externalId']] = [
            'theme' => $theme_to_write,
            'parentExternalId' => $theme['parentExternalId'],
            'years' => $theme['years'] ?? []
        ];
        
        if (!empty($theme['years'])) {
            $log('Thème ' . $theme['externalId'] . ' a ' . count($theme['years']) . ' valeurs annuelles');
        }
    }
    
    // Flush pour générer les IDs
    $log('Flush pour générer les IDs des thèmes');
    try {
        $this->entityManager->flush();
        $log('Flush des thèmes réussi');
    } catch (\Exception $e) {
        $log('Erreur lors du flush des thèmes: ' . $e->getMessage());
        return 0;
    }
    
    // Deuxième passe: établir les relations parent-enfant
    $log('Deuxième passe: établissement des relations parent-enfant');
    foreach ($themesByExternalId as $externalId => $data) {
        $theme = $data['theme'];
        $parentExternalId = $data['parentExternalId'];
        
        if ($parentExternalId && isset($themesByExternalId[$parentExternalId])) {
            $parentTheme = $themesByExternalId[$parentExternalId]['theme'];
            $theme->setParentId($parentTheme->getId());
            $theme->setParent($parentTheme);
            $log("Thème {$externalId} attaché au parent {$parentExternalId} (ID: {$parentTheme->getId()})");
        }
    }
    
    // Flush pour enregistrer les relations
    $log('Flush pour enregistrer les relations parent-enfant');
    try {
        $this->entityManager->flush();
        $log('Flush des relations réussi');
    } catch (\Exception $e) {
        $log('Erreur lors du flush des relations: ' . $e->getMessage());
        return 0;
    }
    
    // Vérifier le nombre de valeurs à créer
    $totalValues = 0;
    $themesWithValues = 0;
    foreach ($themesByExternalId as $externalId => $data) {
        if (!empty($data['years'])) {
            $totalValues += count($data['years']);
            $themesWithValues++;
        }
    }
    $log("Total de {$totalValues} valeurs à créer pour {$themesWithValues} thèmes");
    
    // Si aucune valeur à créer, on s'arrête là
    if ($totalValues == 0) {
        $log("Aucune valeur à créer, importation terminée");
        return count($themesByExternalId);
    }
    
    // Troisième passe: ajouter les valeurs annuelles en mode batch
    $log('Troisième passe: ajout des valeurs annuelles');
    $batchSize = 20;
    $count = 0;
    $valueCount = 0;
    
    foreach ($themesByExternalId as $externalId => $data) {
        $theme = $data['theme'];
        $themeId = $theme->getId();
        
        // Créer explicitement les ThemeValue
        if (!empty($data['years'])) {
            $log("Traitement des " . count($data['years']) . " valeurs pour le thème {$externalId} (ID: {$themeId})");
            
            foreach ($data['years'] as $year => $value) {
                if ($value !== null && $value !== '') {
                    $log("Création ThemeValue: Thème ID={$themeId}, Année={$year}, Valeur={$value}");
                    
                    $themeValue = new ThemeValue();
                    $themeValue->setTheme($theme);
                    $themeValue->setYear((int)$year);
                    $themeValue->setValue((float)$value);
                    
                    // Vérifier que la valeur est bien définie
                    $log("Vérification ThemeValue: Theme=" . ($themeValue->getTheme() ? $themeValue->getTheme()->getId() : 'null') . 
                         ", Year=" . $themeValue->getYear() . 
                         ", Value=" . $themeValue->getValue());
                    
                    $this->entityManager->persist($themeValue);
                    
                    $valueCount++;
                    // Flush par lots pour éviter des problèmes de mémoire
                    if ($valueCount % $batchSize === 0) {
                        $log("Flush batch de {$batchSize} valeurs");
                        try {
                            $this->entityManager->flush();
                            $log("Batch #" . ($valueCount/$batchSize) . " enregistré avec succès");
                        } catch (\Exception $e) {
                            $log("Erreur lors du flush du batch #" . ($valueCount/$batchSize) . ": " . $e->getMessage());
                        }
                    }
                }
            }
        }
        
        $count++;
    }
    
    // Flush final pour sauvegarder les dernières valeurs
    if ($valueCount % $batchSize !== 0) {
        $log("Flush final des dernières " . ($valueCount % $batchSize) . " valeurs");
        try {
            $this->entityManager->flush();
            $log("Dernières valeurs enregistrées avec succès");
        } catch (\Exception $e) {
            $log("Erreur lors du flush final: " . $e->getMessage());
        }
    }
    
    $log("Importation terminée: {$count} thèmes et {$valueCount} valeurs créés");
    
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
                    'unit' => $theme->getUnit(),
                    'geography' => $theme->getGeography(),
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