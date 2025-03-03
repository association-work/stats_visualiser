<?php

namespace App\Command;

use App\Entity\Theme;
use App\Imports\Themes\ExtractService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ExtractService',
    description: 'Parse themes from excel and import them into the database',
)]
class CommandExtractService extends Command
{
    private $projectDir;
    private $entityManager;
    private $themeRepository;

    public function __construct(string $projectDir, EntityManagerInterface $entityManager)
    {
        $this->projectDir = $projectDir;
        $this->entityManager = $entityManager;
        $this->themeRepository = $entityManager->getRepository(Theme::class);
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('extracthemes', InputArgument::OPTIONAL, 'extract and save themes into database themes');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $extracthemes = $input->getArgument('extracthemes');
        $ExtractService = new ExtractService($this->entityManager, $this->projectDir);

        if ($extracthemes) {
            $excel_file = $this->projectDir.'/public/File/emissions_GES_structure.xlsx';

            if (!file_exists($excel_file)) {
                $io->error('file does not exist');

                return Command::FAILURE;
            }
            try {
                $themes = $ExtractService->PrepareThemesForDatabase($ExtractService->GetThemesFromExcelFile($excel_file));
                $io->info(count($themes).' themes extracted');
                $get_themes_from_file = $ExtractService->GetThemesFromExcelFile($excel_file);
                $prepared_themes = $ExtractService->PrepareThemesForDatabase($get_themes_from_file);
                $save_themes = $ExtractService->SaveThemesOnDatabase($prepared_themes);

                if ($save_themes) {
                    $io->info($this->themeRepository->count([]).' themes are saved successfuly');
                }
            } catch (\Exception $e) {
                $io->error('File Excel failed to read : '.$e->getMessage());

                return Command::FAILURE;
            }

            return Command::SUCCESS;
        }

        return Command::SUCCESS;
    }
}
