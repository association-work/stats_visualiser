<?php
namespace App\Imports;

use App\Imports\Interfaces\DataExtractorInterface;
use App\Imports\Themes\ThemeExtractor;
use Doctrine\ORM\EntityManagerInterface;

class ExtractService
{
    private EntityManagerInterface $entityManager;
    private array $extractors = [];

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        
        // Enregistrement des extracteurs disponibles
        $this->registerExtractors();
    }

    /**
     * Enregistre les extracteurs disponibles
     */
    private function registerExtractors(): void
    {
        // Extracteur de thèmes
        $this->extractors['themes'] = new ThemeExtractor($this->entityManager);
        
        // Vous pouvez ajouter d'autres extracteurs ici à l'avenir
        // $this->extractors['another_type'] = new AnotherExtractor($this->entityManager);
    }

    /**
     * Obtient un extracteur par son type
     */
    public function getExtractor(string $type): DataExtractorInterface
    {
        if (!isset($this->extractors[$type])) {
            throw new \InvalidArgumentException("Extracteur de type '{$type}' non disponible");
        }
        
        return $this->extractors[$type];
    }

    /**
     * Extrait des données d'un fichier
     */
    public function extractFromFile(string $type, string $file_path): array
    {
        $extractor = $this->getExtractor($type);
        return $extractor->extractFromFile($file_path);
    }

    /**
     * Prépare des données pour la base de données
     */
    public function prepareForDatabase(string $type, array $data): array
    {
        $extractor = $this->getExtractor($type);
        return $extractor->prepareForDatabase($data);
    }

    /**
     * Valide des données extraites
     */
    public function validateData(string $type, array $data): array
    {
        $extractor = $this->getExtractor($type);
        return $extractor->validateData($data);
    }

    /**
     * Sauvegarde des données en base de données
     */
    public function saveToDatabase(string $type, array $data): int
    {
        $extractor = $this->getExtractor($type);
        return $extractor->saveToDatabase($data);
    }

    /**
     * Effectue le processus complet d'extraction, validation et sauvegarde
     */
    public function processFile(string $type, string $file_path): int
    {
        $extractor = $this->getExtractor($type);
        
        // Extraction
        $extractedData = $extractor->extractFromFile($file_path);
        
        // Préparation
        $preparedData = $extractor->prepareForDatabase($extractedData);
        
        // Validation
        $errors = $extractor->validateData($preparedData);
        if (!empty($errors)) {
            throw new \RuntimeException("Erreurs de validation détectées: " . implode(", ", array_slice($errors, 0, 5)) . (count($errors) > 5 ? " et " . (count($errors) - 5) . " autres" : ""));
        }
        
        // Sauvegarde
        return $extractor->saveToDatabase($preparedData);
    }
}