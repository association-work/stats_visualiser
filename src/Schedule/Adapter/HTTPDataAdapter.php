<?php 

namespace App\Schedule\Adapter;

class HTTPDataAdapter implements DataAdapterInterface
{
    public function fetchData(): array
    {
        // Simulate fetching data from an HTTP source
        // In a real-world scenario, you would use cURL or file_get_contents to fetch data from an API endpoint.
        return [
            'source' => 'Sample data from HTTP source',
            'data' => [],
        ];
    }
}