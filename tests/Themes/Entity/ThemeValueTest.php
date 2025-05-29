<?php

namespace App\Tests\Themes\Entity;

use App\Entity\Theme;
use App\Entity\ThemeValue;
use PHPUnit\Framework\TestCase;

class ThemeValueTest extends TestCase
{
    public function testCreateThemeValue(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('T1');
        $theme->setIsSection(false);
        
        $themeValue = new ThemeValue();
        $themeValue->setTheme($theme);
        $themeValue->setYear(2021);
        $themeValue->setValue(150.75);
        
        $this->assertSame($theme, $themeValue->getTheme());
        $this->assertSame(2021, $themeValue->getYear());
        $this->assertSame(150.75, $themeValue->getValue());
        $this->assertNotNull($themeValue->getCreatedAt());
        $this->assertNull($themeValue->getUpdatedAt());
    }

    public function testThemeValueWithNullValue(): void
    {
        $themeValue = new ThemeValue();
        $themeValue->setYear(2021);
        $themeValue->setValue(null);
        
        $this->assertSame(2021, $themeValue->getYear());
        $this->assertNull($themeValue->getValue());
    }

    public function testThemeValueWithNegativeValue(): void
    {
        $themeValue = new ThemeValue();
        $themeValue->setValue(-50.25);
        
        $this->assertSame(-50.25, $themeValue->getValue());
    }

    public function testThemeValueWithZeroValue(): void
    {
        $themeValue = new ThemeValue();
        $themeValue->setValue(0.0);
        
        $this->assertSame(0.0, $themeValue->getValue());
    }

    public function testThemeValueWithLargeValue(): void
    {
        $largeValue = 999999999.99;
        $themeValue = new ThemeValue();
        $themeValue->setValue($largeValue);
        
        $this->assertSame($largeValue, $themeValue->getValue());
    }

    public function testEquals(): void
    {
        $theme1 = new Theme();
        $theme1->setName('Theme 1');
        $theme1->setExternalId('T1');
        $theme1->setIsSection(false);
        
        $theme2 = new Theme();
        $theme2->setName('Theme 2');
        $theme2->setExternalId('T2');
        $theme2->setIsSection(false);
        
        $value1 = new ThemeValue();
        $value1->setTheme($theme1);
        $value1->setYear(2021);
        $value1->setValue(100.0);
        
        $value2 = new ThemeValue();
        $value2->setTheme($theme1);
        $value2->setYear(2021);
        $value2->setValue(200.0); // Valeur différente mais même thème et année
        
        $value3 = new ThemeValue();
        $value3->setTheme($theme2);
        $value3->setYear(2021);
        $value3->setValue(100.0);
        
        $value4 = new ThemeValue();
        $value4->setTheme($theme1);
        $value4->setYear(2022);
        $value4->setValue(100.0);
        
        // Même thème et même année
        $this->assertTrue($value1->equals($value2));
        
        // Thème différent
        $this->assertFalse($value1->equals($value3));
        
        // Année différente
        $this->assertFalse($value1->equals($value4));
    }

    public function testToString(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        
        $themeValue = new ThemeValue();
        $themeValue->setTheme($theme);
        $themeValue->setYear(2021);
        $themeValue->setValue(150.75);
        
        $expected = 'Test Theme - 2021: 150.750000';
        $this->assertEquals($expected, $themeValue->__toString());
    }

    public function testToStringWithNullTheme(): void
    {
        $themeValue = new ThemeValue();
        $themeValue->setYear(2021);
        $themeValue->setValue(150.75);
        
        $expected = 'Unknown Theme - 2021: 150.750000';
        $this->assertEquals($expected, $themeValue->__toString());
    }

    public function testToStringWithNullValues(): void
    {
        $themeValue = new ThemeValue();
        
        $expected = 'Unknown Theme - 0: 0.000000';
        $this->assertEquals($expected, $themeValue->__toString());
    }

    public function testCreatedAtIsSetOnConstruction(): void
    {
        $themeValue = new ThemeValue();
        
        $this->assertNotNull($themeValue->getCreatedAt());
        $this->assertInstanceOf(\DateTimeImmutable::class, $themeValue->getCreatedAt());
    }

    public function testUpdatedAtIsNullInitially(): void
    {
        $themeValue = new ThemeValue();
        
        $this->assertNull($themeValue->getUpdatedAt());
    }

    public function testSetUpdatedAt(): void
    {
        $themeValue = new ThemeValue();
        $now = new \DateTimeImmutable();
        
        $themeValue->setUpdatedAt($now);
        
        $this->assertSame($now, $themeValue->getUpdatedAt());
    }

    public function testSetUpdatedAtValue(): void
    {
        $themeValue = new ThemeValue();
        
        // Simuler l'appel du lifecycle callback
        $themeValue->setUpdatedAtValue();
        
        $this->assertNotNull($themeValue->getUpdatedAt());
        $this->assertInstanceOf(\DateTimeImmutable::class, $themeValue->getUpdatedAt());
    }

    public function testYearBoundaries(): void
    {
        $themeValue = new ThemeValue();
        
        // Test avec une année très ancienne
        $themeValue->setYear(1900);
        $this->assertSame(1900, $themeValue->getYear());
        
        // Test avec une année future
        $themeValue->setYear(2100);
        $this->assertSame(2100, $themeValue->getYear());
    }

    public function testValuePrecision(): void
    {
        $themeValue = new ThemeValue();
        $preciseValue = 123.456789;
        
        $themeValue->setValue($preciseValue);
        
        $this->assertSame($preciseValue, $themeValue->getValue());
    }

    public function testBidirectionalRelationship(): void
    {
        $theme = new Theme();
        $theme->setName('Test Theme');
        $theme->setExternalId('T1');
        $theme->setIsSection(false);
        
        $themeValue = new ThemeValue();
        $themeValue->setYear(2021);
        $themeValue->setValue(100.0);
        
        // Établir la relation
        $themeValue->setTheme($theme);
        $theme->addValue($themeValue);
        
        // Vérifier que la relation est bidirectionnelle
        $this->assertSame($theme, $themeValue->getTheme());
        $this->assertTrue($theme->getValues()->contains($themeValue));
    }
}