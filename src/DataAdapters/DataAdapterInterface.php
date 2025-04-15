<?php

namespace App\DataAdapters;

interface DataAdapterInterface
{
    /**
     * Fetch data from the data source.
     *
     * @return array the fetched data
     */
    public function fetchData(): array;
}
