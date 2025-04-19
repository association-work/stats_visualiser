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
        
        // Organiser par ID
        $themesById = [];
        foreach ($themes as $theme) {
            $themesById[$theme->getId()] = [
                'id' => $theme->getId(),
                'name' => $theme->getName(),
                'parentId' => $theme->getParentId(),
                'externalId' => $theme->getExternalId(),
                'children' => []
            ];
        }
        
        // Construire l'arborescence
        $tree = [];
        foreach ($themesById as $id => &$themeData) {
            $parentId = $themeData['parentId'];
            
            if ($parentId === null) {
                // C'est un nœud racine
                $tree[$id] = &$themeData;
            } else if (isset($themesById[$parentId])) {
                // Ajouter comme enfant de son parent
                $themesById[$parentId]['children'][$id] = &$themeData;
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
}
