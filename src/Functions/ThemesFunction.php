<?php

namespace App\Functions;

use PhpOffice\PhpSpreadsheet\IOFactory;

class ThemesFunction
{
    public function getSpreadsheetTheme(string $file_Path, array $column, int $rowIndex = 0): array
    {
        $spread_Sheet = IOFactory::load($file_Path);
        $sheet = $spread_Sheet->getActiveSheet();

        foreach ($sheet->getRowIterator() as $row) {
            $rowIndex = $row->getRowIndex();
            $columnA = $sheet->getCell('A'.$rowIndex)->getValue();
            $columnB = $sheet->getCell('B'.$rowIndex)->getValue();
            if (null !== $columnA && null !== $columnB) {
                if ($rowIndex > 2) {
                    $columns[] = [
                        $column[0] => $columnA,
                        $column[1] => $columnB,
                    ];
                }
            }
        }

        return $columns;
    }
}
