<?php

namespace App\Tests;

use App\Entity\Theme;
use App\Imports\Themes\ExtractService;
use App\Imports\Themes\ThemeReader;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ExtractServiceTest extends KernelTestCase
{
    private $entityManager;
    private $themeRepository;
    private $projectDir;
    private ?Worksheet $sheet;
    private $extract_service;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $container = static::getContainer();
        $this->entityManager = $container->get('doctrine.orm.entity_manager');
        $this->themeRepository = $this->entityManager->getRepository(Theme::class);
        $this->projectDir = $container->getParameter('kernel.project_dir');
        $excel_file = $this->projectDir.'/tests/Imports/Themes/test-themes.xlsx';
        if (!file_exists($excel_file)) {
            throw new \Exception('file does not exist');
        }
        $spreadsheet = IOFactory::load($excel_file);
        $this->sheet = $spreadsheet->getActiveSheet();
        $this->extract_service = new ExtractService($this->entityManager, $this->sheet);
    }

    protected function tearDown(): void
    {
        $themes = $this->themeRepository->findAll();
        foreach ($themes as $theme) {
            $this->entityManager->remove($theme);
        }
        $this->entityManager->flush();
        parent::tearDown();
    }

    public function testImportThemeSave(): void
    {
        $read_themes = new ThemeReader($this->sheet);
        $themes = $read_themes->extract();
        $preparedThemes = $this->extract_service->PrepareThemesForDatabase($themes);
        $savedThemesCount = $this->extract_service->SaveThemesOnDatabase($preparedThemes);

        $this->assertEquals(
            $savedThemesCount,
            count($preparedThemes),
            'Themes are saved'
        );

        $imported_theme = $this->themeRepository->findOneBy(['externalId' => 'V0.1']);

        $this->assertEquals(
            $imported_theme->getName(), 'par gaz à effet de serre'
        );

        $this->assertEquals(
            1,
            count($this->themeRepository->findBy(['parentId' => null])),
            "One import doesn't have a parentId"
        );
    }
}
