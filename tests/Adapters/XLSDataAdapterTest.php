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

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $this->projectDir = self::$kernel->getProjectDir();

        $this->theme_repository = self::getContainer()->get('doctrine')->getRepository(Theme::class);
    }

    public function testgetSpreadsheet(): void
    {
        $xls_file = $this->projectDir.'/var/file/test-themes.xlsx';
        $this->adapter = new XLSDataAdapter($xls_file);
        $data = $this->adapter->getSpreadsheet($xls_file, ['name', 'externalId']);
        $this->assertIsArray($data, 'Data should be an array');
    }

    public function testFetchData(): void
    {
        $xls_file = $this->projectDir.'/var/file/test-themes.xlsx';
        $this->adapter = new XLSDataAdapter($xls_file);
        $themes = $this->adapter->fetchData();
        $this->assertIsArray($themes, 'themes should be an array');
        $this->assertEquals('Emissions GES', $themes[0]['name'], 'Name should be "Emissions GES"');
        $this->assertEquals('V0', $themes[0]['externalId'], 'External ID should be "V0"');
    }

    public function testSaveData(): void
    {
        $xls_file = $this->projectDir.'/var/file/test-themes.xlsx';
        $this->adapter = new XLSDataAdapter($xls_file);
        $save_themes = $this->adapter->fetchData();
        $result = $this->theme_repository->saveTheme($save_themes);
        $this->assertIsInt($result, 'Result should be an integer');
        dd($result);
    }
}
