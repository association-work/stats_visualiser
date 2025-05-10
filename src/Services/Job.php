<?php

namespace App\Services;

use App\Repository\ThemeRepository;

class Job
{
    private $adapter;
    private $repository;
    private ThemeRepository $theme_repository;
    private $count_Saved;

    public function __construct($adapter, $repository = null, ?ThemeRepository $themeRepository = null)
    {
        $this->theme_repository = $themeRepository;
        $this->repository = $repository;
        $this->adapter = $adapter;
    }

    public function execute(): bool
    {
        $data_saved = false;

        if (empty($this->adapter)) {
            throw new \InvalidArgumentException('Data adapter interface cannot be empty.');
        }
        switch ($this->getNameClass($this->adapter)) {
            case 'XLSDataAdapter':
                if ('theme' == $this->adapter->getEntity_name()) {
                    $themes = $this->adapter->fetchData();

                    if (empty($themes)) {
                        throw new \RuntimeException('No data fetched.');
                    }
                    dd($themes);
                    $savedThemes = $this->theme_repository->SaveTheme($themes);

                    if ($savedThemes > 0) {
                        $data_saved = true;
                        $this->count_Saved = $savedThemes;
                    } else {
                        throw new \RuntimeException('Failed to save themes.');
                    }
                }
                break;

            case 'App\DataAdapters\HTTPDataAdapter':
                break;
            default:
                throw new \InvalidArgumentException('Invalid adapter name provided.');
        }

        return $data_saved;
    }

    protected function getNameClass($class): string
    {
        $short_name = (new \ReflectionClass($class))->getShortName();
        if (empty($class)) {
            throw new \InvalidArgumentException('Class name cannot be empty.');
        }
        if ('' !== $short_name) {
            return $short_name;
        } else {
            throw new \InvalidArgumentException('Class name is not valid.');
        }
    }

    public function getCountSaved(): int
    {
        return $this->count_Saved;
    }
}
