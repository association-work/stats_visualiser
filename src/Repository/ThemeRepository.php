<?php

namespace App\Repository;

use App\Entity\Theme;
use App\Functions\ThemesFunction;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

class ThemeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Theme::class);
    }

    public function findAllHierarchical(): array
    {
        $themes = $this->findAll();
        $themesByParentId = [];
        array_map(function (Theme $theme) use (&$themesByParentId) {
            $children = $themesByParentId[$theme->getParentId()] ?? [];
            $children[] = ['id' => $theme->getId(), 'name' => $theme->getName(), 'parentId' => $theme->getParentId(), 'externalId' => $theme->getExternalId()];
            $themesByParentId[$theme->getParentId() ?? 'base'] = $children;
        }, $themes);

        return $themesByParentId;
    }

    public function saveTheme(array $arrayThemes): int
    {
        if (empty($arrayThemes)) {
            return 0;
        }
        $themes_func = new ThemesFunction();
        foreach ($arrayThemes as $theme) {
            $existing_theme = $this->themeRepository->findOneBy(['externalId' => $theme['externalId']]);
            $theme_to_write = $existing_theme ?? (new Theme())->setExternalId($theme['externalId']);
            $external_id = $theme_to_write->getExternalId();
            $parent_external_id = $themes_func->getParentExternalId($external_id);
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
