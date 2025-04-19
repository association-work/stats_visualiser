<?php

namespace App\Entity;

use App\Repository\ThemeValueRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ThemeValueRepository::class)]
#[ORM\UniqueConstraint(name: "theme_year_unique", columns: ["theme_id", "year"])]
class ThemeValue
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    
    #[ORM\ManyToOne(inversedBy: 'values')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Theme $theme = null;
    
    #[ORM\Column]
    private ?int $year = null;
    
    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $value = null;
    
    public function getId(): ?int
    {
        return $this->id;
    }
    
    public function getTheme(): ?Theme
    {
        return $this->theme;
    }
    
    public function setTheme(?Theme $theme): static
    {
        $this->theme = $theme;
        
        return $this;
    }
    
    public function getYear(): ?int
    {
        return $this->year;
    }
    
    public function setYear(int $year): static
    {
        $this->year = $year;
        
        return $this;
    }
    
    public function getValue(): ?float
    {
        return $this->value;
    }
    
    public function setValue(?float $value): static
    {
        $this->value = $value;
        
        return $this;
    }
}