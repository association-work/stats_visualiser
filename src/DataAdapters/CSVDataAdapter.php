<?php

namespace App\DataAdapters;

class CSVDataAdapter implements DataAdapterInterface
{
    public function fetchData(): array
    {
        // Simulate fetching data from a CSV file
        // In a real-world scenario, you would use fopen and fgetcsv to read data from a CSV file.
        return [
            'source' => 'Sample data from CSV source',
            'data' => [],
        ];
    }

    public function getEntity_name(): string
    {
        // Return a sample entity name
        return 'CSVEntity';
    }
}
