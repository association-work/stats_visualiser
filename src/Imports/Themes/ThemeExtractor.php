<?php
namespace App\Imports\Themes;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use App\Imports\Base\BaseExtractor;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ThemeExtractor extends BaseExtractor
{
    /**
     * La ligne d'en-tête pour les thèmes est la ligne 2
     */
    protected function getHeaderRowIndex(): int
    {
        return 2;
    }
    
    /**
     * Définit le mapping des colonnes pour l'extraction des thèmes
     */
    protected function getColumnMappings(array $headers, Worksheet $sheet): array
    {
        $mappings = [
            'category' => 'A',       // Catégorie
            'externalId' => 'B',     // Catégorie_id
            'isData' => 'C',         // Data/Section
            'source' => 'D',         // Source
            'link' => 'E',           // Lien
            'geography' => 'F',      // Géographie
            'geographyId' => 'G',    // Géographie_id
            'unit' => 'H',           // Unité
            'dataSum' => 'I',        // Data sommables/ratio
            'yearColumns' => $this->detectYearColumns($sheet),
        ];
        
        $this->logger->log("Mapping des colonnes: " . json_encode($mappings));
        return $mappings;
    }
    
    /**
     * Détecte les colonnes d'années
     */
    protected function detectYearColumns(Worksheet $sheet): array
    {
        $yearColumns = [];
        $headerRow = $this->getHeaderRowIndex();
        
        $this->logger->log("Détection des colonnes d'années...");
        
        // Commencer à la colonne J 
        $colIndex = 10; // 'J' en index numérique
        $lastColumn = $sheet->getHighestColumn();
        $lastColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($lastColumn);
        
        for ($i = $colIndex; $i <= $lastColumnIndex; $i++) {
            $column = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($i);
            $cellValue = $sheet->getCell($column . $headerRow)->getValue();
            
            // Vérifier si c'est une année (format numérique 4 chiffres)
            if (is_numeric($cellValue) || (is_string($cellValue) && preg_match('/^[0-9]{4}$/', trim($cellValue)))) {
                $year = (int)$cellValue;
                $yearColumns[$column] = $year;
                $this->logger->log("Colonne {$column}: année {$year} détectée");
            } else {
                $hasData = $this->columnHasData($sheet, $column, $headerRow + 1);
                
                if ($hasData) {
                    $this->logger->log("Colonne {$column}: contient des données mais n'est pas reconnue comme une année");
                } else {
                    $this->logger->log("Colonne {$column}: vide ou sans données numériques, ignorée");
                }
            }
        }
        
        $this->logger->log("Total années détectées: " . count($yearColumns));
        
        return $yearColumns;
    }
    
    /**
     * Traite les lignes du fichier Excel
     */
    protected function processExcelRows(Worksheet $sheet, array $columnMappings): array
    {
        $themes = [];
        $rowCount = 0;
        $dataStartRow = $this->getHeaderRowIndex() + 1; // Commence après la ligne d'en-tête
        
        foreach ($sheet->getRowIterator($dataStartRow) as $row) {
            $rowIndex = $row->getRowIndex();
            $rowCount++;
            
            // Extraire les données de base
            $theme = $this->extractRowData($sheet, $rowIndex, $columnMappings);
            
            if (empty($theme['externalId'])) {
                $this->logger->log("Ligne {$rowIndex}: Pas d'ID externe, ignorée");
                continue;
            }
            
            $this->logger->log("Ligne {$rowIndex}: Catégorie '{$theme['name']}' (ID: {$theme['externalId']})");
            
            // Extraire les valeurs annuelles
            $theme['years'] = $this->extractYearValues($sheet, $rowIndex, $columnMappings['yearColumns']);
            
            $themes[] = $theme;
        }
        
        $this->logExtractionSummary($rowCount, count($themes), $themes);
        
        return $themes;
    }
    
