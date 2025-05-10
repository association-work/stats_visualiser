<?php

namespace App\Command;

use App\DataAdapters\XLSDataAdapter;
use App\Repository\ThemeRepository;
use App\Scheduler\JobScheduler;
use App\Services\Job;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:cron-schedulerXLS',
    description: 'run cron jobs scheduler xls weekly job',
)]
class CronJobSchedulerXLSCommand extends Command
{
    private $projectDir;
    private $entity_manager;
    private $theme_repository;

    public function __construct(string $projectDir, EntityManagerInterface $entity_manager, ThemeRepository $theme_repository)
    {
        $this->projectDir = $projectDir;
        $this->entity_manager = $entity_manager;
        $this->theme_repository = $theme_repository;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Cron Job Scheduler for XLS');
        $io->text('This command allows you to execute cron jobs scheduler.');

        // $file = $this->projectDir.'/var/file/emissions_GES_structure.xlsx';
        $file = $this->projectDir.'/var/file/Classeur1.xlsx';
        if (!file_exists($file)) {
            $io->error('File does not exist: '.$file);

            return Command::FAILURE;
        }

        try {
            // code...
            $xls_adapter = new XLSDataAdapter($file, 'theme');
            $job = new Job($xls_adapter, '', $this->theme_repository);
            $job_scheduler = new JobScheduler($job);
            $job_scheduler->schedule();
            $io->info('Job scheduled successfully.');
        } catch (\Throwable $th) {
            // throw $th;
            $io->error('Error creating job: '.$th->getMessage());

            return Command::FAILURE;
        }

        $io->info('end of executed.');

        return Command::SUCCESS;
    }
}
