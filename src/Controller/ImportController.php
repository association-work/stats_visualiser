<?php

namespace App\Controller;

use App\Imports\ExtractService;
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
        // Récupérer les types d'extracteurs disponibles pour les proposer dans le formulaire
        $availableExtractors = [
            'themes' => 'Thèmes (émissions GES, etc.)'
            // Vous pourrez ajouter d'autres types ici lorsque vous les implémenterez
        ];
        
        return $this->render('import/index.html.twig', [
            'extractors' => $availableExtractors
        ]);
    }

    #[Route('/import/process', name: 'app_import_process', methods: ['POST'])]
    public function processImport(Request $request): Response
    {
        $file = $request->files->get('excelFile');
        $extractorType = $request->request->get('extractorType', 'themes'); // 'themes' par défaut
        
        if (!$file instanceof UploadedFile) {
            $this->addFlash('error', 'Aucun fichier n\'a été téléchargé.');
            return $this->redirectToRoute('app_import');
        }
        
        if ($file->getClientOriginalExtension() != 'xlsx' && $file->getClientOriginalExtension() != 'xls') {
            $this->addFlash('error', 'Le fichier doit être au format Excel (.xlsx ou .xls).');
            return $this->redirectToRoute('app_import');
        }
        
        try {
            // Vérifier que le type d'extracteur demandé existe
            try {
                $this->extractService->getExtractor($extractorType);
            } catch (\InvalidArgumentException $e) {
                $this->addFlash('error', 'Type d\'importation non valide: ' . $extractorType);
                return $this->redirectToRoute('app_import');
            }
            
            // Définir le répertoire de téléchargement
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
            
            try {
                // Utiliser le nouveau service modulaire pour traiter le fichier
                $extractedData = $this->extractService->extractFromFile($extractorType, $filePath);
                
                // Préparer les données pour la base de données
                $preparedData = $this->extractService->prepareForDatabase($extractorType, $extractedData);
                
                // Valider les données
                $errors = $this->extractService->validateData($extractorType, $preparedData);
                
                if (!empty($errors)) {
                    return $this->render('import/result.html.twig', [
                        'success' => false,
                        'errors' => $errors,
                        'totalItems' => count($extractedData),
                        'type' => $extractorType
                    ]);
                }
                
                // Enregistrer en base de données
                $count = $this->extractService->saveToDatabase($extractorType, $preparedData);
                
                return $this->render('import/result.html.twig', [
                    'success' => true,
                    'count' => $count,
                    'totalItems' => count($extractedData),
                    'type' => $extractorType
                ]);
                
            } catch (\Exception $e) {
                throw $e;
            } finally {
                // Nettoyer le fichier temporaire dans tous les cas
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            
        } catch (\Exception $e) {
            return $this->render('import/result.html.twig', [
                'success' => false,
                'error' => $e->getMessage(),
                'type' => $extractorType
            ]);
        }
    }
    
    /**
     * Méthode alternative plus simple utilisant le processFile() du nouveau service
     */
    #[Route('/import/process-simple', name: 'app_import_process_simple', methods: ['POST'])]
    public function processImportSimple(Request $request): Response
    {
        $file = $request->files->get('excelFile');
        $extractorType = $request->request->get('extractorType', 'themes');
        
        if (!$file instanceof UploadedFile) {
            $this->addFlash('error', 'Aucun fichier n\'a été téléchargé.');
            return $this->redirectToRoute('app_import');
        }
        
        if ($file->getClientOriginalExtension() != 'xlsx' && $file->getClientOriginalExtension() != 'xls') {
            $this->addFlash('error', 'Le fichier doit être au format Excel (.xlsx ou .xls).');
            return $this->redirectToRoute('app_import');
        }
        
        // Définir le répertoire de téléchargement
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
        
        try {
            // Processus complet en une seule méthode
            $count = $this->extractService->processFile($extractorType, $filePath);
            
            return $this->render('import/result.html.twig', [
                'success' => true,
                'count' => $count,
                'type' => $extractorType
            ]);
            
        } catch (\Exception $e) {
            return $this->render('import/result.html.twig', [
                'success' => false,
                'error' => $e->getMessage(),
                'type' => $extractorType
            ]);
        } finally {
            // Nettoyer le fichier temporaire
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
    }
}