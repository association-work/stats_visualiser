<?php

namespace App\Tests\Themes\Entity;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use PHPUnit\Framework\TestCase;

class ThemeTest extends TestCase
{
    public function testAddEntityTheme(): void
    {
        $theme = new Theme();
        $theme->setName('environement');
        $theme->setIsSection(true);
        $theme->setParentId(null);
        $theme->setExternalId('2980');
        $this->assertSame('environement', $theme->getName());
        $this->assertSame(true, $theme->getIsSection());
        $this->assertSame(null, $theme->getParentId());
        $this->assertSame('2980', $theme->getExternalId());
    }

    public function testThemeWithAllProperties(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('T001');
        $theme->setIsSection(false);
        $theme->setParentId(123);
        $theme->setSource('INSEE');
        $theme->setLink('https://example.com');
        $theme->setGeography('France');
        $theme->setGeographyId('FR');
        $theme->setUnit('kg CO2');
        $theme->setIsSummable(true);

        $this->assertEquals('Test Theme', $theme->getName());
        $this->assertEquals('T001', $theme->getExternalId());
        $this->assertFalse($theme->getIsSection());
        $this->assertEquals(123, $theme->getParentId());
        $this->assertEquals('INSEE', $theme->getSource());
        $this->assertEquals('https://example.com', $theme->getLink());
        $this->assertEquals('France', $theme->getGeography());
        $this->assertEquals('FR', $theme->getGeographyId());
        $this->assertEquals('kg CO2', $theme->getUnit());
        $this->assertTrue($theme->getIsSummable());
    }

    public function testThemeDefaultValues(): void
    {
        $theme = new Theme();
        
        // Valeurs par défaut
        $this->assertNotNull($theme->getCreatedAt());
        $this->assertNull($theme->getUpdatedAt());
        $this->assertFalse($theme->getIsSummable());
        $this->assertNull($theme->getParentId());
        $this->assertNull($theme->getParent());
        $this->assertCount(0, $theme->getChildren());
        $this->assertCount(0, $theme->getValues());
    }

    public function testThemeToString(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        
        $this->assertEquals('Test Theme', $theme->__toString());
        
        // Test avec un thème sans nom
        $emptyTheme = new Theme();
        $this->assertEquals('New Theme', $emptyTheme->__toString());
    }

    public function testParentChildRelationship(): void
    {
        $parent = new Theme();
        $parent->setName('Parent Theme');
        $parent->setExternalId('P1');
        $parent->setIsSection(true);

        $child = new Theme();
        $child->setName('Child Theme');
        $child->setExternalId('C1');
        $child->setIsSection(false);

        // Établir la relation parent-enfant
        $parent->addChild($child);

        $this->assertTrue($parent->getChildren()->contains($child));
        $this->assertSame($parent, $child->getParent());
        $this->assertCount(1, $parent->getChildren());
    }

    public function testRemoveChildRelationship(): void
    {
        $parent = new Theme();
        $parent->setName('Parent Theme');
        $parent->setExternalId('P1');
        $parent->setIsSection(true);

        $child = new Theme();
        $child->setName('Child Theme');
        $child->setExternalId('C1');
        $child->setIsSection(false);

        // Ajouter puis supprimer l'enfant
        $parent->addChild($child);
        $parent->removeChild($child);

        $this->assertFalse($parent->getChildren()->contains($child));
        $this->assertNull($child->getParent());
        $this->assertCount(0, $parent->getChildren());
    }

    public function testMultipleChildren(): void
    {
        $parent = new Theme();
        $parent->setName('Parent Theme');
        $parent->setExternalId('P1');
        $parent->setIsSection(true);

        $child1 = new Theme();
        $child1->setName('Child 1');
        $child1->setExternalId('C1');
        $child1->setIsSection(false);

        $child2 = new Theme();
        $child2->setName('Child 2');
        $child2->setExternalId('C2');
        $child2->setIsSection(false);

        $parent->addChild($child1);
        $parent->addChild($child2);

        $this->assertCount(2, $parent->getChildren());
        $this->assertTrue($parent->getChildren()->contains($child1));
        $this->assertTrue($parent->getChildren()->contains($child2));
        $this->assertSame($parent, $child1->getParent());
        $this->assertSame($parent, $child2->getParent());
    }

    public function testThemeValues(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('T1');
        $theme->setIsSection(false);

        $value1 = new ThemeValue();
        $value1->setYear(2020);
        $value1->setValue(100.0);

        $value2 = new ThemeValue();
        $value2->setYear(2021);
        $value2->setValue(150.0);

        $theme->addValue($value1);
        $theme->addValue($value2);

        $this->assertCount(2, $theme->getValues());
        $this->assertTrue($theme->getValues()->contains($value1));
        $this->assertTrue($theme->getValues()->contains($value2));
        $this->assertSame($theme, $value1->getTheme());
        $this->assertSame($theme, $value2->getTheme());
    }

