<?php
namespace App\Repository;

use App\Entity\Theme;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ThemeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Theme::class);
    }

    public function findAllHierarchical(): array
    {
        $themes = $this->findAll();
        
        // Organiser par externalId
        $themesByExternalId = [];
        foreach ($themes as $theme) {
            // Récupérer les valeurs annuelles
            $values = [];
            foreach ($theme->getValues() as $themeValue) {
                $values[$themeValue->getYear()] = $themeValue->getValue();
            }
            
            $themesByExternalId[$theme->getExternalId()] = [
                'id' => $theme->getId(),
                'name' => $theme->getName(),
                'parentId' => $theme->getParentId(),
                'externalId' => $theme->getExternalId(),
                'isSection' => $theme->getIsSection(),
                'source' => $theme->getSource(),
                'link' => $theme->getLink(),
                'geography' => $theme->getGeography(),
                'unit' => $theme->getUnit(),
                'values' => $values,
                'children' => []
            ];
        }
        
        // Construire l'arborescence en utilisant l'externalId
        $tree = [];
        foreach ($themesByExternalId as $externalId => &$themeData) {
            // Déterminer le parent basé sur l'externalId
            $parentExternalId = $this->getParentExternalId($externalId);
            
            if (!$parentExternalId || !isset($themesByExternalId[$parentExternalId])) {
                // C'est un nœud racine
                $tree[$externalId] = &$themeData;
            } else {
                // Ajouter comme enfant de son parent
                $themesByExternalId[$parentExternalId]['children'][$externalId] = &$themeData;
            }
        }
        
        // Convertir les tableaux associatifs d'enfants en tableaux simples
        $convertToArray = function(&$node) use (&$convertToArray) {
            if (!empty($node['children'])) {
                $node['children'] = array_values($node['children']);
                foreach ($node['children'] as &$child) {
                    $convertToArray($child);
                }
            }
            return $node;
        };
        
        foreach ($tree as &$rootNode) {
            $convertToArray($rootNode);
        }
        
        return array_values($tree);
    }
    
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
     * Récupère tous les thèmes avec leurs valeurs, sans structure hiérarchique
     */
    public function findAllWithValues(): array
    {
        $themes = $this->findAll();
        $result = [];
        
        foreach ($themes as $theme) {
            $themeData = [
                'id' => $theme->getId(),
                'name' => $theme->getName(),
                'parentId' => $theme->getParentId(),
                'externalId' => $theme->getExternalId(),
                'isSection' => $theme->getIsSection(),
                'source' => $theme->getSource(),
                'link' => $theme->getLink(),
                'geography' => $theme->getGeography(),
                'unit' => $theme->getUnit(),
                'values' => []
            ];
            
            // Récupérer les valeurs annuelles
            foreach ($theme->getValues() as $themeValue) {
                $themeData['values'][$themeValue->getYear()] = $themeValue->getValue();
            }
            
            $result[] = $themeData;
        }
        
        return $result;
    }
}