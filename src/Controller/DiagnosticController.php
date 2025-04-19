<?php

namespace App\Controller;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DiagnosticController extends AbstractController
{
    #[Route('/diagnostic', name: 'app_diagnostic')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        // Compter les thèmes
        $themeCount = $entityManager->getRepository(Theme::class)->count([]);
        
        // Compter les valeurs
        $valueCount = $entityManager->getRepository(ThemeValue::class)->count([]);
        
        // Récupérer quelques exemples
        $sampleThemes = $entityManager->getRepository(Theme::class)->findBy([], null, 10);
        $sampleData = [];
        
        foreach ($sampleThemes as $theme) {
            $valueCount = $entityManager->getRepository(ThemeValue::class)->count(['theme' => $theme]);
            
            $values = $entityManager->getRepository(ThemeValue::class)->findBy(['theme' => $theme], null, 5);
            $valueDetails = [];
            foreach ($values as $value) {
                $valueDetails[] = [
                    'year' => $value->getYear(),
                    'value' => $value->getValue()
                ];
            }
            
            $sampleData[] = [
                'id' => $theme->getId(),
                'name' => $theme->getName(),
                'externalId' => $theme->getExternalId(),
                'valueCount' => $valueCount,
                'valueDetails' => $valueDetails
            ];
        }
        
        return $this->render('diagnostic/index.html.twig', [
            'themeCount' => $themeCount,
            'valueCount' => $valueCount,
            'sampleData' => $sampleData,
        ]);
    }
}