    public function testRemoveThemeValue(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('T1');
        $theme->setIsSection(false);

        $value = new ThemeValue();
        $value->setYear(2020);
        $value->setValue(100.0);

        // Ajouter puis supprimer la valeur
        $theme->addValue($value);
        $theme->removeValue($value);

        $this->assertCount(0, $theme->getValues());
        $this->assertFalse($theme->getValues()->contains($value));
        $this->assertNull($value->getTheme());
    }

    public function testGetValueForYear(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('T1');
        $theme->setIsSection(false);

        $value1 = new ThemeValue();
        $value1->setYear(2020);
        $value1->setValue(100.0);

        $value2 = new ThemeValue();
        $value2->setYear(2021);
        $value2->setValue(150.0);

        $theme->addValue($value1);
        $theme->addValue($value2);

        $this->assertEquals(100.0, $theme->getValueForYear(2020));
        $this->assertEquals(150.0, $theme->getValueForYear(2021));
        $this->assertNull($theme->getValueForYear(2022)); // Année inexistante
    }

    public function testSetValueForYear(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('T1');
        $theme->setIsSection(false);

        // Définir une valeur pour 2020
        $theme->setValueForYear(2020, 100.0);
        $this->assertEquals(100.0, $theme->getValueForYear(2020));
        $this->assertCount(1, $theme->getValues());

        // Modifier la valeur pour 2020
        $theme->setValueForYear(2020, 200.0);
        $this->assertEquals(200.0, $theme->getValueForYear(2020));
        $this->assertCount(1, $theme->getValues()); // Toujours une seule valeur

        // Ajouter une valeur pour 2021
        $theme->setValueForYear(2021, 150.0);
        $this->assertEquals(150.0, $theme->getValueForYear(2021));
        $this->assertCount(2, $theme->getValues());
    }

    public function testPreventDuplicateChildren(): void
    {
        $parent = new Theme();
        $parent->setName('Parent Theme');
        $parent->setExternalId('P1');
        $parent->setIsSection(true);

        $child = new Theme();
        $child->setName('Child Theme');
        $child->setExternalId('C1');
        $child->setIsSection(false);

        // Ajouter le même enfant plusieurs fois
        $parent->addChild($child);
        $parent->addChild($child);
        $parent->addChild($child);

        $this->assertCount(1, $parent->getChildren());
    }

    public function testPreventDuplicateValues(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('T1');
        $theme->setIsSection(false);

        $value = new ThemeValue();
        $value->setYear(2020);
        $value->setValue(100.0);

        // Ajouter la même valeur plusieurs fois
        $theme->addValue($value);
        $theme->addValue($value);
        $theme->addValue($value);

        $this->assertCount(1, $theme->getValues());
    }

    public function testCreatedAtIsSetOnConstruction(): void
    {
        $theme = new Theme();
        
        $this->assertNotNull($theme->getCreatedAt());
        $this->assertInstanceOf(\DateTimeImmutable::class, $theme->getCreatedAt());
    }

    public function testUpdatedAtCallback(): void
    {
        $theme = new Theme();
        
        // Simuler l'appel du lifecycle callback
        $theme->setUpdatedAtValue();
        
        $this->assertNotNull($theme->getUpdatedAt());
        $this->assertInstanceOf(\DateTimeImmutable::class, $theme->getUpdatedAt());
    }

    public function testSetUpdatedAt(): void
    {
        $theme = new Theme();
        $now = new \DateTimeImmutable();
        
        $theme->setUpdatedAt($now);
        
        $this->assertSame($now, $theme->getUpdatedAt());
    }

    public function testComplexHierarchy(): void
    {
        // Créer une hiérarchie à 3 niveaux
        $grandparent = new Theme();
        $grandparent->setName('Grandparent');
        $grandparent->setExternalId('GP1');
        $grandparent->setIsSection(true);

        $parent = new Theme();
        $parent->setName('Parent');
        $parent->setExternalId('P1');
        $parent->setIsSection(true);

        $child = new Theme();
        $child->setName('Child');
        $child->setExternalId('C1');
        $child->setIsSection(false);

        // Établir les relations
        $grandparent->addChild($parent);
        $parent->addChild($child);

        // Vérifier la hiérarchie
        $this->assertSame($grandparent, $parent->getParent());
        $this->assertSame($parent, $child->getParent());
        $this->assertCount(1, $grandparent->getChildren());
        $this->assertCount(1, $parent->getChildren());
        $this->assertCount(0, $child->getChildren());
    }

    public function testNullableProperties(): void
    {
        $theme = new Theme();
        
        // Tester les propriétés optionnelles
        $this->assertNull($theme->getSource());
        $this->assertNull($theme->getLink());
        $this->assertNull($theme->getGeography());
        $this->assertNull($theme->getGeographyId());
        $this->assertNull($theme->getUnit());
        
        // Définir des valeurs null explicitement
        $theme->setSource(null);
        $theme->setLink(null);
        $theme->setGeography(null);
        $theme->setGeographyId(null);
        $theme->setUnit(null);
        
        $this->assertNull($theme->getSource());
        $this->assertNull($theme->getLink());
        $this->assertNull($theme->getGeography());
        $this->assertNull($theme->getGeographyId());
        $this->assertNull($theme->getUnit());
    }
}