    /**
     * Extrait les données d'une ligne
     */
    protected function extractRowData(Worksheet $sheet, int $rowIndex, array $columnMappings): array
    {
        $category = $sheet->getCell($columnMappings['category'] . $rowIndex)->getValue();
        $categoryId = $sheet->getCell($columnMappings['externalId'] . $rowIndex)->getValue();
        $isData = $sheet->getCell($columnMappings['isData'] . $rowIndex)->getValue();
        $isSection = $isData === 'S';
        $source = $sheet->getCell($columnMappings['source'] . $rowIndex)->getValue();
        $link = $sheet->getCell($columnMappings['link'] . $rowIndex)->getValue();
        $geography = $sheet->getCell($columnMappings['geography'] . $rowIndex)->getValue();
        $geographyId = $sheet->getCell($columnMappings['geographyId'] . $rowIndex)->getValue();
        $unit = $sheet->getCell($columnMappings['unit'] . $rowIndex)->getValue();
        $dataSum = $sheet->getCell($columnMappings['dataSum'] . $rowIndex)->getValue();
        
        // Déterminer la structure parente/enfant
        $parentId = null;
        if (strpos($categoryId, '.') !== false) {
            $parts = explode('.', $categoryId);
            array_pop($parts);
            $parentId = implode('.', $parts);
        }
        
        return [
            'externalId' => $categoryId,
            'name' => $category,
            'parentId' => $parentId,
            'isSection' => $isSection,
            'source' => $source,
            'link' => $link,
            'geography' => $geography,
            'geographyId' => $geographyId,
            'unit' => $unit,
            'isSummable' => $dataSum === 'sommable'
        ];
    }
    
    /**
     * Extrait les valeurs annuelles
     */
    protected function extractYearValues(Worksheet $sheet, int $rowIndex, array $yearColumns): array
    {
        $values = [];
        
        foreach ($yearColumns as $column => $year) {
            $cell = $sheet->getCell($column . $rowIndex);
            $value = $cell->getValue();
            
            if ($value !== null && $value !== '') {
                // Convertir la valeur
                if (is_string($value)) {
                    $value = str_replace(',', '.', $value);
                }
                $numericValue = (float)$value;
                
                $values[$year] = $numericValue;
            }
        }
        
        return $values;
    }
    
    /**
     * Prépare les thèmes pour la base de données
     */
    public function prepareForDatabase(array $themes): array
    {
        return array_map(function ($theme) {
            // Déterminer le parent externe ID
            $parentExternalId = $theme['parentId'] ?: $this->getParentExternalId($theme['externalId']);
            
            $prepared = [
                'name' => $theme['name'],
                'externalId' => $theme['externalId'],
                'isSection' => $theme['isSection'] ?? false,
                'parentExternalId' => $parentExternalId,
                'source' => $theme['source'] ?? null,
                'link' => $theme['link'] ?? null,
                'geography' => $theme['geography'] ?? null,
                'geographyId' => $theme['geographyId'] ?? null,
                'unit' => $theme['unit'] ?? null,
                'isSummable' => $theme['isSummable'] ?? false,
                'years' => $theme['years'] ?? []
            ];
            
            return $prepared;
        }, $themes);
    }
    
