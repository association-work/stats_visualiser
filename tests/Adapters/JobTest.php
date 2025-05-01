<?php

namespace App\Tests\Services;

use App\DataAdapters\XLSDataAdapter;
use App\Entity\Theme;
use App\Repository\ThemeRepository;
use App\Services\Job;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class JobTest extends KernelTestCase
{
    private XLSDataAdapter $adapter;
    private $projectDir;

    private $entity_manager;
    private ThemeRepository $theme_repository;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel(); // Démarre le noyau Symfony
        $container = self::$kernel->getContainer();
        $this->entity_manager = $container->get('doctrine.orm.entity_manager');
    }

    protected function tearDown(): void
    {
        $themes = $this->theme_repository->findAll();
        foreach ($themes as $theme) {
            $this->entity_manager->remove($theme);
        }
        $this->entity_manager->flush();
        parent::tearDown();
    }

    public function testJobXLSDataAdapter(): void
    {
        $this->projectDir = __DIR__.'/test-themes.xlsx';
        $this->adapter = new XLSDataAdapter($this->projectDir, 'theme');
        $this->theme_repository = $this->entity_manager->getRepository(Theme::class);
        // =========================================
        $job = new Job($this->adapter, '', $this->theme_repository);
        $executed = $job->execute();
        $save_count = $job->getCountSaved();
        // =========================================
        $this->assertTrue($executed, 'The job should be executed successfully');
        $this->assertGreaterThan(1, $save_count);
    }
}
