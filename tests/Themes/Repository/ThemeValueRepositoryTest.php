<?php

namespace App\Tests\Themes\Repository;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ThemeValueRepositoryTest extends KernelTestCase
{
    private $entityManager;
    private $themeValueRepository;
    private $themeRepository;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $container = static::getContainer();
        $this->entityManager = $container->get('doctrine.orm.entity_manager');
        $this->themeValueRepository = $this->entityManager->getRepository(ThemeValue::class);
        $this->themeRepository = $this->entityManager->getRepository(Theme::class);
    }

    protected function tearDown(): void
    {
        // Nettoyer les ThemeValues en premier (contrainte FK)
        $themeValues = $this->themeValueRepository->findAll();
        foreach ($themeValues as $themeValue) {
            $this->entityManager->remove($themeValue);
        }
        
        // Ensuite nettoyer les Themes
        $themes = $this->themeRepository->findAll();
        foreach ($themes as $theme) {
            $this->entityManager->remove($theme);
        }
        
        $this->entityManager->flush();
        parent::tearDown();
    }

    public function testFindByTheme(): void
    {
        // Créer un thème
        $theme = $this->createTestTheme('Test Theme', 'T1');
        
        // Créer des valeurs pour ce thème
        $this->createTestThemeValue($theme, 2020, 100.5);
        $this->createTestThemeValue($theme, 2021, 150.75);
        $this->createTestThemeValue($theme, 2022, 200.25);
        
        // Tester la récupération des valeurs par thème
        $values = $this->themeValueRepository->findByTheme($theme);
        
        $this->assertCount(3, $values);
        // Vérifier que les valeurs sont triées par année
        $this->assertEquals(2020, $values[0]->getYear());
        $this->assertEquals(2021, $values[1]->getYear());
        $this->assertEquals(2022, $values[2]->getYear());
    }

    public function testFindByYear(): void
    {
        // Créer deux thèmes
        $theme1 = $this->createTestTheme('Theme 1', 'T1');
        $theme2 = $this->createTestTheme('Theme 2', 'T2');
        
        // Créer des valeurs pour 2021
        $this->createTestThemeValue($theme1, 2021, 100.0);
        $this->createTestThemeValue($theme2, 2021, 200.0);
        $this->createTestThemeValue($theme1, 2022, 300.0); // Différente année
        
        // Tester la récupération par année
        $values = $this->themeValueRepository->findByYear(2021);
        
        $this->assertCount(2, $values);
        foreach ($values as $value) {
            $this->assertEquals(2021, $value->getYear());
        }
    }

    public function testFindByThemeAndYear(): void
    {
        $theme = $this->createTestTheme('Test Theme', 'T1');
        $this->createTestThemeValue($theme, 2021, 150.5);
        
        // Test avec un thème et année existants
        $value = $this->themeValueRepository->findByThemeAndYear($theme, 2021);
        $this->assertNotNull($value);
        $this->assertEquals(150.5, $value->getValue());
        
        // Test avec une année inexistante
        $value = $this->themeValueRepository->findByThemeAndYear($theme, 2025);
        $this->assertNull($value);
    }

    public function testGetAverageValueByYear(): void
    {
        $theme1 = $this->createTestTheme('Theme 1', 'T1');
        $theme2 = $this->createTestTheme('Theme 2', 'T2');
        
        // Créer des valeurs pour 2021: 100 et 200 (moyenne = 150)
        $this->createTestThemeValue($theme1, 2021, 100.0);
        $this->createTestThemeValue($theme2, 2021, 200.0);
        
        $average = $this->themeValueRepository->getAverageValueByYear(2021);
        $this->assertEquals(150.0, $average);
        
        // Test avec une année sans données
        $average = $this->themeValueRepository->getAverageValueByYear(2025);
        $this->assertNull($average);
    }

    public function testGetAvailableYears(): void
    {
        $theme = $this->createTestTheme('Test Theme', 'T1');
        
        // Créer des valeurs pour différentes années
        $this->createTestThemeValue($theme, 2020, 100.0);
        $this->createTestThemeValue($theme, 2022, 200.0);
        $this->createTestThemeValue($theme, 2021, 150.0);
        
        $years = $this->themeValueRepository->getAvailableYears();
        
        $this->assertCount(3, $years);
        $this->assertEquals([2020, 2021, 2022], $years); // Doit être trié
    }

    public function testUpdateOrCreateValue(): void
    {
        $theme = $this->createTestTheme('Test Theme', 'T1');
        
        // Test création d'une nouvelle valeur
        $themeValue = $this->themeValueRepository->updateOrCreateValue($theme, 2021, 100.5);
        $this->assertNotNull($themeValue->getId());
        $this->assertEquals(100.5, $themeValue->getValue());
        
        // Test mise à jour d'une valeur existante
        $updatedValue = $this->themeValueRepository->updateOrCreateValue($theme, 2021, 200.75);
        $this->assertEquals($themeValue->getId(), $updatedValue->getId());
        $this->assertEquals(200.75, $updatedValue->getValue());
        
        // Vérifier qu'il n'y a toujours qu'une seule valeur
        $values = $this->themeValueRepository->findByTheme($theme);
        $this->assertCount(1, $values);
    }

    public function testRemoveValuesByTheme(): void
    {
        $theme1 = $this->createTestTheme('Theme 1', 'T1');
        $theme2 = $this->createTestTheme('Theme 2', 'T2');
        
        // Créer des valeurs pour les deux thèmes
        $this->createTestThemeValue($theme1, 2021, 100.0);
        $this->createTestThemeValue($theme1, 2022, 150.0);
        $this->createTestThemeValue($theme2, 2021, 200.0);
        
        // Supprimer les valeurs du premier thème
        $deletedCount = $this->themeValueRepository->removeValuesByTheme($theme1);
        
        $this->assertEquals(2, $deletedCount);
        
        // Vérifier que seules les valeurs du theme2 restent
        $remainingValues = $this->themeValueRepository->findAll();
        $this->assertCount(1, $remainingValues);
        $this->assertEquals($theme2->getId(), $remainingValues[0]->getTheme()->getId());
    }

    public function testFindSummableValuesByYear(): void
    {
        // Créer des thèmes sommables et non-sommables
        $summableTheme = $this->createTestTheme('Summable Theme', 'S1', true);
        $nonSummableTheme = $this->createTestTheme('Non-Summable Theme', 'N1', false);
        
        // Créer des valeurs
        $this->createTestThemeValue($summableTheme, 2021, 100.0);
        $this->createTestThemeValue($nonSummableTheme, 2021, 200.0);
        
        $summableValues = $this->themeValueRepository->findSummableValuesByYear(2021);
        
        $this->assertCount(1, $summableValues);
        $this->assertEquals(100.0, $summableValues[0]->getValue());
    }

    public function testGetSumValueBySummableThemesAndYear(): void
    {
        // Créer des thèmes sommables et non-sommables
        $summable1 = $this->createTestTheme('Summable 1', 'S1', true);
        $summable2 = $this->createTestTheme('Summable 2', 'S2', true);
        $nonSummable = $this->createTestTheme('Non-Summable', 'N1', false);
        
        // Créer des valeurs pour 2021
        $this->createTestThemeValue($summable1, 2021, 100.0);
        $this->createTestThemeValue($summable2, 2021, 150.0);
        $this->createTestThemeValue($nonSummable, 2021, 200.0); // Ne doit pas être inclus
        
        $sum = $this->themeValueRepository->getSumValueBySummableThemesAndYear(2021);
        
        $this->assertEquals(250.0, $sum); // 100 + 150
        
        // Test avec une année sans données
        $sum = $this->themeValueRepository->getSumValueBySummableThemesAndYear(2025);
        $this->assertNull($sum);
    }

    public function testGetSumValueByGeographyAndYear(): void
    {
        // Créer des thèmes sommables avec différentes géographies
        $france1 = $this->createTestTheme('France 1', 'F1', true, 'France', 'FR');
        $france2 = $this->createTestTheme('France 2', 'F2', true, 'France', 'FR');
        $germany = $this->createTestTheme('Germany', 'G1', true, 'Germany', 'DE');
        
        // Créer des valeurs
        $this->createTestThemeValue($france1, 2021, 100.0);
        $this->createTestThemeValue($france2, 2021, 150.0);
        $this->createTestThemeValue($germany, 2021, 200.0);
        
        $franceSum = $this->themeValueRepository->getSumValueByGeographyAndYear('FR', 2021);
        $this->assertEquals(250.0, $franceSum); // 100 + 150
        
        $germanySum = $this->themeValueRepository->getSumValueByGeographyAndYear('DE', 2021);
        $this->assertEquals(200.0, $germanySum);
        
        // Test avec une géographie inexistante
        $unknownSum = $this->themeValueRepository->getSumValueByGeographyAndYear('XX', 2021);
        $this->assertNull($unknownSum);
    }

    // Méthodes utilitaires pour les tests

    private function createTestTheme(
        string $name, 
        string $externalId, 
        bool $isSummable = false, 
        ?string $geography = null, 
        ?string $geographyId = null
    ): Theme {
        $theme = new Theme();
        $theme->setName($name);
        $theme->setExternalId($externalId);
        $theme->setIsSection(false);
        $theme->setIsSummable($isSummable);
        
        if ($geography) {
            $theme->setGeography($geography);
        }
        if ($geographyId) {
            $theme->setGeographyId($geographyId);
        }
        
        $this->entityManager->persist($theme);
        $this->entityManager->flush();
        
        return $theme;
    }

    private function createTestThemeValue(Theme $theme, int $year, float $value): ThemeValue
    {
        $themeValue = new ThemeValue();
        $themeValue->setTheme($theme);
        $themeValue->setYear($year);
        $themeValue->setValue($value);
        
        $this->entityManager->persist($themeValue);
        $this->entityManager->flush();
        
        return $themeValue;
    }
}