<?php

namespace App\DataAdapters;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class XLSDataAdapter implements DataAdapterInterface
{
    private string $filePath;
    private Spreadsheet $spreadsheet;

    public function __construct(string $filePath)
    {
        $this->filePath = $filePath;
        $this->spreadsheet = IOFactory::load($this->filePath);
    }

    public function fetchData(): array
    {
        // Simulate fetching data from an XLS file
        // In a real-world scenario, you would use PhpSpreadsheet to read data from the XLS file.
        $data = [];

        // Vérifications des conditions
        if (empty($this->filePath)) {
            throw new \InvalidArgumentException('File path cannot be empty.');
        }

        if (!file_exists($this->filePath)) {
            throw new \RuntimeException('File does not exist.');
        }

        if (!is_readable($this->filePath)) {
            throw new \RuntimeException('File is not readable.');
        }

        return $data;
    }
}
