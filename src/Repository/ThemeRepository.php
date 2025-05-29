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

    /**
     * Récupère tous les thèmes avec leur structure hiérarchique
     */
    public function findAllHierarchical(): array
    {
        $themes = $this->findAll();
        
        // Organiser par externalId
        $themesByExternalId = [];
        foreach ($themes as $theme) {
            // Récupérer les valeurs annuelles
            $values = [];
            foreach ($theme->getValues() as $themeValue) {
                $values[] = [
                    'year' => $themeValue->getYear(),
                    'value' => $themeValue->getValue()
                ];
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
                'geographyId' => $theme->getGeographyId(),
                'unit' => $theme->getUnit(),
                'isSummable' => $theme->getIsSummable(),
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
    
    /**
     * Détermine l'externalId du parent à partir de l'externalId de l'enfant
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
     * Récupère tous les thèmes avec leurs valeurs, sans structure hiérarchique
     */
    public function findAllWithValues(): array
    {
        $themes = $this->findAll();
        $result = [];
        
        foreach ($themes as $theme) {
            $values = [];
            foreach ($theme->getValues() as $themeValue) {
                $values[] = [
                    'year' => $themeValue->getYear(),
                    'value' => $themeValue->getValue()
                ];
            }
            
            $themeData = [
                'id' => $theme->getId(),
                'name' => $theme->getName(),
                'parentId' => $theme->getParentId(),
                'externalId' => $theme->getExternalId(),
                'isSection' => $theme->getIsSection(),
                'source' => $theme->getSource(),
                'link' => $theme->getLink(),
                'geography' => $theme->getGeography(),
                'geographyId' => $theme->getGeographyId(),
                'unit' => $theme->getUnit(),
                'isSummable' => $theme->getIsSummable(),
                'values' => $values
            ];
            
            $result[] = $themeData;
        }
        
        return $result;
    }
    
    /**
     * Trouve des thèmes par leur source
     */
    public function findBySource(string $source): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.source = :source')
            ->setParameter('source', $source)
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Trouve des thèmes par leur unité
     */
    public function findByUnit(string $unit): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.unit = :unit')
            ->setParameter('unit', $unit)
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Trouve des thèmes par leur géographie
     */
    public function findByGeography(string $geography): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.geography = :geography')
            ->setParameter('geography', $geography)
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Trouve des thèmes par leur ID de géographie
     */
    public function findByGeographyId(string $geographyId): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.geographyId = :geographyId')
            ->setParameter('geographyId', $geographyId)
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Trouve des thèmes sommables
     */
    public function findSummableThemes(): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.isSummable = :isSummable')
            ->setParameter('isSummable', true)
            ->getQuery()
            ->getResult();
    }
}