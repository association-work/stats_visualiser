<?php

namespace App\Tests\Themes\Repository;

use App\Entity\Theme;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ThemeRepositoryTest extends KernelTestCase
{
    private $entityManager;
    private $themeRepository;

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $container = static::getContainer();
        $this->entityManager = $container->get('doctrine.orm.entity_manager');
        $this->themeRepository = $this->entityManager->getRepository(Theme::class);
    }

    protected function tearDown(): void
    {
        $themes = $this->themeRepository->findAll();
        foreach ($themes as $theme) {
            $this->entityManager->remove($theme);
        }
        $this->entityManager->flush();
        parent::tearDown();
    }

    public function testAddParentTheme(): void
    {
        $theme = new Theme();
        $theme->setName('environnement');
        $theme->setIsSection(true);
        $theme->setParentId(null);
        $theme->setExternalId('1024');
        $this->entityManager->persist($theme);
        $this->entityManager->flush();
        $this->assertNotNull($theme->getId());
    }

    public function testAddChildTheme(): void
    {
        $child = new Theme();
        $child->setName('Emissions GES');
        $child->setIsSection(true);
        $child->setParentId(1);
        $child->setExternalId('2981');

        $this->entityManager->persist($child);
        $this->entityManager->flush();
        $this->assertNotNull($child->getId());
    }

    public function testFindAllHierarchical(): void
    {
        $themes = $this->themeRepository->findAllHierarchical();
        $this->assertEquals(0, count($themes));

        $parent = new Theme();
        $parent->setName('Environment');
        $parent->setIsSection(true);
        $parent->setParentId(null);
        $parent->setExternalId('external_id1');
        $this->entityManager->persist($parent);
        $this->entityManager->flush();

        $child = new Theme();
        $child->setName('Climate Change');
        $child->setIsSection(true);
        $child->setParentId($parent->getId());
        $child->setExternalId('external_id2');
        $this->entityManager->persist($child);
        $this->entityManager->flush();

        $grandchild = new Theme();
        $grandchild->setName('Sea Level Rise');
        $grandchild->setIsSection(true);
        $grandchild->setParentId($child->getId());
        $grandchild->setExternalId('external_id3');
        $this->entityManager->persist($grandchild);
        $this->entityManager->flush();

        $themes = $this->themeRepository->findAllHierarchical();
        $this->assertEquals(3, count($themes));
        $this->assertEquals('Environment', $themes['base'][0]['name']);
        $topParentId = $themes['base'][0]['id'];
        $this->assertEquals('Climate Change', $themes[$topParentId][0]['name']);
        $midParentId = $themes[$topParentId][0]['id'];
        $this->assertEquals('Sea Level Rise', $themes[$midParentId][0]['name']);
    }

    public function testSaveTheme(): void
    {
        $themes = [
            [
                'name' => 'Emissions GES',
                'externalId' => 'V0',
                'isSection' => true,
                'parentExternalId' => null,
            ],
            [
                'name' => 'par gaz à effet de serre',
                'externalId' => 'V0.1',
                'isSection' => true,
                'parentExternalId' => 'V0',
            ],
        ];

        $savedCount = $this->themeRepository->saveTheme($themes);
        $this->assertEquals(2, $savedCount);
        $savedThemes = $this->themeRepository->findAll();
        $this->assertEquals(2, count($savedThemes));
    }
}
