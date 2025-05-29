<?php
namespace App\Imports\Interfaces;

interface DataExtractorInterface
{
    /**
     * Extrait les données d'un fichier
     */
    public function extractFromFile(string $file_path): array;
    
    /**
     * Prépare les données pour la persistance
     */
    public function prepareForDatabase(array $data): array;
    
    /**
     * Valide les données extraites
     */
    public function validateData(array $data): array;
    
    /**
     * Sauvegarde les données en base de données
     */
    public function saveToDatabase(array $data): int;
}