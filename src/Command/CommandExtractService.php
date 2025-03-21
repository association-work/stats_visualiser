<?php

namespace App\Command;

use App\Imports\Themes\ExtractService;
use App\Imports\Themes\ThemeReader;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
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
    private ?Worksheet $sheet = null;

    public function __construct(string $projectDir, EntityManagerInterface $entityManager)
    {
        $this->projectDir = $projectDir;
        $this->entityManager = $entityManager;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $excle_file = $this->projectDir.'/var/import-data/emissions_GES_structure.xlsx';
        if (!file_exists($excle_file)) {
            $io->error('file does not exist');

            return Command::FAILURE;
        }

        $spreadsheet = IOFactory::load($excle_file);

        $this->sheet = $spreadsheet->getActiveSheet();
        $io->info('Sheet loaded ...');
        $readtheme = new ThemeReader($this->sheet);
        $themes = $readtheme->extract();

        $io->info(count($themes).' themes extracte successfully');
        $extract_service = new ExtractService($this->entityManager, $this->sheet);
        $extracted_themes = $extract_service->PrepareThemesForDatabase($themes);

        $saved_themes_count = $extract_service->SaveThemesOnDatabase($extracted_themes);
        $io->info("$saved_themes_count themes were saved successfuly");

        return Command::SUCCESS;
    }
}
