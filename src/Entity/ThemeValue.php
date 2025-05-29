<?php
namespace App\Entity;

use App\Repository\ThemeValueRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ThemeValueRepository::class)]
#[ORM\UniqueConstraint(name: "theme_year_unique", columns: ["theme_id", "year"])]
#[ORM\HasLifecycleCallbacks]
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
    
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $createdAt = null;
    
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;
    
    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }
    
    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
    
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
    
    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }
    
    public function setCreatedAt(?\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        
        return $this;
    }
    
    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
    
    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        
        return $this;
    }
    
    /**
     * Compare deux objets ThemeValue
     */
    public function equals(self $other): bool
    {
        return $this->theme === $other->theme && $this->year === $other->year;
    }
    
    /**
     * Crée une représentation en chaîne de l'objet
     */
    public function __toString(): string
    {
        return sprintf(
            '%s - %d: %f', 
            $this->theme ? $this->theme->getName() : 'Unknown Theme', 
            $this->year ?? 0, 
            $this->value ?? 0
        );
    }
}