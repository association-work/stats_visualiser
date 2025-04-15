<?php 

namespace App\Schedule\Service;

use App\Schedule\Adapter\DataAdapterInterface;
use App\Schedule\Repository\StatRepository;
use app\Repository\ThemeRepository;

class Job 
{ 
    /**
     * @param DataAdapterInterface $data_adapter
     * @param StatRepository $stat_repository
     * @param ThemeRepository $theme_repository
     */

    public function __construct(
        private DataAdapterInterface $data_adapter,
        private StatRepository $stat_repository,
        private ThemeRepository $theme_repository
    ) {}

    public function execute(array $array):void 
    {
        $this->data_adapter->fetchData();
        $this->stat_repository->save($array);
        $this->theme_repository->saveTheme($array);

    }
}