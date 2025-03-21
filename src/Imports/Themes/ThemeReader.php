<?php

namespace App\Imports\Themes;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ThemeReader
{
    public function __construct(
        private readonly Worksheet $sheet,
    ) {
    }

    public function extract(): array
    {
        $themes = [];
        foreach ($this->sheet->getRowIterator() as $row) {
            $rowIndex = $row->getRowIndex();
            $name = $this->sheet->getCell('A'.$rowIndex)->getValue();
            $external_id = $this->sheet->getCell('B'.$rowIndex)->getValue();

            if (null !== $external_id && null !== $name) {
                if ($rowIndex > 2) {
                    $themes[] = [
                        'externalId' => $external_id,
                        'name' => $name,
                    ];
                }
            }
        }

        return $themes;
    }
}
