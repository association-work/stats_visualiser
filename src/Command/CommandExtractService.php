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
            ->addArgument('extracthemes', InputArgument::OPTIONAL, 'extract and save themes into database themes')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $arg1 = $input->getArgument('extracthemes');
        $ExtractService = new ExtractService($this->entityManager, $this->projectDir);
        if ($arg1) {
            $io->note(sprintf('You passed an argument: %s', $arg1));
            $excel_file = $this->projectDir.'/public/File/emissions_GES_structure.xlsx';

            if (!file_exists($excel_file)) {
                $io->error('file does not exist');

                return Command::FAILURE;
            }
            try {
                $themes = [];
                $themes = $ExtractService->PrepareThemesForDatabase($ExtractService->GetThemesFromExcelFile($excel_file));
                $io->info(count($themes).' themes extracted');

                $saved = $ExtractService->SaveThemesOnDatabase();
                if ($saved) {
                    $io->info($this->themeRepository->count([]).' themes saved');
                }
            } catch (\Exception $e) {
                $io->error('Erreur lors de la lecture du fichier : '.$e->getMessage());

                return Command::FAILURE;
            }

            return Command::SUCCESS;
        }

        return Command::SUCCESS;
    }
}
