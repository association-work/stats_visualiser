<?php

namespace App\Schedule\Service;

use App\DataAdapters\DataAdapterInterface;
use App\Repository\ThemeRepository;
use App\Schedule\Repository\StatRepository; // Ensure this class exists in the specified namespace

class Job
{
    public function __construct(
        private DataAdapterInterface $data_adapter,
        private StatRepository $stat_repository,
        private ThemeRepository $theme_repository,
    ) {
    }

    public function execute(array $array): void
    {
        $this->data_adapter->fetchData();
        $this->stat_repository->save($array);
        $this->theme_repository->saveTheme($array);
    }
}
