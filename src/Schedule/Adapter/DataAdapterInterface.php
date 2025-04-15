<?php 

namespace App\Schedule\Adapter;

interface DataAdapterInterface 
{       
    /**
     * Fetch data from the data source.
     *
     * @param string $query The query to execute.
     * @return array The fetched data.
     */

    public function fetchData(): array;
}