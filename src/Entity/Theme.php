<?php
namespace App\Entity;

use App\Repository\ThemeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ThemeRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Theme
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    
    #[ORM\Column(nullable: true)]
    private ?int $parentId = null;
    
    #[ORM\Column(length: 255, nullable: false)]
    private ?string $name;
    
    #[ORM\Column(nullable: false)]
    private ?bool $isSection;
    
    #[ORM\Column(length: 255, nullable: false, unique: true)]
    private ?string $externalId;
    
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $source = null;
    
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $link = null;
    
    #[ORM\Column(length: 100, nullable: true)]
    private ?string $geography = null;
    
    #[ORM\Column(length: 100, nullable: true)]
    private ?string $geographyId = null;
    
    #[ORM\Column(length: 50, nullable: true)]
    private ?string $unit = null;
    
    #[ORM\Column(nullable: true)]
    private ?bool $isSummable = false;
    
    /**
     * @var Collection<int, ThemeValue>
     */
    #[ORM\OneToMany(mappedBy: 'theme', targetEntity: ThemeValue::class, cascade: ["persist", "remove"])]
    private Collection $values;
    
    /**
     * @var Collection<int, Theme>
     */
    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    private Collection $children;
    
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', nullable: true)]
    private ?Theme $parent = null;
    
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $createdAt = null;
    
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;
    
    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->values = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->isSummable = false;
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
    
    public function setId(?int $id): static
    {
        $this->id = $id;
        
        return $this;
    }
    
    public function getParentId(): ?int
    {
        return $this->parentId;
    }
    
    public function setParentId(?int $parentId): static
    {
        $this->parentId = $parentId;
        
        return $this;
    }
    
    public function getName(): ?string
    {
        return $this->name;
    }
    
    public function setName(string $name): static
    {
        $this->name = $name;
        
        return $this;
    }
    
    public function getIsSection(): ?bool
    {
        return $this->isSection;
    }
    
    public function setIsSection(?bool $isSection): static
    {
        $this->isSection = $isSection;
        
        return $this;
    }
    
    public function getExternalId(): ?string
    {
        return $this->externalId;
    }
    
    public function setExternalId(?string $externalId): static
    {
        $this->externalId = $externalId;
        
        return $this;
    }
    
    public function getSource(): ?string
    {
        return $this->source;
    }
    
    public function setSource(?string $source): static
    {
        $this->source = $source;
        
        return $this;
    }
    
    public function getLink(): ?string
    {
        return $this->link;
    }
    
    public function setLink(?string $link): static
    {
        $this->link = $link;
        
        return $this;
    }
    
    public function getGeography(): ?string
    {
        return $this->geography;
    }
    
    public function setGeography(?string $geography): static
    {
        $this->geography = $geography;
        
        return $this;
    }
    
    public function getGeographyId(): ?string
    {
        return $this->geographyId;
    }
    
    public function setGeographyId(?string $geographyId): static
    {
        $this->geographyId = $geographyId;
        
        return $this;
    }
    
    public function getUnit(): ?string
    {
        return $this->unit;
    }
    
    public function setUnit(?string $unit): static
    {
        $this->unit = $unit;
        
        return $this;
    }
    
    public function getIsSummable(): ?bool
    {
        return $this->isSummable;
    }
    
    public function setIsSummable(?bool $isSummable): static
    {
        $this->isSummable = $isSummable;
        
        return $this;
    }
    
    /**
     * @return Collection<int, Theme>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }
    
    public function addChild(self $child): static
    {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
            $child->setParent($this);
        }
        
        return $this;
    }
    
    public function removeChild(self $child): static
    {
        if ($this->children->removeElement($child)) {
            if ($child->getParent() === $this) {
                $child->setParent(null);
            }
        }
        
        return $this;
    }
    
    public function getParent(): ?self
    {
        return $this->parent;
    }
    
    public function setParent(?self $parent): static
    {
        $this->parent = $parent;
        
        return $this;
    }
    
    /**
     * @return Collection<int, ThemeValue>
     */
    public function getValues(): Collection
    {
        return $this->values;
    }
    
    /**
     * Récupère la valeur pour une année spécifique
     */
    public function getValueForYear(int $year): ?float
    {
        foreach ($this->values as $value) {
            if ($value->getYear() === $year) {
                return $value->getValue();
            }
        }
        
        return null;
    }
    
    /**
     * Définit ou met à jour la valeur pour une année spécifique
     */
    public function setValueForYear(int $year, float $value): static
    {
        // Délégué à la classe ThemeValue
        $valueObj = $this->findOrCreateValueForYear($year);
        $valueObj->setValue($value);
        
        return $this;
    }
    
    /**
     * Trouve ou crée un objet ThemeValue pour une année donnée
     */
    private function findOrCreateValueForYear(int $year): ThemeValue
    {
        foreach ($this->values as $themeValue) {
            if ($themeValue->getYear() === $year) {
                return $themeValue;
            }
        }
        
        $themeValue = new ThemeValue();
        $themeValue->setYear($year);
        $themeValue->setTheme($this);
        $this->values->add($themeValue);
        
        return $themeValue;
    }
    
    public function addValue(ThemeValue $value): static
    {
        if (!$this->values->contains($value)) {
            $this->values->add($value);
            $value->setTheme($this);
        }
        
        return $this;
    }
    
    public function removeValue(ThemeValue $value): static
    {
        if ($this->values->removeElement($value)) {
            if ($value->getTheme() === $this) {
                $value->setTheme(null);
            }
        }
        
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
     * Crée une représentation en chaîne de l'objet
     */
    public function __toString(): string
    {
        return $this->name ?? 'New Theme';
    }
}