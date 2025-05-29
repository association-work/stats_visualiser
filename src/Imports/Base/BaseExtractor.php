<?php
namespace App\Imports\Base;

use App\Imports\Interfaces\DataExtractorInterface;
use App\Imports\Util\Logger;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;

abstract class BaseExtractor implements DataExtractorInterface
{
    protected EntityManagerInterface $entityManager;
    protected Logger $logger;
    protected string $logFilePrefix;
    
    public function __construct(EntityManagerInterface $entityManager, string $logFilePrefix = 'extraction')
    {
        $this->entityManager = $entityManager;
        $this->logFilePrefix = $logFilePrefix;
        $this->logger = new Logger(true, __DIR__ . "/{$logFilePrefix}_debug.log");
    }
    
    /**
     * Méthode principale d'extraction
     */
    public function extractFromFile(string $file_path): array
    {
        if (!file_exists($file_path)) {
            throw new FileNotFoundException(sprintf('File "%s" not found', $file_path));
        }
        
        $this->logger->log("Début de l'analyse du fichier: " . $file_path);
        
        // Détecter le type de fichier et utiliser l'extracteur approprié
        if ($this->isExcelFile($file_path)) {
            return $this->extractFromExcel($file_path);
        } elseif ($this->isCsvFile($file_path)) {
            return $this->extractFromCsv($file_path);
        } else {
            throw new \InvalidArgumentException("Type de fichier non supporté: " . $file_path);
        }
    }
    
    /**
     * Détermine si le fichier est un fichier Excel
     */
    protected function isExcelFile(string $file_path): bool
    {
        $extension = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));
        return in_array($extension, ['xlsx', 'xls', 'xlsm']);
    }
    
    /**
     * Détermine si le fichier est un fichier CSV
     */
    protected function isCsvFile(string $file_path): bool
    {
        $extension = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));
        return $extension === 'csv';
    }
    
    /**
     * Extrait les données d'un fichier Excel
     */
    protected function extractFromExcel(string $file_path): array
    {
        $spreadsheet = IOFactory::load($file_path);
        $sheet = $spreadsheet->getActiveSheet();
        $this->logger->log("Feuille active: " . $sheet->getTitle());
        
        // Obtenir les en-têtes de colonnes
        $headers = $this->getHeadersFromExcel($sheet);
        
        // Détecter les colonnes spécifiques au type de données
        $columnMappings = $this->getColumnMappings($headers, $sheet);
        
        // Traiter les lignes de données
        return $this->processExcelRows($sheet, $columnMappings);
    }
    
    /**
     * Extrait les données d'un fichier CSV
     */
    protected function extractFromCsv(string $file_path): array
    {
        // À implémenter selon vos besoins
        $this->logger->log("Extraction CSV non implémentée");
        return [];
    }
    
    /**
     * Récupère les en-têtes d'un fichier Excel
     */
    protected function getHeadersFromExcel(Worksheet $sheet): array
    {
        $headerRow = $this->getHeaderRowIndex();
        $headers = [];
        
        $highestColumn = $sheet->getHighestColumn();
        $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);
        
        for ($col = 1; $col <= $highestColumnIndex; $col++) {
            $column = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
            $cellValue = $sheet->getCell($column . $headerRow)->getValue();
            if (!empty($cellValue)) {
                $headers[$column] = $cellValue;
            }
        }
        
        $this->logger->log("En-têtes détectés: " . json_encode($headers));
        return $headers;
    }
    
    /**
     * Interface pour les classes enfant pour spécifier l'index de la ligne d'en-tête
     */
    abstract protected function getHeaderRowIndex(): int;
    
    /**
     * Interface pour les classes enfant pour spécifier le mapping des colonnes
     */
    abstract protected function getColumnMappings(array $headers, Worksheet $sheet): array;
    
    /**
     * Interface pour les classes enfant pour le traitement des lignes Excel
     */
    abstract protected function processExcelRows(Worksheet $sheet, array $columnMappings): array;
    
    /**
     * Vérifie si une colonne contient des données
     */
    protected function columnHasData(Worksheet $sheet, string $column, int $startRow, int $maxRowsToCheck = 10): bool
    {
        $maxRow = min($sheet->getHighestRow(), $startRow + $maxRowsToCheck);
        
        for ($row = $startRow; $row <= $maxRow; $row++) {
            $value = $sheet->getCell($column . $row)->getValue();
            if (!empty($value)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Journalise un résumé des données extraites
     */
    protected function logExtractionSummary(int $rowCount, int $extractedCount, array $sample): void
    {
        $this->logger->log("Analyse terminée:");
        $this->logger->log("- {$rowCount} lignes traitées");
        $this->logger->log("- {$extractedCount} éléments extraits");
        
        // Afficher quelques exemples
        for ($i = 0; $i < min(3, count($sample)); $i++) {
            $this->logger->log("Exemple #" . ($i+1) . ": " . json_encode($sample[$i]));
        }
    }
}