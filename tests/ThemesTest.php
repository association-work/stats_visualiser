<?php

namespace App\Tests;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;

class ThemesTest extends WebTestCase
{
    private $client;
    private $themeRepository;
    private $entityManager;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->client = static::createClient();

        $container = static::getContainer();
        $this->entityManager = $container->get('doctrine.orm.entity_manager');
        $this->themeRepository = $this->entityManager->getRepository(Theme::class);


        // Nettoyer d'abord la base de données
        $purger = new ORMPurger($this->entityManager);
        $purger->purge();
        $this->cleanDatabase();

        // Créer un thème de test
        $parent = new Theme();
        $parent->setName('Environment');
        $parent->setIsSection(true);
        $parent->setParentId(null);
        $parent->setExternalId('test_env_1');
        $this->entityManager->persist($parent);
        $this->entityManager->flush();
    }

    protected function tearDown(): void
    {
        $this->cleanDatabase();
        parent::tearDown();
    }

    private function cleanDatabase(): void
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
    }

    public function testApiResponse(): void
    {
        $this->client->request('GET', '/api/themes');

        $this->assertResponseIsSuccessful();
        $content = $this->client->getResponse()->getContent();
        $this->assertJson($content);

        $results = json_decode($content, true);
        
        // Vérifier la structure de base
        $this->assertIsArray($results);
        $this->assertArrayHasKey('themes', $results);
        $this->assertIsArray($results['themes']);
        
        // Vérifier qu'il y a au moins un thème
        $this->assertGreaterThan(0, count($results['themes']));
        
        // Vérifier que le premier thème a les propriétés attendues
        $firstTheme = $results['themes'][0];
        $this->assertArrayHasKey('name', $firstTheme);
        $this->assertArrayHasKey('id', $firstTheme);
        $this->assertArrayHasKey('externalId', $firstTheme);
        
        // Vérifier que notre thème de test est présent
        $themeNames = array_column($results['themes'], 'name');
        $this->assertContains('Environment', $themeNames, 'Le thème Environment devrait être présent dans la réponse');
    }

    public function testApiResponseStructure(): void
    {
        $this->client->request('GET', '/api/themes');
        
        $this->assertResponseIsSuccessful();
        $content = $this->client->getResponse()->getContent();
        $results = json_decode($content, true);
        
        // Test de la structure complète
        foreach ($results['themes'] as $theme) {
            $this->assertArrayHasKey('id', $theme);
            $this->assertArrayHasKey('name', $theme);
            $this->assertArrayHasKey('externalId', $theme);
            $this->assertArrayHasKey('isSection', $theme);
            $this->assertArrayHasKey('values', $theme);
            $this->assertArrayHasKey('children', $theme);
            
            // Vérifier les types
            $this->assertIsInt($theme['id']);
            $this->assertIsString($theme['name']);
            $this->assertIsString($theme['externalId']);
            $this->assertIsBool($theme['isSection']);
            $this->assertIsArray($theme['values']);
            $this->assertIsArray($theme['children']);
        }
    }

    public function testApiResponseWithMultipleThemes(): void
    {
        // Ajouter plus de thèmes pour tester
        $child = new Theme();
        $child->setName('Climate Change');
        $child->setIsSection(true);
        $child->setParentId(null);
        $child->setExternalId('test_climate_1');
        $this->entityManager->persist($child);

        $section = new Theme();
        $section->setName('Energy');
        $section->setIsSection(true);
        $section->setParentId(null);
        $section->setExternalId('test_energy_1');
        $this->entityManager->persist($section);

        $this->entityManager->flush();

        $this->client->request('GET', '/api/themes');

        $this->assertResponseIsSuccessful();
        $content = $this->client->getResponse()->getContent();
        $results = json_decode($content, true);

        // Vérifier qu'on a bien plusieurs thèmes
        $this->assertIsArray($results);
        $this->assertArrayHasKey('themes', $results);
        $this->assertGreaterThanOrEqual(3, count($results['themes']));
        
        // Vérifier que nos thèmes sont présents
        $themeNames = array_column($results['themes'], 'name');
        $this->assertContains('Environment', $themeNames);
        $this->assertContains('Climate Change', $themeNames);
        $this->assertContains('Energy', $themeNames);
    }

    public function testApiResponseWithThemeValues(): void
    {
        // Récupérer le thème créé dans setUp
        $theme = $this->themeRepository->findOneBy(['externalId' => 'test_env_1']);
        $this->assertNotNull($theme);

        // Ajouter des valeurs au thème
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

        $this->entityManager->flush();

        $this->client->request('GET', '/api/themes');

        $this->assertResponseIsSuccessful();
        $content = $this->client->getResponse()->getContent();
        $results = json_decode($content, true);

        // Trouver notre thème dans la réponse
        $environmentTheme = null;
        foreach ($results['themes'] as $themeData) {
            if ($themeData['name'] === 'Environment') {
                $environmentTheme = $themeData;
                break;
            }
        }
        
        $this->assertNotNull($environmentTheme, 'Le thème Environment devrait être trouvé');
        $this->assertArrayHasKey('values', $environmentTheme);
        $this->assertIsArray($environmentTheme['values']);
        $this->assertCount(2, $environmentTheme['values']);
        
        // Vérifier les valeurs
        $years = array_column($environmentTheme['values'], 'year');
        $this->assertContains(2020, $years);
        $this->assertContains(2021, $years);
    }

    public function testApiResponseFormat(): void
    {
        $this->client->request('GET', '/api/themes');

        $this->assertResponseIsSuccessful();
        
        // Vérifier le format de la réponse
        $response = $this->client->getResponse();
        $this->assertTrue($response->headers->contains('Content-Type', 'application/json'));
        
        $content = $response->getContent();
        $this->assertJson($content);
        
        $data = json_decode($content, true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('themes', $data);
    }

    public function testApiResponseWithHierarchicalStructure(): void
    {
        // Créer une structure hiérarchique
        $environment = $this->themeRepository->findOneBy(['externalId' => 'test_env_1']);
        
        $climate = new Theme();
        $climate->setName('Climate Change');
        $climate->setIsSection(true);
        $climate->setParentId($environment->getId());
        $climate->setExternalId('test_climate_child_1');
        $this->entityManager->persist($climate);
        $this->entityManager->flush();

        $emissions = new Theme();
        $emissions->setName('GHG Emissions');
        $emissions->setIsSection(false);
        $emissions->setParentId($climate->getId());
        $emissions->setExternalId('test_emissions_1');
        $this->entityManager->persist($emissions);
        $this->entityManager->flush();

        $this->client->request('GET', '/api/themes');

        $this->assertResponseIsSuccessful();
        $content = $this->client->getResponse()->getContent();
        $results = json_decode($content, true);

        // Vérifier la structure hiérarchique
        $this->assertArrayHasKey('themes', $results);
        $this->assertGreaterThanOrEqual(1, count($results['themes']));
        
        // Trouver le thème parent et vérifier ses enfants
        $parentTheme = null;
        foreach ($results['themes'] as $theme) {
            if ($theme['name'] === 'Environment') {
                $parentTheme = $theme;
                break;
            }
        }
        
        $this->assertNotNull($parentTheme);
        $this->assertArrayHasKey('children', $parentTheme);
        
        if (count($parentTheme['children']) > 0) {
            // Vérifier que l'enfant a également la structure attendue
            $childTheme = $parentTheme['children'][0];
            $this->assertArrayHasKey('name', $childTheme);
            $this->assertArrayHasKey('children', $childTheme);
        }
    }

    public function testApiWithDifferentHttpMethods(): void
    {
        // Test POST 
        $this->client->request('POST', '/api/themes');
        $this->assertResponseStatusCodeSame(405); // Method Not Allowed attendu
        
        // Test PUT
        $this->client->request('PUT', '/api/themes');
        $this->assertResponseStatusCodeSame(405);
        
        // Test DELETE
        $this->client->request('DELETE', '/api/themes');
        $this->assertResponseStatusCodeSame(405);
    }

    public function testApiResponseWithEmptyDatabase(): void
    {
        // Vider la base de données
        $this->cleanDatabase();

        $this->client->request('GET', '/api/themes');

        $this->assertResponseIsSuccessful();
        $content = $this->client->getResponse()->getContent();
        $results = json_decode($content, true);

        // Vérifier que la réponse est correcte même avec une base vide
        $this->assertIsArray($results);
        $this->assertArrayHasKey('themes', $results);
        $this->assertEquals(0, count($results['themes']));
    }

    public function testApiPerformanceWithLargeDataset(): void
    {
        // Créer un grand nombre de thèmes pour tester les performances
        for ($i = 1; $i <= 20; $i++) {
            $theme = new Theme();
            $theme->setName("Theme $i");
            $theme->setIsSection($i % 2 === 0);
            $theme->setParentId(null);
            $theme->setExternalId("test_theme_$i");
            $this->entityManager->persist($theme);

            // Ajouter quelques valeurs
            for ($year = 2020; $year <= 2022; $year++) {
                $value = new ThemeValue();
                $value->setTheme($theme);
                $value->setYear($year);
                $value->setValue($i * $year);
                $this->entityManager->persist($value);
            }
        }
        $this->entityManager->flush();

        $startTime = microtime(true);
        $this->client->request('GET', '/api/themes');
        $endTime = microtime(true);

        $this->assertResponseIsSuccessful();
        
        // Vérifier que la réponse prend moins de 2 secondes
        $executionTime = $endTime - $startTime;
        $this->assertLessThan(2.0, $executionTime, 'API response took too long');
        
        // Vérifier le contenu
        $content = $this->client->getResponse()->getContent();
        $results = json_decode($content, true);
        $this->assertGreaterThanOrEqual(20, count($results['themes']));
    }

    public function testApiResponseConsistency(): void
    {
        // Faire plusieurs appels à l'API pour vérifier la consistance
        $responses = [];
        
        for ($i = 0; $i < 3; $i++) {
            $this->client->request('GET', '/api/themes');
            $this->assertResponseIsSuccessful();
            $responses[] = $this->client->getResponse()->getContent();
        }

        // Vérifier que toutes les réponses sont identiques
        $this->assertEquals($responses[0], $responses[1]);
        $this->assertEquals($responses[1], $responses[2]);
    }

    public function testApiContentNegotiation(): void
    {
        // Test avec différents en-têtes Accept
        $this->client->request('GET', '/api/themes', [], [], [
            'HTTP_ACCEPT' => 'application/json'
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertTrue($this->client->getResponse()->headers->contains('Content-Type', 'application/json'));

        // Test avec Accept: */*
        $this->client->request('GET', '/api/themes', [], [], [
            'HTTP_ACCEPT' => '*/*'
        ]);
        $this->assertResponseIsSuccessful();
    }

    public function testApiResponseWithSpecialCharacters(): void
    {
        // Créer un thème avec des caractères spéciaux
        $theme = new Theme();
        $theme->setName('Thème avec des caractères spéciaux: éàèç');
        $theme->setIsSection(true);
        $theme->setParentId(null);
        $theme->setExternalId('test_special_chars_1');
        $this->entityManager->persist($theme);
        $this->entityManager->flush();

        $this->client->request('GET', '/api/themes');
        $this->assertResponseIsSuccessful();
        
        $content = $this->client->getResponse()->getContent();
        $results = json_decode($content, true);
        
        // Vérifier que les caractères spéciaux sont correctement encodés
        $this->assertNotNull($results);
        $this->assertEquals(JSON_ERROR_NONE, json_last_error());
        
        // Vérifier que notre thème avec caractères spéciaux est présent
        $themeNames = array_column($results['themes'], 'name');
        $this->assertContains('Thème avec des caractères spéciaux: éàèç', $themeNames);
    }
}