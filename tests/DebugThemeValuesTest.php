<?php

namespace App\Tests;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class DebugThemeValuesTest extends KernelTestCase
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
        // Nettoyer
        $themeValues = $this->entityManager->getRepository(ThemeValue::class)->findAll();
        foreach ($themeValues as $themeValue) {
            $this->entityManager->remove($themeValue);
        }
        
        $themes = $this->themeRepository->findAll();
        foreach ($themes as $theme) {
            $this->entityManager->remove($theme);
        }
        
        $this->entityManager->flush();
        parent::tearDown();
    }

    public function testDebugThemeValuePersistence(): void
    {
        echo "\n=== DEBUG THEME VALUE PERSISTENCE ===\n";

        // 1. Créer un thème
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('TEST_DEBUG');
        $theme->setIsSection(false);
        
        $this->entityManager->persist($theme);
        $this->entityManager->flush();
        
        echo "✅ Theme créé avec ID: " . $theme->getId() . "\n";

        // 2. Créer des ThemeValues
        $value1 = new ThemeValue();
        $value1->setTheme($theme);
        $value1->setYear(2020);
        $value1->setValue(100.5);
        $this->entityManager->persist($value1);

        $value2 = new ThemeValue();
        $value2->setTheme($theme);
        $value2->setYear(2021);
        $value2->setValue(150.75);
        $this->entityManager->persist($value2);

        echo "📝 ThemeValues créées (avant flush)\n";

        // 3. Flush
        $this->entityManager->flush();
        
        echo "💾 Flush executé\n";

        // 4. Vérifier en base
        $savedTheme = $this->themeRepository->find($theme->getId());
        $this->assertNotNull($savedTheme);
        
        echo "🔍 Theme récupéré: " . $savedTheme->getName() . "\n";

        // 5. Vérifier les valeurs avec différentes méthodes
        $valuesViaRelation = $savedTheme->getValues();
        echo "📊 Values via relation: " . count($valuesViaRelation) . "\n";

        $valuesViaRepository = $this->entityManager->getRepository(ThemeValue::class)->findBy(['theme' => $savedTheme]);
        echo "📊 Values via repository: " . count($valuesViaRepository) . "\n";

        $allValues = $this->entityManager->getRepository(ThemeValue::class)->findAll();
        echo "📊 Total ThemeValues en base: " . count($allValues) . "\n";

        // 6. Debug SQL si possible
        if (method_exists($this->entityManager->getConnection(), 'getConfiguration')) {
            $config = $this->entityManager->getConnection()->getConfiguration();
            if (method_exists($config, 'getSQLLogger')) {
                echo "🗃️ SQL Logger disponible\n";
            }
        }

        // 7. Vérifier les contraintes
        echo "🔗 Vérification des contraintes:\n";
        foreach ($allValues as $value) {
            echo "  - Value ID: " . $value->getId() . ", Theme ID: " . ($value->getTheme() ? $value->getTheme()->getId() : 'NULL') . ", Year: " . $value->getYear() . ", Value: " . $value->getValue() . "\n";
        }

        // 8. Test la relation bidirectionnelle
        $theme->addValue($value1);
        $theme->addValue($value2);
        echo "🔄 Relations bidirectionnelles ajoutées\n";

        // 9. Re-flush et re-vérifier
        $this->entityManager->flush();
        $this->entityManager->clear(); // Clear du cache
        
        $freshTheme = $this->themeRepository->find($theme->getId());
        $freshValues = $freshTheme->getValues();
        echo "🆕 Après clear - Values: " . count($freshValues) . "\n";

        // Assertions finales
        $this->assertGreaterThan(0, count($allValues), 'Aucune ThemeValue trouvée en base');
        $this->assertEquals(2, count($allValues), 'Devrait avoir exactement 2 ThemeValues');

        echo "\n=== FIN DEBUG ===\n";
    }
}