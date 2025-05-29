<?php

namespace App\Tests\Themes\Repository;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ThemeRepositoryTest extends KernelTestCase
{
    private $entityManager;
    private $themeRepository;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $container = static::getContainer();
        $this->entityManager = $container->get('doctrine.orm.entity_manager');
        $this->themeRepository = $this->entityManager->getRepository(Theme::class);
    }

    protected function tearDown(): void
    {
        // Nettoyer les ThemeValues en premier (contrainte FK)
        $themeValues = $this->entityManager->getRepository(ThemeValue::class)->findAll();
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

    public function testAddParentTheme(): void
    {
        $theme = new Theme();
        $theme->setName('environnement');
        $theme->setIsSection(true);
        $theme->setParentId(null);
        $theme->setExternalId('1024');
        $this->entityManager->persist($theme);
        $this->entityManager->flush();
        $this->assertNotNull($theme->getId());
    }

    public function testAddChildTheme(): void
    {
        $child = new Theme();
        $child->setName('Emissions GES');
        $child->setIsSection(true);
        $child->setParentId(1);
        $child->setExternalId('2981');

        $this->entityManager->persist($child);
        $this->entityManager->flush();
        $this->assertNotNull($child->getId());
    }

    public function testFindAllHierarchical(): void
    {
        $themes = $this->themeRepository->findAllHierarchical();
        $this->assertEquals(0, count($themes));

        $parent = new Theme();
        $parent->setName('Environment');
        $parent->setIsSection(true);
        $parent->setParentId(null);
        $parent->setExternalId('V1');
        $this->entityManager->persist($parent);
        $this->entityManager->flush();

        $child = new Theme();
        $child->setName('Climate Change');
        $child->setIsSection(true);
        $child->setParentId($parent->getId());
        $child->setExternalId('V1.1');
        $this->entityManager->persist($child);
        $this->entityManager->flush();

        $grandchild = new Theme();
        $grandchild->setName('Sea Level Rise');
        $grandchild->setIsSection(true);
        $grandchild->setParentId($child->getId());
        $grandchild->setExternalId('V1.1.1');
        $this->entityManager->persist($grandchild);
        $this->entityManager->flush();

        $themes = $this->themeRepository->findAllHierarchical();
        $this->assertEquals(1, count($themes));
        
        // Vérifier la structure hiérarchique
        $rootTheme = $themes[0];
        $this->assertEquals('Environment', $rootTheme['name']);
        $this->assertEquals('V1', $rootTheme['externalId']);
        
        // Vérifier les enfants
        $this->assertCount(1, $rootTheme['children']);
        $childTheme = $rootTheme['children'][0];
        $this->assertEquals('Climate Change', $childTheme['name']);
        $this->assertEquals('V1.1', $childTheme['externalId']);
        
        // Vérifier les petits-enfants
        $this->assertCount(1, $childTheme['children']);
        $grandchildTheme = $childTheme['children'][0];
        $this->assertEquals('Sea Level Rise', $grandchildTheme['name']);
        $this->assertEquals('V1.1.1', $grandchildTheme['externalId']);
    }

    public function testFindAllHierarchicalWithValues(): void
    {
        // Créer un thème avec des valeurs
        $theme = $this->createTestTheme('Test Theme', 'T1');
        $this->createTestThemeValue($theme, 2020, 100.0);
        $this->createTestThemeValue($theme, 2021, 150.0);

        $themes = $this->themeRepository->findAllHierarchical();
        
        $this->assertCount(1, $themes);
        $themeData = $themes[0];
        
        // Vérifier que les valeurs sont incluses
        $this->assertArrayHasKey('values', $themeData);
        $this->assertCount(2, $themeData['values']);
        
        // Vérifier les valeurs
        $values = $themeData['values'];
        $this->assertEquals(2020, $values[0]['year']);
        $this->assertEquals(100.0, $values[0]['value']);
        $this->assertEquals(2021, $values[1]['year']);
        $this->assertEquals(150.0, $values[1]['value']);
    }

    public function testFindAllWithValues(): void
    {
        // Créer des thèmes avec des valeurs
        $theme1 = $this->createTestTheme('Theme 1', 'T1');
        $theme2 = $this->createTestTheme('Theme 2', 'T2');
        
        $this->createTestThemeValue($theme1, 2020, 100.0);
        $this->createTestThemeValue($theme2, 2021, 200.0);

        $themes = $this->themeRepository->findAllWithValues();
        
        $this->assertCount(2, $themes);
        
        // Vérifier que tous les thèmes ont des valeurs
        foreach ($themes as $themeData) {
            $this->assertArrayHasKey('values', $themeData);
            $this->assertArrayHasKey('name', $themeData);
            $this->assertArrayHasKey('externalId', $themeData);
        }
    }

    public function testFindBySource(): void
    {
        $theme1 = $this->createTestTheme('Theme 1', 'T1', 'Source A');
        $theme2 = $this->createTestTheme('Theme 2', 'T2', 'Source B');
        $theme3 = $this->createTestTheme('Theme 3', 'T3', 'Source A');

        $themesFromSourceA = $this->themeRepository->findBySource('Source A');
        
        $this->assertCount(2, $themesFromSourceA);
        foreach ($themesFromSourceA as $theme) {
            $this->assertEquals('Source A', $theme->getSource());
        }
    }

    public function testFindByUnit(): void
    {
        $theme1 = $this->createTestTheme('Theme 1', 'T1', null, 'kg');
        $theme2 = $this->createTestTheme('Theme 2', 'T2', null, 'tonnes');
        $theme3 = $this->createTestTheme('Theme 3', 'T3', null, 'kg');

        $themesWithKg = $this->themeRepository->findByUnit('kg');
        
        $this->assertCount(2, $themesWithKg);
        foreach ($themesWithKg as $theme) {
            $this->assertEquals('kg', $theme->getUnit());
        }
    }

    public function testFindByGeography(): void
    {
        $theme1 = $this->createTestTheme('Theme 1', 'T1', null, null, 'France');
        $theme2 = $this->createTestTheme('Theme 2', 'T2', null, null, 'Germany');
        $theme3 = $this->createTestTheme('Theme 3', 'T3', null, null, 'France');

        $frenchThemes = $this->themeRepository->findByGeography('France');
        
        $this->assertCount(2, $frenchThemes);
        foreach ($frenchThemes as $theme) {
            $this->assertEquals('France', $theme->getGeography());
        }
    }

    public function testFindByGeographyId(): void
    {
        $theme1 = $this->createTestTheme('Theme 1', 'T1', null, null, null, 'FR');
        $theme2 = $this->createTestTheme('Theme 2', 'T2', null, null, null, 'DE');
        $theme3 = $this->createTestTheme('Theme 3', 'T3', null, null, null, 'FR');

        $frenchThemes = $this->themeRepository->findByGeographyId('FR');
        
        $this->assertCount(2, $frenchThemes);
        foreach ($frenchThemes as $theme) {
            $this->assertEquals('FR', $theme->getGeographyId());
        }
    }

    public function testFindSummableThemes(): void
    {
        $summableTheme1 = $this->createTestTheme('Summable 1', 'S1', null, null, null, null, true);
        $summableTheme2 = $this->createTestTheme('Summable 2', 'S2', null, null, null, null, true);
        $nonSummableTheme = $this->createTestTheme('Non-Summable', 'N1', null, null, null, null, false);

        $summableThemes = $this->themeRepository->findSummableThemes();
        
        $this->assertCount(2, $summableThemes);
        foreach ($summableThemes as $theme) {
            $this->assertTrue($theme->getIsSummable());
        }
    }

    public function testFindAllHierarchicalWithComplexStructure(): void
    {
        // Créer une structure complexe: 2 racines, chacune avec des enfants
        $root1 = $this->createTestTheme('Root 1', 'R1');
        $root2 = $this->createTestTheme('Root 2', 'R2');
        
        $child1_1 = $this->createTestTheme('Child 1.1', 'R1.1');
        $child1_2 = $this->createTestTheme('Child 1.2', 'R1.2');
        $child2_1 = $this->createTestTheme('Child 2.1', 'R2.1');
        
        $grandchild = $this->createTestTheme('Grandchild 1.1.1', 'R1.1.1');

        $themes = $this->themeRepository->findAllHierarchical();
        
        $this->assertCount(2, $themes); // 2 racines
        
        // Trouver Root 1 et vérifier sa structure
        $root1Data = null;
        foreach ($themes as $theme) {
            if ($theme['externalId'] === 'R1') {
                $root1Data = $theme;
                break;
            }
        }
        
        $this->assertNotNull($root1Data);
        $this->assertCount(2, $root1Data['children']); // R1.1 et R1.2
        
        // Vérifier que R1.1 a un enfant
        $child1_1Data = null;
        foreach ($root1Data['children'] as $child) {
            if ($child['externalId'] === 'R1.1') {
                $child1_1Data = $child;
                break;
            }
        }
        
        $this->assertNotNull($child1_1Data);
        $this->assertCount(1, $child1_1Data['children']); // R1.1.1
    }

    public function testFindAllHierarchicalEmpty(): void
    {
        $themes = $this->themeRepository->findAllHierarchical();
        $this->assertIsArray($themes);
        $this->assertEmpty($themes);
    }

    public function testComplexHierarchyWithMultipleGenerations(): void
    {
        // Créer une hiérarchie profonde: V1 > V1.2 > V1.2.3 > V1.2.3.4
        $themes = [
            'V1' => 'Level 1',
            'V1.2' => 'Level 2',
            'V1.2.3' => 'Level 3',
            'V1.2.3.4' => 'Level 4'
        ];
        
        foreach ($themes as $externalId => $name) {
            $this->createTestTheme($name, $externalId);
        }
        
        $hierarchicalThemes = $this->themeRepository->findAllHierarchical();
        
        $this->assertCount(1, $hierarchicalThemes); // Une seule racine
        
        // Naviguer dans la hiérarchie
        $level1 = $hierarchicalThemes[0];
        $this->assertEquals('Level 1', $level1['name']);
        $this->assertCount(1, $level1['children']);
        
        $level2 = $level1['children'][0];
        $this->assertEquals('Level 2', $level2['name']);
        $this->assertCount(1, $level2['children']);
        
        $level3 = $level2['children'][0];
        $this->assertEquals('Level 3', $level3['name']);
        $this->assertCount(1, $level3['children']);
        
        $level4 = $level3['children'][0];
        $this->assertEquals('Level 4', $level4['name']);
        $this->assertEmpty($level4['children']);
    }

    // Méthodes utilitaires pour les tests

    private function createTestTheme(
        string $name, 
        string $externalId, 
        ?string $source = null,
        ?string $unit = null,
        ?string $geography = null,
        ?string $geographyId = null,
        bool $isSummable = false
    ): Theme {
        $theme = new Theme();
        $theme->setName($name);
        $theme->setExternalId($externalId);
        $theme->setIsSection(false);
        $theme->setIsSummable($isSummable);
        
        if ($source) {
            $theme->setSource($source);
        }
        if ($unit) {
            $theme->setUnit($unit);
        }
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