    /**
     * Détermine l'ID externe du parent
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
     * Valide les données extraites
     */
    public function validateData(array $themes): array
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
     * Sauvegarde les thèmes en base de données
     */
    public function saveToDatabase(array $themes): int
    {
        $this->logger->log('Début de l\'importation - ' . count($themes) . ' thèmes à importer');
        
        $themeRepo = $this->entityManager->getRepository(Theme::class);
        
        // Récupérer les thèmes existants
        $existingThemes = [];
        foreach ($themeRepo->findAll() as $theme) {
            $existingThemes[$theme->getExternalId()] = $theme;
        }
        
        $themesByExternalId = [];
        $updated = 0;
        $created = 0;
        
        // Première passe: créer ou mettre à jour les thèmes
        foreach ($themes as $themeData) {
            $externalId = $themeData['externalId'];
            
            if (isset($existingThemes[$externalId])) {
                $theme = $existingThemes[$externalId];
                $this->updateThemeEntity($theme, $themeData);
                $updated++;
            } else {
                $theme = $this->createThemeEntity($themeData);
                $created++;
            }
            
            $themesByExternalId[$externalId] = [
                'theme' => $theme,
                'parentExternalId' => $themeData['parentExternalId'],
                'years' => $themeData['years'] ?? []
            ];
        }
        
        // Flush pour générer les IDs
        try {
            $this->entityManager->flush();
            $this->logger->log("Thèmes enregistrés: {$created} créés, {$updated} mis à jour");
        } catch (\Exception $e) {
            $this->logger->log('Erreur: ' . $e->getMessage());
            return 0;
        }
        
        // Deuxième passe: relations parent-enfant
        foreach ($themesByExternalId as $externalId => $data) {
            $theme = $data['theme'];
            $parentExternalId = $data['parentExternalId'];
            
            if ($parentExternalId && isset($themesByExternalId[$parentExternalId])) {
                $parentTheme = $themesByExternalId[$parentExternalId]['theme'];
                $theme->setParentId($parentTheme->getId());
                $theme->setParent($parentTheme);
            } else {
                $theme->setParentId(null);
                $theme->setParent(null);
            }
        }
        
        // Flush pour les relations
        try {
            $this->entityManager->flush();
            $this->logger->log("Relations parent-enfant établies");
        } catch (\Exception $e) {
            $this->logger->log('Erreur: ' . $e->getMessage());
            return 0;
        }
        
        // Supprimer les anciennes valeurs
        foreach ($themesByExternalId as $externalId => $data) {
            if (!empty($data['years'])) {
                try {
                    $this->entityManager->getConnection()->executeQuery(
                        'DELETE FROM theme_value WHERE theme_id = :themeId',
                        ['themeId' => $data['theme']->getId()]
                    );
                } catch (\Exception $e) {
                    $this->logger->log('Erreur: ' . $e->getMessage());
                }
            }
        }
        
        // Troisième passe: créer les valeurs
        $valueCount = 0;
        $batchSize = 20;
        
        foreach ($themesByExternalId as $externalId => $data) {
            $theme = $data['theme'];
            
            foreach ($data['years'] as $year => $value) {
                if ($value !== null && $value !== '') {
                    $themeValue = new ThemeValue();
                    $themeValue->setTheme($theme);
                    $themeValue->setYear((int)$year);
                    $themeValue->setValue((float)$value);
                    
                    $this->entityManager->persist($themeValue);
                    $valueCount++;
                    
                    if ($valueCount % $batchSize === 0) {
                        $this->entityManager->flush();
                    }
                }
            }
        }
        
        // Flush final
        if ($valueCount % $batchSize !== 0) {
            $this->entityManager->flush();
        }
        
        $this->logger->log("Importation terminée: {$valueCount} valeurs créées");
        
        return count($themes);
    }
    
    /**
     * Met à jour une entité Theme existante
     */
    private function updateThemeEntity(Theme $theme, array $data): void
    {
        $theme->setName($data['name']);
        $theme->setIsSection($data['isSection']);
        
        if (isset($data['source'])) {
            $theme->setSource($data['source']);
        }
        if (isset($data['link'])) {
            $theme->setLink($data['link']);
        }
        if (isset($data['geography'])) {
            $theme->setGeography($data['geography']);
        }
        if (isset($data['geographyId'])) {
            $theme->setGeographyId($data['geographyId']);
        }
        if (isset($data['unit'])) {
            $theme->setUnit($data['unit']);
        }
        if (isset($data['isSummable'])) {
            $theme->setIsSummable($data['isSummable']);
        }
    }
    
    /**
     * Crée une nouvelle entité Theme
     */
    private function createThemeEntity(array $data): Theme
    {
        $theme = new Theme();
        $theme->setExternalId($data['externalId']);
        $theme->setName($data['name']);
        $theme->setIsSection($data['isSection']);
        
        if (isset($data['source'])) {
            $theme->setSource($data['source']);
        }
        if (isset($data['link'])) {
            $theme->setLink($data['link']);
        }
        if (isset($data['geography'])) {
            $theme->setGeography($data['geography']);
        }
        if (isset($data['geographyId'])) {
            $theme->setGeographyId($data['geographyId']);
        }
        if (isset($data['unit'])) {
            $theme->setUnit($data['unit']);
        }
        if (isset($data['isSummable'])) {
            $theme->setIsSummable($data['isSummable']);
        }
        
        $this->entityManager->persist($theme);
        return $theme;
    }
}