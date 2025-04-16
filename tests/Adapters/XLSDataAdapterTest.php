<?php

namespace App\Tests\Adapters;

use App\DataAdapters\XLSDataAdapter;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class XLSDataAdapterTest extends KernelTestCase
{
    private $adapter;
    private $projectDir;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $this->projectDir = self::$kernel->getProjectDir();
    }

    public function testFetchData(): void
    {
        $xls_file = $this->projectDir.'/var/file/test-themes.xlsx';
        $this->adapter = new XLSDataAdapter($xls_file);
        $data = $this->adapter->fetchData();
        $this->assertIsArray($data, 'Data should be an array');
        // Add more assertions based on the expected data structure
    }

    public function testgetSpreadsheet(): void
    {
        $xls_file = $this->projectDir.'/var/file/test-themes.xlsx';
        $this->adapter = new XLSDataAdapter($xls_file);
        $data = $this->adapter->getSpreadsheet($xls_file, ['name', 'externalId']);
        $this->assertIsArray($data, 'Data should be an array');
    }

    public function testgetThemes(): void
    {
        $xls_file = $this->projectDir.'/var/file/test-themes.xlsx';
        $this->adapter = new XLSDataAdapter($xls_file);
        $themes = $this->adapter->fetchData();
        $this->assertIsArray($themes, 'themes should be an array');
        $this->assertEquals('Emissions GES', $themes[0]['name'], 'Name should be "Emissions GES"');
        $this->assertEquals('V0', $themes[0]['externalId'], 'External ID should be "V0"');
    }
}
