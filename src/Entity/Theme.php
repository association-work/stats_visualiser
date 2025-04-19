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
    
    #[ORM\Column(length: 255, nullable: false, unique: true)]
    private ?string $name;
    
    #[ORM\Column(nullable: false)]
    private ?bool $isSection;
    
    #[ORM\Column(length: 255, nullable: false, unique: true)]
    private ?string $externalId;
    
    #[ORM\Column(length: 50, nullable: true)]
    private ?string $categorieId = null;
    
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $categorieV01 = null;
    
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $categorieV02 = null;
    
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $source = null;
    
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lien = null;
    
    #[ORM\Column(length: 100, nullable: true)]
    private ?string $geographie = null;
    
    #[ORM\Column(length: 50, nullable: true)]
    private ?string $unite = null;
    
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
    
    public function setExternalId(?string $externalId): static
    {
        $this->externalId = $externalId;
        
        return $this;
    }
    
    public function getExternalId(): ?string
    {
        return $this->externalId;
    }
    
    public function getCategorieId(): ?string
    {
        return $this->categorieId;
    }
    
    public function setCategorieId(?string $categorieId): static
    {
        $this->categorieId = $categorieId;
        
        return $this;
    }
    
    public function getCategorieV01(): ?string
    {
        return $this->categorieV01;
    }
    
    public function setCategorieV01(?string $categorieV01): static
    {
        $this->categorieV01 = $categorieV01;
        
        return $this;
    }
    
    public function getCategorieV02(): ?string
    {
        return $this->categorieV02;
    }
    
    public function setCategorieV02(?string $categorieV02): static
    {
        $this->categorieV02 = $categorieV02;
        
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
    
    public function getLien(): ?string
    {
        return $this->lien;
    }
    
    public function setLien(?string $lien): static
    {
        $this->lien = $lien;
        
        return $this;
    }
    
    public function getGeographie(): ?string
    {
        return $this->geographie;
    }
    
    public function setGeographie(?string $geographie): static
    {
        $this->geographie = $geographie;
        
        return $this;
    }
    
    public function getUnite(): ?string
    {
        return $this->unite;
    }
    
    public function setUnite(?string $unite): static
    {
        $this->unite = $unite;
        
        return $this;
    }
    
    /**
     * @return Collection<int, ThemeValue>
     */
    public function getValues(): Collection
    {
        return $this->values;
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
    
    public function getValueForYear(int $year): ?float
    {
        foreach ($this->values as $value) {
            if ($value->getYear() === $year) {
                return $value->getValue();
            }
        }
        
        return null;
    }
    
    public function setValueForYear(int $year, float $value): static
    {
        $found = false;
        
        foreach ($this->values as $themeValue) {
            if ($themeValue->getYear() === $year) {
                $themeValue->setValue($value);
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            $themeValue = new ThemeValue();
            $themeValue->setYear($year);
            $themeValue->setValue($value);
            $themeValue->setTheme($this);
            $this->values->add($themeValue);
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