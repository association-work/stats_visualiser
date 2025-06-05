<?php

namespace App\Command;

use App\Imports\ExtractService;  // Changé ici
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:extract-themes',  // Nom plus standard
    description: 'Parse themes from excel and import them into the database',
)]
class CommandExtractService extends Command
{
    public function __construct(
        private string $projectDir,
        private ExtractService $extractService  // Injection de dépendance
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('file', InputArgument::OPTIONAL, 'Chemin vers le fichier Excel (optionnel)')
            ->setHelp('
Si aucun fichier n\'est spécifié, utilise : /var/import-data/emissions_GES_structure.xlsx

Exemples :
  <info>php bin/console app:extract-themes</info>
  <info>php bin/console app:extract-themes custom-file.xlsx</info>
');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        // Déterminer le fichier à utiliser
        $customFile = $input->getArgument('file');
        $excelFile = $customFile 
            ? $customFile 
            : $this->projectDir . '/var/import-data/emissions_GES_structure.xlsx';

        $io->title('Import de thèmes depuis Excel');
        $io->text("Fichier : <info>$excelFile</info>");

        if (!file_exists($excelFile)) {
            $io->error("Le fichier '$excelFile' n'existe pas.");
            return Command::FAILURE;
        }

        try {
            // Utiliser le service modulaire avec l'approche processFile()
            $savedCount = $this->extractService->processFile('themes', $excelFile);
            
            $io->success("$savedCount thèmes ont été importés avec succès !");
            
            return Command::SUCCESS;

        } catch (\Exception $e) {
            $io->error('Erreur lors de l\'import : ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}