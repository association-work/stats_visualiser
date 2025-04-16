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
        $data = $this->adapter->getSpreadsheet($xls_file, ['category', 'category_id']);
        $this->assertIsArray($data, 'Data should be an array');
        // Add more assertions based on the expected data structure
    }
}
