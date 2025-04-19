<?php

namespace App\Controller;

use App\Imports\Themes\ExtractService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class ImportController extends AbstractController
{
    private $extractService;
    private $slugger;

    public function __construct(ExtractService $extractService, SluggerInterface $slugger)
    {
        $this->extractService = $extractService;
        $this->slugger = $slugger;
    }

    #[Route('/import', name: 'app_import')]
    public function index(): Response
    {
        return $this->render('import/index.html.twig');
    }

    #[Route('/import/process', name: 'app_import_process', methods: ['POST'])]
    public function processImport(Request $request): Response
    {
        $file = $request->files->get('excelFile');
        
        if (!$file instanceof UploadedFile) {
            $this->addFlash('error', 'Aucun fichier n\'a été téléchargé.');
            return $this->redirectToRoute('app_import');
        }
        
        if ($file->getClientOriginalExtension() != 'xlsx' && $file->getClientOriginalExtension() != 'xls') {
            $this->addFlash('error', 'Le fichier doit être au format Excel (.xlsx ou .xls).');
            return $this->redirectToRoute('app_import');
        }
        
        try {
            // Définir le répertoire de téléchargement (à adapter selon votre configuration)
            $uploadDir = $this->getParameter('kernel.project_dir') . '/var/uploads';
            
            // Créer le répertoire s'il n'existe pas
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            // Générer un nom de fichier unique
            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $this->slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Déplacer le fichier vers le répertoire de téléchargement
            $file->move($uploadDir, $newFilename);
            $filePath = $uploadDir . '/' . $newFilename;
            
            // Traiter le fichier Excel
            $themes = $this->extractService->getThemesFromExcelFile($filePath);
            
            // Valider les données
            $errors = $this->extractService->validateImportedData($themes);
            if (!empty($errors)) {
                return $this->render('import/result.html.twig', [
                    'success' => false,
                    'errors' => $errors,
                    'totalThemes' => count($themes)
                ]);
            }
            
            // Préparer les données pour la base de données
            $preparedThemes = $this->extractService->prepareThemesForDatabase($themes);
            
            // Enregistrer en base de données
            $count = $this->extractService->SaveThemesOnDatabase($preparedThemes);
            
            // Nettoyer le fichier temporaire
            unlink($filePath);
            
            return $this->render('import/result.html.twig', [
                'success' => true,
                'count' => $count,
                'totalThemes' => count($themes)
            ]);
            
        } catch (\Exception $e) {
            return $this->render('import/result.html.twig', [
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}