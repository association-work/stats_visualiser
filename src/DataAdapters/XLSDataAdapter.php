<?php

namespace App\DataAdapters;

use App\Functions\ThemesFunction;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class XLSDataAdapter implements DataAdapterInterface
{
    private string $file_path;
    private Spreadsheet $spreadsheet;
    private string $entity_name;

    public function __construct(string $file_path, string $entity_name = '')
    {
        $this->file_path = $file_path;
        $this->spreadsheet = IOFactory::load($this->file_path);
        $this->entity_name = $entity_name;
    }

    public function fetchData(): array
    {
        $data = [];
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

        if ('theme' == $this->entity_name) {
            $func_theme = new ThemesFunction();
            $sheet = $func_theme->getSpreadsheetTheme($this->file_path, ['name', 'externalId'], 2);
            $data = $func_theme->getThemes($sheet);
        }

        return $data;
    }

    public function getEntity_name(): string
    {
        return $this->entity_name;
    }
}
