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

    /**
     * Get the entity name.
     */
    public function getEntity_name(): string;
}
