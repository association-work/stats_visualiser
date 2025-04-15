<?php 

namespace App\Schedule\Adapter;
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

        foreach ($this->spreadsheet->getWorksheetIterator() as $worksheet) {
            foreach ($worksheet->getRowIterator() as $row) {
                $rowData = [];
                foreach ($row->getCellIterator() as $cell) {
                    $rowData[] = $cell->getValue();
                }
                $data[] = $rowData;
            }
        }

        return [
            'source' => 'Sample data from XLS source',
            'data' => $data,
        ];
    }

}