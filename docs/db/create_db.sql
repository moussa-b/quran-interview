-- ==========================
-- CREATE DATABASE
-- ==========================
CREATE DATABASE IF NOT EXISTS quran CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


USE quran;


-- ==========================
-- 1. THEMES
-- ==========================
CREATE TABLE themes
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    sort_order INT UNSIGNED DEFAULT 0,
    PRIMARY KEY (id)
);


CREATE TABLE theme_translations
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    theme_id BIGINT UNSIGNED NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_theme_lang(theme_id, language_code),
    CONSTRAINT fk_theme_translations_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE ON
        UPDATE NO ACTION
);


-- ==========================
-- 2. CATEGORIES
-- ==========================
CREATE TABLE categories
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    theme_id BIGINT UNSIGNED NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sort_order INT UNSIGNED DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_category_slug(theme_id, slug),
    CONSTRAINT fk_category_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE ON
        UPDATE NO ACTION
);


CREATE TABLE category_translations
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id BIGINT UNSIGNED NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_category_lang(category_id, language_code),
    CONSTRAINT fk_category_translations_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON
        UPDATE NO ACTION
);


-- ==========================
-- 3. SUBCATEGORIES
-- ==========================
CREATE TABLE subcategories
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id BIGINT UNSIGNED NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sort_order INT UNSIGNED DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_subcategory_slug(category_id, slug),
    CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON
        UPDATE NO ACTION
);


CREATE TABLE subcategory_translations
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    subcategory_id BIGINT UNSIGNED NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_subcategory_lang(subcategory_id, language_code),
    CONSTRAINT fk_subcategory_translations_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE ON
        UPDATE NO ACTION
);


-- ==========================
-- 4. ITEMS (belong to category OR subcategory)
-- ==========================
CREATE TABLE items
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id BIGINT UNSIGNED NULL,
    subcategory_id BIGINT UNSIGNED NULL,
    slug VARCHAR(255) NOT NULL,
    sort_order INT UNSIGNED DEFAULT 0,
    metadata JSON NULL,
    -- Qur'an specific columns
    surat_number INT UNSIGNED NOT NULL,
    ayat_start INT UNSIGNED NOT NULL,
    ayat_end INT UNSIGNED NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_item_slug(slug),
    -- Foreign keys
    CONSTRAINT fk_item_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON
        UPDATE NO ACTION,
    CONSTRAINT fk_item_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE ON
        UPDATE NO ACTION,
    -- Enforce "one and only one" parent
    CONSTRAINT chk_item_parent_exclusive CHECK
        (
        (category_id IS NOT NULL
            AND subcategory_id IS NULL)
            OR (category_id IS NULL
            AND subcategory_id IS NOT NULL)
        ),
    -- Positive checks for Qur'an numbers
    CONSTRAINT chk_surat_positive CHECK (surat_number > 0),
    CONSTRAINT chk_ayat_start_positive CHECK (ayat_start > 0),
    CONSTRAINT chk_ayat_end_positive CHECK (ayat_end IS NULL
        OR ayat_end > 0)
);


CREATE TABLE item_translations
(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    item_id BIGINT UNSIGNED NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_item_lang(item_id, language_code),
    CONSTRAINT fk_item_translations FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE ON
        UPDATE NO ACTION
);
