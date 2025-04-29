<?php

namespace App\Tests\Adapters;

use App\DataAdapters\XLSDataAdapter;
use App\Entity\Theme;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class XLSDataAdapterTest extends KernelTestCase
{
    private $adapter;
    private $projectDir;

    private $theme_repository;
    private $entityManager;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $this->projectDir = self::$kernel->getProjectDir();
        $this->entityManager = self::getContainer()->get('doctrine')->getManager();
        $this->theme_repository = $this->entityManager->getRepository(Theme::class);
        $this->theme_repository = self::getContainer()->get('doctrine')->getRepository(Theme::class);
    }

    protected function tearDown(): void
    {
        $themes = $this->theme_repository->findAll();
        foreach ($themes as $theme) {
            $this->entityManager->remove($theme);
        }
        $this->entityManager->flush();
        parent::tearDown();
    }

    public function testFetchData(): void
    {
        $xls_file = $this->projectDir.'/var/file/test-themes.xlsx';
        $this->adapter = new XLSDataAdapter($xls_file, 'theme');
        $themes = $this->adapter->fetchData();
        $this->assertIsArray($themes, 'themes should be an array');
        $this->assertEquals('Emissions GES', $themes[0]['name'], 'Name should be "Emissions GES"');
        $this->assertEquals('V0', $themes[0]['externalId'], 'External ID should be "V0"');
    }
}
