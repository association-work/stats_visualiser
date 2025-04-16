<?php

namespace App\DataAdapters;

use App\Functions\ThemesFunction;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class XLSDataAdapter implements DataAdapterInterface
{
    private string $file_path;
    private Spreadsheet $spreadsheet;

    public function __construct(string $file_path)
    {
        $this->file_path = $file_path;
        $this->spreadsheet = IOFactory::load($this->file_path);
    }

    public function fetchData(): array
    {
        // Vérifications des conditions
        if (empty($this->file_path)) {
            throw new \InvalidArgumentException('File path cannot be empty.');
        }

        if (!file_exists($this->file_path)) {
            throw new \RuntimeException('File does not exist.');
        }

        if (!is_readable($this->file_path)) {
            throw new \RuntimeException('File is not readable.');
        }

        return $this->getSpreadsheet($this->file_path, ['category', 'category_id'], 2);
    }

    public function getSpreadsheet(string $file_Path, array $column, int $rowIndex = 0): array
    {
        $func_theme = new ThemesFunction();

        return $func_theme->getSpreadsheetTheme($file_Path, $column, $rowIndex);
    }
}
