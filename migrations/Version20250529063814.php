<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250529063814 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__theme AS SELECT id, parent_id, name, is_section, external_id, source, geographie, unite, created_at, updated_at FROM theme');
        $this->addSql('DROP TABLE theme');
        $this->addSql('CREATE TABLE theme (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, parent_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL, is_section BOOLEAN NOT NULL, external_id VARCHAR(255) NOT NULL, source VARCHAR(255) DEFAULT NULL, geography VARCHAR(100) DEFAULT NULL, unit VARCHAR(50) DEFAULT NULL, created_at DATETIME DEFAULT NULL --(DC2Type:datetime_immutable)
        , updated_at DATETIME DEFAULT NULL --(DC2Type:datetime_immutable)
        , link VARCHAR(255) DEFAULT NULL, geography_id VARCHAR(100) DEFAULT NULL, is_summable BOOLEAN DEFAULT NULL, CONSTRAINT FK_9775E708727ACA70 FOREIGN KEY (parent_id) REFERENCES theme (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO theme (id, parent_id, name, is_section, external_id, source, geography, unit, created_at, updated_at) SELECT id, parent_id, name, is_section, external_id, source, geographie, unite, created_at, updated_at FROM __temp__theme');
        $this->addSql('DROP TABLE __temp__theme');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9775E7089F75D7B0 ON theme (external_id)');
        $this->addSql('CREATE INDEX IDX_9775E708727ACA70 ON theme (parent_id)');
        $this->addSql('ALTER TABLE theme_value ADD COLUMN created_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE theme_value ADD COLUMN updated_at DATETIME DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__theme AS SELECT id, parent_id, name, is_section, external_id, source, link, unit, created_at, updated_at FROM theme');
        $this->addSql('DROP TABLE theme');
        $this->addSql('CREATE TABLE theme (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, parent_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL, is_section BOOLEAN NOT NULL, external_id VARCHAR(255) NOT NULL, source VARCHAR(255) DEFAULT NULL, lien VARCHAR(255) DEFAULT NULL, unite VARCHAR(50) DEFAULT NULL, created_at DATETIME DEFAULT NULL --(DC2Type:datetime_immutable)
        , updated_at DATETIME DEFAULT NULL --(DC2Type:datetime_immutable)
        , geographie VARCHAR(100) DEFAULT NULL, parent_name VARCHAR(255) DEFAULT NULL, CONSTRAINT FK_9775E708727ACA70 FOREIGN KEY (parent_id) REFERENCES theme (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO theme (id, parent_id, name, is_section, external_id, source, lien, unite, created_at, updated_at) SELECT id, parent_id, name, is_section, external_id, source, link, unit, created_at, updated_at FROM __temp__theme');
        $this->addSql('DROP TABLE __temp__theme');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9775E7089F75D7B0 ON theme (external_id)');
        $this->addSql('CREATE INDEX IDX_9775E708727ACA70 ON theme (parent_id)');
        $this->addSql('CREATE TEMPORARY TABLE __temp__theme_value AS SELECT id, theme_id, year, value FROM theme_value');
        $this->addSql('DROP TABLE theme_value');
        $this->addSql('CREATE TABLE theme_value (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, theme_id INTEGER NOT NULL, year INTEGER NOT NULL, value DOUBLE PRECISION DEFAULT NULL, CONSTRAINT FK_4555D3D159027487 FOREIGN KEY (theme_id) REFERENCES theme (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO theme_value (id, theme_id, year, value) SELECT id, theme_id, year, value FROM __temp__theme_value');
        $this->addSql('DROP TABLE __temp__theme_value');
        $this->addSql('CREATE INDEX IDX_4555D3D159027487 ON theme_value (theme_id)');
        $this->addSql('CREATE UNIQUE INDEX theme_year_unique ON theme_value (theme_id, year)');
    }
}
