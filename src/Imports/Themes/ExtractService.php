<?php

namespace App\Imports\Themes;

use App\Entity\Theme;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExtractService
{
    private $entityManager;
    private $themeRepository;
    private $worksheet;

    public function __construct(EntityManagerInterface $entityManager, Worksheet $worksheet)
    {
        $this->entityManager = $entityManager;
        $this->themeRepository = $entityManager->getRepository(Theme::class);
        $this->worksheet = $worksheet;
    }

    private function getParentExternalId(string $externalId): ?string
    {
        $check_dot = strpos($externalId, '.');
        if (false !== $check_dot) {
            $level_array = explode('.', $externalId);
            array_pop($level_array);

            return implode('.', $level_array);
        } else {
            return null;
        }
    }

    public function PrepareThemesForDatabase(array $themes): array
    {
        return array_map(function ($theme) {
            return [
                'name' => $theme['name'],
                'externalId' => $theme['externalId'],
                'isSection' => true,
                'parentExternalId' => $this->getParentExternalId($theme['externalId']),
            ];
        }, $themes);
    }

    public function SaveThemesOnDatabase(array $arrayThemes): int
    {
        foreach ($arrayThemes as $theme) {
            $existing_theme = $this->themeRepository->findOneBy(['externalId' => $theme['externalId']]);
            $theme_to_write = $existing_theme ?? (new Theme())->setExternalId($theme['externalId']);
            $external_id = $theme_to_write->getExternalId();
            $parent_external_id = $this->getParentExternalId($external_id);
            $parent_theme = $this->themeRepository->findOneBy(['externalId' => $parent_external_id]);

            $theme_to_write
                ->setName($theme['name'])
                ->setIsSection($theme['isSection'])
                ->setParentId($parent_theme ? $parent_theme->getId() : null);

            $this->entityManager->persist($theme_to_write);
            $this->entityManager->flush();
        }

        return count($arrayThemes);
    }
}
