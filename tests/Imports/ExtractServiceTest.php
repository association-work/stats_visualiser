<?php

namespace App\Tests\Imports;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use App\Imports\ExtractService;
use App\Imports\Themes\ThemeExtractor;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ExtractServiceTest extends KernelTestCase
{
    private $entityManager;
    private $themeRepository;
    private $extractService;
    private $projectDir;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $container = static::getContainer();
        $this->entityManager = $container->get('doctrine.orm.entity_manager');
        $this->themeRepository = $this->entityManager->getRepository(Theme::class);
        $this->projectDir = $container->getParameter('kernel.project_dir');
        $this->extractService = new ExtractService($this->entityManager);
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

    public function testGetExtractor(): void
    {
        $extractor = $this->extractService->getExtractor('themes');
        $this->assertInstanceOf(ThemeExtractor::class, $extractor);
    }

    public function testGetExtractorWithInvalidType(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage("Extracteur de type 'invalid_type' non disponible");
        
        $this->extractService->getExtractor('invalid_type');
    }

    public function testExtractFromFile(): void
    {
        // Mock du fichier Excel (vous devez créer un fichier de test)
        $testFile = $this->createMockExcelFile();
        
        $extractedData = $this->extractService->extractFromFile('themes', $testFile);
        
        $this->assertIsArray($extractedData);
        // Ajouter plus d'assertions selon votre structure de données
    }

    public function testExtractFromFileWithNonExistentFile(): void
    {
        $this->expectException(\Symfony\Component\Filesystem\Exception\FileNotFoundException::class);
        
        $this->extractService->extractFromFile('themes', '/path/to/nonexistent/file.xlsx');
    }

    public function testPrepareForDatabase(): void
    {
        $rawData = [
            [
                'name' => 'Test Theme',
                'externalId' => 'T1',
                'isSection' => true,
                'years' => [2020 => 100.0, 2021 => 150.0]
            ]
        ];
        
        $preparedData = $this->extractService->prepareForDatabase('themes', $rawData);
        
        $this->assertIsArray($preparedData);
        $this->assertCount(1, $preparedData);
        $this->assertEquals('Test Theme', $preparedData[0]['name']);
        $this->assertEquals('T1', $preparedData[0]['externalId']);
    }

    public function testValidateData(): void
    {
        // Données valides
        $validData = [
            [
                'name' => 'Valid Theme',
                'externalId' => 'V1',
                'isSection' => true,
                'years' => [2020 => 100.0]
            ]
        ];
        
        $errors = $this->extractService->validateData('themes', $validData);
        $this->assertEmpty($errors);
        
        // Données invalides
        $invalidData = [
            [
                'name' => '', // Nom manquant
                'externalId' => 'I1',
                'isSection' => true,
                'years' => [2020 => 'invalid_value'] // Valeur non numérique
            ]
        ];
        
        $errors = $this->extractService->validateData('themes', $invalidData);
        $this->assertNotEmpty($errors);
    }

    public function testValidateDataWithDuplicateExternalIds(): void
    {
        $dataWithDuplicates = [
            [
                'name' => 'Theme 1',
                'externalId' => 'DUPLICATE',
                'isSection' => true,
                'years' => []
            ],
            [
                'name' => 'Theme 2',
                'externalId' => 'DUPLICATE',
                'isSection' => true,
                'years' => []
            ]
        ];
        
        $errors = $this->extractService->validateData('themes', $dataWithDuplicates);
        $this->assertNotEmpty($errors);
        $this->assertStringContainsString('doublon', implode(' ', $errors));
    }

    public function testSaveToDatabase(): void
    {
        $data = [
            [
                'name' => 'Test Theme',
                'externalId' => 'T1',
                'isSection' => true,
                'parentExternalId' => null,
                'source' => 'Test Source',
                'link' => 'https://test.com',
                'geography' => 'France',
                'geographyId' => 'FR',
                'unit' => 'kg CO2',
                'isSummable' => true,
                'years' => [2020 => 100.0, 2021 => 150.0]
            ]
        ];
        
        $savedCount = $this->extractService->saveToDatabase('themes', $data);
        
        $this->assertEquals(1, $savedCount);
        
        // Vérifier que le thème a été sauvegardé
        $savedTheme = $this->themeRepository->findOneBy(['externalId' => 'T1']);
        $this->assertNotNull($savedTheme);
        $this->assertEquals('Test Theme', $savedTheme->getName());
        $this->assertEquals('Test Source', $savedTheme->getSource());
        $this->assertTrue($savedTheme->getIsSummable());
        
        // Vérifier que les valeurs ont été sauvegardées
        $values = $savedTheme->getValues();
        $this->assertCount(2, $values);
    }

    public function testProcessFile(): void
    {
        // Créer un fichier de test avec des données valides
        $testFile = $this->createValidTestFile();
        
        $savedCount = $this->extractService->processFile('themes', $testFile);
        
        $this->assertGreaterThan(0, $savedCount);
        
        // Vérifier que les données ont été correctement sauvegardées
        $themes = $this->themeRepository->findAll();
        $this->assertNotEmpty($themes);
    }

    public function testProcessFileWithValidationErrors(): void
    {
        // Créer un fichier de test avec des données invalides
        $testFile = $this->createInvalidTestFile();
        
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Erreurs de validation détectées');
        
        $this->extractService->processFile('themes', $testFile);
    }

    public function testProcessFileWithHierarchicalData(): void
    {
        $data = [
            [
                'name' => 'Parent Theme',
                'externalId' => '1',
                'isSection' => true,
                'parentExternalId' => null,
                'years' => []
            ],
            [
                'name' => 'Child Theme',
                'externalId' => '1.1',
                'isSection' => true,
                'parentExternalId' => '1',
                'years' => [2020 => 100.0]
            ],
            [
                'name' => 'Grandchild Theme',
                'externalId' => '1.1.1',
                'isSection' => false,
                'parentExternalId' => '1.1',
                'years' => [2020 => 50.0, 2021 => 75.0]
            ]
        ];
        
        $savedCount = $this->extractService->saveToDatabase('themes', $data);
        $this->assertEquals(3, $savedCount);
        
        // Vérifier la hiérarchie
        $parent = $this->themeRepository->findOneBy(['externalId' => '1']);
        $child = $this->themeRepository->findOneBy(['externalId' => '1.1']);
        $grandchild = $this->themeRepository->findOneBy(['externalId' => '1.1.1']);
        
        $this->assertNotNull($parent);
        $this->assertNotNull($child);
        $this->assertNotNull($grandchild);
        
        $this->assertNull($parent->getParentId());
        $this->assertEquals($parent->getId(), $child->getParentId());
        $this->assertEquals($child->getId(), $grandchild->getParentId());
    }

    public function testUpdateExistingThemes(): void
    {
        // Créer un thème initial
        $initialData = [
            [
                'name' => 'Initial Theme',
                'externalId' => 'T1',
                'isSection' => true,
                'parentExternalId' => null,
                'isSummable' => false,
                'years' => [2020 => 100.0]
            ]
        ];
        
        $this->extractService->saveToDatabase('themes', $initialData);
        
        // Mettre à jour le thème
        $updatedData = [
            [
                'name' => 'Updated Theme',
                'externalId' => 'T1',
                'isSection' => true,
                'parentExternalId' => null,
                'isSummable' => true,
                'years' => [2020 => 200.0, 2021 => 250.0]
            ]
        ];
        
        $savedCount = $this->extractService->saveToDatabase('themes', $updatedData);
        $this->assertEquals(1, $savedCount);
        
        // Vérifier que le thème a été mis à jour
        $updatedTheme = $this->themeRepository->findOneBy(['externalId' => 'T1']);
        $this->assertEquals('Updated Theme', $updatedTheme->getName());
        $this->assertTrue($updatedTheme->getIsSummable());
        
        // Vérifier que les anciennes valeurs ont été remplacées
        $values = $updatedTheme->getValues();
        $this->assertCount(2, $values);
    }

    public function testProcessLargeDataset(): void
    {
        // Créer un grand dataset pour tester les performances
        $largeData = [];
        for ($i = 1; $i <= 100; $i++) {
            $largeData[] = [
                'name' => "Theme $i",
                'externalId' => "T$i",
                'isSection' => $i % 2 === 0,
                'parentExternalId' => null,
                'isSummable' => $i % 3 === 0,
                'years' => [
                    2020 => $i * 10,
                    2021 => $i * 15,
                    2022 => $i * 20
                ]
            ];
        }
        
        $startTime = microtime(true);
        $savedCount = $this->extractService->saveToDatabase('themes', $largeData);
        $endTime = microtime(true);
        
        $this->assertEquals(100, $savedCount);
        
        // Vérifier que l'opération prend moins de 30 secondes
        $executionTime = $endTime - $startTime;
        $this->assertLessThan(30.0, $executionTime, 'Import took too long');
        
        // Vérifier que toutes les données ont été sauvegardées
        $themes = $this->themeRepository->findAll();
        $this->assertCount(100, $themes);
        
        // Vérifier que toutes les valeurs ont été sauvegardées
        $totalValues = $this->entityManager->getRepository(ThemeValue::class)->findAll();
        $this->assertCount(300, $totalValues); // 100 thèmes * 3 années
    }

    // Méthodes utilitaires pour créer des fichiers de test

    private function createMockExcelFile(): string
    {
        // Cette méthode devrait créer un fichier Excel de test
        // Pour cet exemple, on retourne un chemin fictif
        // Dans un vrai test, vous devriez créer un fichier Excel temporaire
        return $this->projectDir . '/tests/fixtures/test-themes.xlsx';
    }

    private function createValidTestFile(): string
    {
        // Créer un fichier de test avec des données valides
        return $this->projectDir . '/tests/fixtures/valid-themes.xlsx';
    }

    private function createInvalidTestFile(): string
    {
        // Créer un fichier de test avec des données invalides
        return $this->projectDir . '/tests/fixtures/invalid-themes.xlsx';
    }
}