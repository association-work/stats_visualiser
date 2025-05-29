<?php
namespace App\Repository;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ThemeValueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ThemeValue::class);
    }
    
    /**
     * Trouve les valeurs pour un thème donné
     */
    public function findByTheme(Theme $theme): array
    {
        return $this->createQueryBuilder('tv')
            ->andWhere('tv.theme = :theme')
            ->setParameter('theme', $theme)
            ->orderBy('tv.year', 'ASC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Trouve les valeurs pour une année donnée
     */
    public function findByYear(int $year): array
    {
        return $this->createQueryBuilder('tv')
            ->andWhere('tv.year = :year')
            ->setParameter('year', $year)
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Trouve les valeurs pour un thème et une année donnés
     */
    public function findByThemeAndYear(Theme $theme, int $year): ?ThemeValue
    {
        return $this->createQueryBuilder('tv')
            ->andWhere('tv.theme = :theme')
            ->andWhere('tv.year = :year')
            ->setParameter('theme', $theme)
            ->setParameter('year', $year)
            ->getQuery()
            ->getOneOrNullResult();
    }
    
    /**
     * Récupère la valeur moyenne pour tous les thèmes d'une année donnée
     */
    public function getAverageValueByYear(int $year): ?float
    {
        $result = $this->createQueryBuilder('tv')
            ->select('AVG(tv.value) as avgValue')
            ->andWhere('tv.year = :year')
            ->setParameter('year', $year)
            ->getQuery()
            ->getOneOrNullResult();
            
        return $result ? $result['avgValue'] : null;
    }
    
    /**
     * Récupère les années disponibles dans la base de données
     */
    public function getAvailableYears(): array
    {
        $result = $this->createQueryBuilder('tv')
            ->select('DISTINCT tv.year')
            ->orderBy('tv.year', 'ASC')
            ->getQuery()
            ->getResult();
            
        return array_map(function($item) {
            return $item['year'];
        }, $result);
    }
    
    /**
     * Met à jour ou crée une valeur pour un thème et une année
     */
    public function updateOrCreateValue(Theme $theme, int $year, float $value): ThemeValue
    {
        $themeValue = $this->findByThemeAndYear($theme, $year);
        
        if (!$themeValue) {
            $themeValue = new ThemeValue();
            $themeValue->setTheme($theme);
            $themeValue->setYear($year);
        }
        
        $themeValue->setValue($value);
        
        $entityManager = $this->getEntityManager();
        $entityManager->persist($themeValue);
        $entityManager->flush();
        
        return $themeValue;
    }
    
    /**
     * Supprime les valeurs d'un thème donné
     */
    public function removeValuesByTheme(Theme $theme): int
    {
        return $this->createQueryBuilder('tv')
            ->delete()
            ->andWhere('tv.theme = :theme')
            ->setParameter('theme', $theme)
            ->getQuery()
            ->execute();
    }

    /**
     * Trouve les valeurs pour tous les thèmes sommables pour une année donnée
     */
    public function findSummableValuesByYear(int $year): array
    {
        return $this->createQueryBuilder('tv')
            ->join('tv.theme', 't')
            ->andWhere('tv.year = :year')
            ->andWhere('t.isSummable = :isSummable')
            ->setParameter('year', $year)
            ->setParameter('isSummable', true)
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Récupère la somme des valeurs de tous les thèmes sommables pour une année donnée
     */
    public function getSumValueBySummableThemesAndYear(int $year): ?float
    {
        $result = $this->createQueryBuilder('tv')
            ->select('SUM(tv.value) as sumValue')
            ->join('tv.theme', 't')
            ->andWhere('tv.year = :year')
            ->andWhere('t.isSummable = :isSummable')
            ->setParameter('year', $year)
            ->setParameter('isSummable', true)
            ->getQuery()
            ->getOneOrNullResult();
            
        return $result ? $result['sumValue'] : null;
    }
    
    /**
     * Récupère la somme des valeurs par géographie pour une année donnée
     */
    public function getSumValueByGeographyAndYear(string $geographyId, int $year): ?float
    {
        $result = $this->createQueryBuilder('tv')
            ->select('SUM(tv.value) as sumValue')
            ->join('tv.theme', 't')
            ->andWhere('t.geographyId = :geographyId')
            ->andWhere('tv.year = :year')
            ->andWhere('t.isSummable = :isSummable')
            ->setParameter('geographyId', $geographyId)
            ->setParameter('year', $year)
            ->setParameter('isSummable', true)
            ->getQuery()
            ->getOneOrNullResult();
            
        return $result ? $result['sumValue'] : null;
    }
}