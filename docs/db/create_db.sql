# SQL Export
# Created by Querious (401010)
# Created: 20 November 2025 at 22:33:44 CET
# Encoding: Unicode (UTF-8)


SET @ORIG_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

SET @ORIG_UNIQUE_CHECKS = @@UNIQUE_CHECKS;
SET UNIQUE_CHECKS = 0;

SET @ORIG_TIME_ZONE = @@TIME_ZONE;
SET TIME_ZONE = '+00:00';

CREATE TABLE `categories`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `topic_id` bigint UNSIGNED NOT NULL,
    `slug` varchar(255) NOT NULL,
    `sort_order` int UNSIGNED DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_category_slug` (`topic_id`, `slug`),
    CONSTRAINT `fk_category_theme` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE
)
    ENGINE = INNODB AUTO_INCREMENT = 25 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `category_translations`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` bigint UNSIGNED NOT NULL,
    `language_code` varchar(10) NOT NULL,
    `label` varchar(255) NOT NULL,
    `description` text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_category_lang` (`category_id`, `language_code`),
    CONSTRAINT `fk_category_translations_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
)
    ENGINE = INNODB AUTO_INCREMENT = 49 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `item_quran_refs`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `item_id` bigint UNSIGNED NOT NULL,
    `chapter` int UNSIGNED NOT NULL,
    `start_verse` int UNSIGNED NOT NULL,
    `end_verse` int UNSIGNED DEFAULT NULL,
    `metadata` json DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON
	UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_item_quran_refs_item` (`item_id`),
    CONSTRAINT `fk_item_quran_refs_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
)
    ENGINE = INNODB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `item_translations`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `item_id` bigint UNSIGNED NOT NULL,
    `language_code` varchar(10) NOT NULL,
    `label` varchar(255) NOT NULL,
    `description` text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_item_lang` (`item_id`, `language_code`),
    CONSTRAINT `fk_item_translations` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
)
    ENGINE = INNODB AUTO_INCREMENT = 169 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `items`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` bigint UNSIGNED DEFAULT NULL,
    `subcategory_id` bigint UNSIGNED DEFAULT NULL,
    `slug` varchar(255) NOT NULL,
    `sort_order` int UNSIGNED DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_item_slug` (`slug`),
    KEY `fk_item_category` (`category_id`),
    KEY `fk_item_subcategory` (`subcategory_id`),
    CONSTRAINT `fk_item_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_item_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_item_parent_exclusive` CHECK
        (
        (
            ((`category_id` IS NOT null)
                AND (`subcategory_id` IS null))
                OR ((`category_id` IS null)
                AND (`subcategory_id` IS NOT null))
            )

        )

)
    ENGINE = INNODB AUTO_INCREMENT = 1000453 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `subcategories`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` bigint UNSIGNED NOT NULL,
    `slug` varchar(255) NOT NULL,
    `sort_order` int UNSIGNED DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_subcategory_slug` (`category_id`, `slug`),
    CONSTRAINT `fk_subcategory_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
)
    ENGINE = INNODB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `subcategory_translations`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `subcategory_id` bigint UNSIGNED NOT NULL,
    `language_code` varchar(10) NOT NULL,
    `label` varchar(255) NOT NULL,
    `description` text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_subcategory_lang` (`subcategory_id`, `language_code`),
    CONSTRAINT `fk_subcategory_translations_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE
)
    ENGINE = INNODB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `topic_translations`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `topic_id` bigint UNSIGNED NOT NULL,
    `language_code` varchar(10) NOT NULL,
    `label` varchar(255) NOT NULL,
    `description` text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_theme_lang` (`topic_id`, `language_code`),
    CONSTRAINT `fk_theme_translations_theme` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE
)
    ENGINE = INNODB AUTO_INCREMENT = 31 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `topics`
(
    `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `slug` varchar(255) NOT NULL,
    `sort_order` int UNSIGNED DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `slug` (`slug`)
)
    ENGINE = INNODB AUTO_INCREMENT = 16 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


LOCK TABLES `categories` WRITE;
TRUNCATE TABLE `categories`;
INSERT INTO `categories` (`id`, `topic_id`, `slug`, `sort_order`) VALUES 
	(1, 1, 'oneness', 1),
	(2, 1, 'muhammad', 2),
	(3, 1, 'religion', 3),
	(4, 1, 'prayer', 4),
	(5, 1, 'zakat-sadaqa', 5),
	(6, 1, 'fasting', 6),
	(7, 1, 'pilgrimage', 7),
	(8, 1, 'other-worship', 8),
	(9, 2, 'prophets-messengers', 1),
	(10, 2, 'belief-in-allah', 2),
	(11, 2, 'the-unseen', 3),
	(12, 2, 'other-divine-books', 4),
	(13, 2, 'allah-exalted', 5),
	(14, 2, 'believers', 6),
	(15, 2, 'angels', 7),
	(16, 2, 'last-day', 8),
	(17, 3, 'limits', 1),
	(18, 3, 'wisdom-in-preaching', 2),
	(19, 3, 'obligation-of-preaching', 3),
	(20, 7, 'good-morals', 1),
	(21, 7, 'vices', 2),
	(22, 11, 'legal-rulings', 1),
	(23, 11, 'legal-organizations', 2),
	(24, 11, 'institutional-relations', 3);
UNLOCK TABLES;


LOCK TABLES `category_translations` WRITE;
TRUNCATE TABLE `category_translations`;
INSERT INTO `category_translations` (`id`, `category_id`, `language_code`, `label`, `description`) VALUES 
	(1, 1, 'fr', 'L\'unicité', NULL),
	(2, 1, 'en', 'Oneness (Tawhid)', NULL),
	(3, 2, 'fr', 'Muhammad que Allah lui donne sa grâce et sa paix', NULL),
	(4, 2, 'en', 'Muhammad, may Allah grant him peace and blessings', NULL),
	(5, 3, 'fr', 'La religion', NULL),
	(6, 3, 'en', 'Religion', NULL),
	(7, 4, 'fr', 'La prière (la Salat)', NULL),
	(8, 4, 'en', 'Prayer (Salat)', NULL),
	(9, 5, 'fr', 'La Zakat et les aumônes (Sadaqa)', NULL),
	(10, 5, 'en', 'Zakat and Alms (Sadaqa)', NULL),
	(11, 6, 'fr', 'Le jeûne', NULL),
	(12, 6, 'en', 'Fasting (Sawm)', NULL),
	(13, 7, 'fr', 'Le pèlerinage et le petit pèlerinage', NULL),
	(14, 7, 'en', 'Pilgrimage (Hajj & Umrah)', NULL),
	(15, 8, 'fr', 'Autres statuts d\'adoration', NULL),
	(16, 8, 'en', 'Other acts of worship', NULL),
	(17, 9, 'fr', 'Les prophètes et les messagers', NULL),
	(18, 9, 'en', 'The Prophets and Messengers', NULL),
	(19, 10, 'fr', 'La croyance en Allah', NULL),
	(20, 10, 'en', 'Belief in Allah', NULL),
	(21, 11, 'fr', 'L\'invisible', NULL),
	(22, 11, 'en', 'The Unseen', NULL),
	(23, 12, 'fr', 'Les autres Livres Célestes', NULL),
	(24, 12, 'en', 'Other Divine Books', NULL),
	(25, 13, 'fr', 'Allah le très exalté', NULL),
	(26, 13, 'en', 'Allah, the Most Exalted', NULL),
	(27, 14, 'fr', 'Les croyants', NULL),
	(28, 14, 'en', 'The Believers', NULL),
	(29, 15, 'fr', 'Les Anges', NULL),
	(30, 15, 'en', 'The Angels', NULL),
	(31, 16, 'fr', 'Le Jour dernier', NULL),
	(32, 16, 'en', 'The Last Day', NULL),
	(33, 17, 'fr', 'Ses limites', NULL),
	(34, 17, 'en', 'Its Limits', NULL),
	(35, 18, 'fr', 'La sagesse dans le prêche (Al-Da\'waa)', NULL),
	(36, 18, 'en', 'Wisdom in Preaching (Al-Da\'waa)', NULL),
	(37, 19, 'fr', 'Le prêche (Al-Da\'waa) à Allah est obligatoire', NULL),
	(38, 19, 'en', 'Preaching (Al-Da\'waa) to Allah is Obligatory', NULL),
	(39, 20, 'fr', 'Le bon moral', NULL),
	(40, 20, 'en', 'Good Morals', NULL),
	(41, 21, 'fr', 'Les vices', NULL),
	(42, 21, 'en', 'Vices', NULL),
	(43, 22, 'fr', 'Les statuts légaux', NULL),
	(44, 22, 'en', 'Legal Rulings', NULL),
	(45, 23, 'fr', 'Les organisations légales', NULL),
	(46, 23, 'en', 'Legal Organizations', NULL),
	(47, 24, 'fr', 'Les relations légales et institutionnelles', NULL),
	(48, 24, 'en', 'Legal and Institutional Relations', NULL);
UNLOCK TABLES;


LOCK TABLES `item_quran_refs` WRITE;
TRUNCATE TABLE `item_quran_refs`;
INSERT INTO `item_quran_refs` (`id`, `item_id`, `chapter`, `start_verse`, `end_verse`, `metadata`, `created_at`, `updated_at`) VALUES 
	(1, 1, 2, 117, 117, NULL, '2025-11-18 23:07:54', '2025-11-19 21:23:43'),
	(2, 1, 2, 185, 185, NULL, '2025-11-18 23:07:54', '2025-11-19 21:23:43'),
	(3, 1, 2, 253, 253, NULL, '2025-11-18 23:07:54', '2025-11-19 21:23:43'),
	(4, 1, 4, 26, 28, NULL, '2025-11-18 23:07:54', '2025-11-19 21:22:45'),
	(5, 1, 5, 6, 6, NULL, '2025-11-18 23:07:54', '2025-11-19 21:23:43'),
	(6, 1, 5, 18, 18, NULL, '2025-11-18 23:07:54', '2025-11-19 21:23:43'),
	(7, 1, 5, 52, 52, NULL, '2025-11-18 23:07:54', '2025-11-19 21:23:43');
UNLOCK TABLES;


LOCK TABLES `item_translations` WRITE;
TRUNCATE TABLE `item_translations`;
INSERT INTO `item_translations` (`id`, `item_id`, `language_code`, `label`, `description`) VALUES 
	(1, 1, 'fr', 'Sa volonté', NULL),
	(2, 1, 'en', 'His Will', NULL),
	(3, 2, 'fr', 'Les plus beaux noms d\'Allah', NULL),
	(4, 2, 'en', 'The Most Beautiful Names of Allah', NULL),
	(5, 3, 'fr', 'A Lui toute action est retournée', NULL),
	(6, 3, 'en', 'To Him All Actions Return', NULL),
	(7, 4, 'fr', 'Avertissement punitif aux polythéistes', NULL),
	(8, 4, 'en', 'Punitive Warning to the Polytheists', NULL),
	(9, 5, 'fr', 'Allah, l\'unique prescripteur et juge', NULL),
	(10, 5, 'en', 'Allah, the Only Legislator and Judge', NULL),
	(11, 24, 'fr', 'Ses attributs / Le Très-haut', NULL),
	(12, 24, 'en', 'His Attributes / The Highest', NULL),
	(13, 25, 'fr', 'Ses attributs / Le plus Savant', NULL),
	(14, 25, 'en', 'His Attributes / The All-Knowing', NULL),
	(15, 26, 'fr', 'Ses attributs / Le premier', NULL),
	(16, 26, 'en', 'His Attributes / The First', NULL),
	(17, 27, 'fr', 'Ses attributs / Celui qui donne un commencement à toute chose', NULL),
	(18, 27, 'en', 'His Attributes / The One Who Begins All Things', NULL),
	(19, 28, 'fr', 'Ses attributs / Le caché', NULL),
	(20, 28, 'en', 'His Attributes / The Hidden', NULL),
	(21, 29, 'fr', 'Ses attributs / Le charitable', NULL),
	(22, 29, 'en', 'His Attributes / The Charitable', NULL),
	(23, 30, 'fr', 'Ses attributs / Le clairvoyant', NULL),
	(24, 30, 'en', 'His Attributes / The All-Seeing', NULL),
	(25, 31, 'fr', 'Ses attributs / Celui qui voit tout', NULL),
	(26, 31, 'en', 'His Attributes / The One Who Sees Everything', NULL),
	(27, 32, 'fr', 'Ses attributs / Celui auquel on se repent', NULL),
	(28, 32, 'en', 'His Attributes / The One Who Accepts Repentance', NULL),
	(29, 33, 'fr', 'Ses attributs / Celui qui accueille les repentirs', NULL),
	(30, 33, 'en', 'His Attributes / The One Who Welcomes Repentance', NULL),
	(31, 34, 'fr', 'Ses attributs / Allah, le rassembleur (au jour dernier)', NULL),
	(32, 34, 'en', 'His Attributes / Allah, the Gatherer (on the Last Day)', NULL),
	(33, 35, 'fr', 'Ses attributs / Le Contraignant', NULL),
	(34, 35, 'en', 'His Attributes / The Constrainer', NULL),
	(35, 36, 'fr', 'Ses attributs / Allah suffit pour observer et compter', NULL),
	(36, 36, 'en', 'His Attributes / Allah Suffices as Observer', NULL),
	(37, 37, 'fr', 'Ses attributs / Allah est gardien par excellence sur toute chose', NULL),
	(38, 37, 'en', 'His Attributes / Allah is the Perfect Guardian', NULL),
	(39, 38, 'fr', 'Ses attributs / Le Vrai', NULL),
	(40, 38, 'en', 'His Attributes / The True', NULL),
	(41, 39, 'fr', 'Ses attributs / Le sage', NULL),
	(42, 39, 'en', 'His Attributes / The Wise', NULL),
	(43, 40, 'fr', 'Ses attributs / Allah est plein de mansuétude', NULL),
	(44, 40, 'en', 'His Attributes / Allah is Most Gentle', NULL),
	(45, 41, 'fr', 'Ses attributs / C\'est Lui qui est Indulgent', NULL),
	(46, 41, 'en', 'His Attributes / He is the Indulgent', NULL),
	(47, 42, 'fr', 'Ses attributs / Allah est digne de louange', NULL),
	(48, 42, 'en', 'His Attributes / Allah is Worthy of Praise', NULL),
	(49, 43, 'fr', 'Ses attributs / II est digne de louange', NULL),
	(50, 43, 'en', 'His Attributes / He is Worthy of Praise', NULL),
	(51, 44, 'fr', 'Ses attributs / Le Vivant', NULL),
	(52, 44, 'en', 'His Attributes / The Living', NULL),
	(53, 45, 'fr', 'Ses attributs / Le Créateur', NULL),
	(54, 45, 'en', 'His Attributes / The Creator', NULL),
	(55, 46, 'fr', 'Ses attributs / Allah est parfaitement connaisseur', NULL),
	(56, 46, 'en', 'His Attributes / Allah is Perfectly Knowing', NULL),
	(57, 47, 'fr', 'Ses attributs / Le Grand créateur', NULL),
	(58, 47, 'en', 'His Attributes / The Great Creator', NULL),
	(59, 48, 'fr', 'Ses attributs / Allah est compatissant', NULL),
	(60, 48, 'en', 'His Attributes / Allah is Compassionate', NULL),
	(61, 49, 'fr', 'Ses attributs / Le Tout Miséricordieux', NULL),
	(62, 49, 'en', 'His Attributes / The Most Merciful', NULL),
	(63, 50, 'fr', 'Ses attributs / Le Très Miséricordieux', NULL),
	(64, 50, 'en', 'His Attributes / The Very Merciful', NULL),
	(65, 51, 'fr', 'Ses attributs / Le Grand pourvoyeur', NULL),
	(66, 51, 'en', 'His Attributes / The Great Provider', NULL),
	(67, 52, 'fr', 'Ses attributs / Allah observe parfaitement', NULL),
	(68, 52, 'en', 'His Attributes / Allah Perfectly Observes', NULL),
	(69, 53, 'fr', 'Ses attributs / L\'Apaisant', NULL),
	(70, 53, 'en', 'His Attributes / The Peace-Giver', NULL),
	(71, 54, 'fr', 'Ses attributs / L\'Audient', NULL),
	(72, 54, 'en', 'His Attributes / The All-Hearing', NULL),
	(73, 55, 'fr', 'Ses attributs / Allah est Reconnaissant', NULL),
	(74, 55, 'en', 'His Attributes / Allah is Thankful', NULL),
	(75, 56, 'fr', 'Ses attributs / Allah est témoin', NULL),
	(76, 56, 'en', 'His Attributes / Allah is Witness', NULL),
	(77, 57, 'fr', 'Ses attributs / Allah est véridique', NULL),
	(78, 57, 'en', 'His Attributes / Allah is Truthful', NULL),
	(79, 58, 'fr', 'Ses attributs / Allah, Le Seul à être imploré pour ce que nous désirons', NULL),
	(80, 58, 'en', 'His Attributes / The One Invoked for Needs', NULL),
	(81, 59, 'fr', 'Ses attributs / Allah fait la nuisance', NULL),
	(82, 59, 'en', 'His Attributes / Allah Causes Harm', NULL),
	(83, 60, 'fr', 'Ses attributs / L\'apparent', NULL),
	(84, 60, 'en', 'His Attributes / The Apparent', NULL),
	(85, 61, 'fr', 'Ses attributs / Allah est le Puissant', NULL),
	(86, 61, 'en', 'His Attributes / Allah is the Mighty', NULL),
	(87, 62, 'fr', 'Ses attributs / Le Très Grand', NULL),
	(88, 62, 'en', 'His Attributes / The Most Great', NULL),
	(89, 63, 'fr', 'Ses attributs / Allah est indulgent', NULL),
	(90, 63, 'en', 'His Attributes / Allah is Indulgent', NULL),
	(93, 65, 'fr', 'Ses attributs / Allah est Omniscient', NULL),
	(94, 65, 'en', 'His Attributes / Allah is All-Knowing', NULL),
	(95, 66, 'fr', 'Ses attributs / Allah est Le Grand Pardonneur', NULL),
	(96, 66, 'en', 'His Attributes / Allah is the Great Forgiver', NULL),
	(97, 67, 'fr', 'Ses attributs / Allah est pardonneur', NULL),
	(98, 67, 'en', 'His Attributes / Allah is Forgiving', NULL),
	(99, 68, 'fr', 'Ses attributs / Allah n\'a pas besoin de rien', NULL),
	(100, 68, 'en', 'His Attributes / Allah Needs Nothing', NULL),
	(101, 69, 'fr', 'Ses attributs / Allah se suffit à Lui-même', NULL),
	(102, 69, 'en', 'His Attributes / Allah is Self-Sufficient', NULL),
	(103, 70, 'fr', 'Ses attributs / Allah est Le Grand Juge', NULL),
	(104, 70, 'en', 'His Attributes / Allah is the Great Judge', NULL),
	(105, 71, 'fr', 'Ses attributs / Allah est capable', NULL),
	(106, 71, 'en', 'His Attributes / Allah is Capable', NULL),
	(107, 72, 'fr', 'Ses attributs / Allah est le Dominateur Suprême', NULL),
	(108, 72, 'en', 'His Attributes / Allah is the Supreme Dominator', NULL),
	(109, 73, 'fr', 'Ses attributs / Le Pur', NULL),
	(110, 73, 'en', 'His Attributes / The Pure', NULL),
	(111, 74, 'fr', 'Ses attributs / Allah a pouvoir sur toute chose', NULL),
	(112, 74, 'en', 'His Attributes / Allah Has Power Over All Things', NULL),
	(113, 75, 'fr', 'Ses attributs / Allah est très Capable', NULL),
	(114, 75, 'en', 'His Attributes / Allah is Very Capable', NULL),
	(115, 76, 'fr', 'Ses attributs / Allah est tout proche', NULL),
	(116, 76, 'en', 'His Attributes / Allah is Very Near', NULL),
	(117, 77, 'fr', 'Ses attributs / Le Dominateur suprême', NULL),
	(118, 77, 'en', 'His Attributes / The Supreme Dominator', NULL),
	(119, 78, 'fr', 'Ses attributs / Allah est Fort', NULL),
	(120, 78, 'en', 'His Attributes / Allah is Strong', NULL),
	(121, 79, 'fr', 'Ses attributs / Celui qui subsiste par lui-même', NULL),
	(122, 79, 'en', 'His Attributes / Self-Subsisting', NULL),
	(123, 80, 'fr', 'Ses attributs / Allah suffit comme soutien', NULL),
	(124, 80, 'en', 'His Attributes / Allah Suffices as Helper', NULL),
	(125, 81, 'fr', 'Ses attributs / Allah est Grand', NULL),
	(126, 81, 'en', 'His Attributes / Allah is Great', NULL),
	(127, 82, 'fr', 'Ses attributs / Allah est généreux', NULL),
	(128, 82, 'en', 'His Attributes / Allah is Generous', NULL),
	(129, 83, 'fr', 'Ses attributs / Allah est le Doux', NULL),
	(130, 83, 'en', 'His Attributes / Allah is Gentle', NULL),
	(131, 84, 'fr', 'Ses attributs / Le Rassurant', NULL),
	(132, 84, 'en', 'His Attributes / The Reassurer', NULL),
	(133, 85, 'fr', 'Ses attributs / Le sublime', NULL),
	(134, 85, 'en', 'His Attributes / The Sublime', NULL),
	(135, 86, 'fr', 'Ses attributs / L\'orgueilleux', NULL),
	(136, 86, 'en', 'His Attributes / The Proud', NULL),
	(137, 87, 'fr', 'Ses attributs / Le Détenteur de la force', NULL),
	(138, 87, 'en', 'His Attributes / The Possessor of Strength', NULL),
	(139, 88, 'fr', 'Ses attributs / Allah répond toujours aux appels', NULL),
	(140, 88, 'en', 'His Attributes / Allah Answers Calls', NULL),
	(143, 90, 'fr', 'Ses attributs / Allah dénombre tout', NULL),
	(144, 90, 'en', 'His Attributes / Allah Enumerates All', NULL),
	(145, 91, 'fr', 'Ses attributs / Allah encercle', NULL),
	(146, 91, 'en', 'His Attributes / Allah Encompasses', NULL),
	(147, 92, 'fr', 'Ses attributs / Allah redonne la vie', NULL),
	(148, 92, 'en', 'His Attributes / Allah Restores Life', NULL),
	(149, 93, 'fr', 'Ses attributs / Allah humilie', NULL),
	(150, 93, 'en', 'His Attributes / Allah Humiliates', NULL),
	(151, 94, 'fr', 'Ses attributs / C\'est Allah qu\'il faut appeler au secours', NULL),
	(152, 94, 'en', 'His Attributes / Allah is to be Implored for Help', NULL),
	(153, 95, 'fr', 'Ses attributs / le Formateur', NULL),
	(154, 95, 'en', 'His Attributes / The Shaper', NULL),
	(155, 97, 'fr', 'Ses attributs / Allah refait la création', NULL),
	(156, 97, 'en', 'His Attributes / Allah Recreates', NULL),
	(157, 98, 'fr', 'Ses attributs / Allah enrichit', NULL),
	(158, 98, 'en', 'His Attributes / Allah Enriches', NULL),
	(159, 99, 'fr', 'Ses attributs / Allah est omnipotent', NULL),
	(160, 99, 'en', 'His Attributes / Allah is Omnipotent', NULL),
	(161, 102, 'fr', 'Ses attributs / Allah est le Souverain', NULL),
	(162, 102, 'en', 'His Attributes / Allah is the Sovereign', NULL),
	(163, 106, 'fr', 'Ses attributs / Allah est notre Maître', NULL),
	(164, 106, 'en', 'His Attributes / Allah is Our Master', NULL),
	(165, 110, 'fr', 'Ses attributs / Allah est l\'Unique', NULL),
	(166, 110, 'en', 'His Attributes / Allah is the Unique', NULL),
	(167, 113, 'fr', 'Ses attributs / Allah est le protecteur', NULL),
	(168, 113, 'en', 'His Attributes / Allah is the Protector', NULL);
UNLOCK TABLES;


LOCK TABLES `subcategories` WRITE;
TRUNCATE TABLE `subcategories`;
INSERT INTO `subcategories` (`id`, `category_id`, `slug`, `sort_order`) VALUES 
	(1, 1, 'unicity-of-allah', 1),
	(2, 1, 'avoidance-of-ignorant', 2),
	(3, 1, 'punishment-of-apostates', 3),
	(4, 1, 'polytheism-and-polytheists', 4),
	(5, 1, 'disbelievers', 5),
	(6, 1, 'liars-and-unjust', 6),
	(7, 1, 'atheists-denying-resurrection', 7),
	(8, 1, 'punishment-of-corrupt-criminals', 8);
UNLOCK TABLES;


LOCK TABLES `items` WRITE;
TRUNCATE TABLE `items`;
INSERT INTO `items` (`id`, `category_id`, `subcategory_id`, `slug`, `sort_order`) VALUES 
	(1, NULL, 1, 'his-will', 1),
	(2, NULL, 1, 'the-most-beautiful-names-of-allah', 2),
	(3, NULL, 1, 'to-him-all-actions-return', 3),
	(4, NULL, 1, 'punitive-warning-to-polytheists', 4),
	(5, NULL, 1, 'allah-the-only-legislator-and-judge', 5),
	(6, NULL, 1, 'peoples-beliefs-and-passions', 6),
	(7, NULL, 1, 'allahs-commandments', 7),
	(8, NULL, 1, 'condemnation-of-denial-of-tawhid', 8),
	(9, NULL, 1, 'allah-free-from-injustice', 9),
	(10, NULL, 1, 'absolute-faith-in-allah', 10),
	(11, NULL, 1, 'trust-in-allah', 11),
	(12, NULL, 1, 'love-of-the-most-high', 12),
	(13, NULL, 1, 'his-gentleness', 13),
	(14, NULL, 1, 'praise-glory-and-thanks-to-allah', 14),
	(15, NULL, 1, 'fear-and-piety', 15),
	(16, NULL, 1, 'invitation-to-opponents-of-tawhid', 16),
	(17, NULL, 1, 'lord-of-the-worlds', 17),
	(18, NULL, 1, 'his-mercy', 18),
	(19, NULL, 1, 'his-approval', 19),
	(20, NULL, 1, 'his-attributes-allah', 20),
	(21, NULL, 1, 'his-attributes-divinity', 21),
	(22, NULL, 1, 'his-attributes-the-last', 22),
	(23, NULL, 1, 'his-attributes-the-unique', 23),
	(24, NULL, 1, 'his-attributes-the-highest', 24),
	(25, NULL, 1, 'his-attributes-the-all-knowing', 25),
	(26, NULL, 1, 'his-attributes-the-first', 26),
	(27, NULL, 1, 'his-attributes-the-one-who-begins-all-things', 27),
	(28, NULL, 1, 'his-attributes-the-hidden', 28),
	(29, NULL, 1, 'his-attributes-the-charitable', 29),
	(30, NULL, 1, 'his-attributes-the-all-seeing', 30),
	(31, NULL, 1, 'his-attributes-the-one-who-sees-everything', 31),
	(32, NULL, 1, 'his-attributes-the-one-who-accepts-repentance', 32),
	(33, NULL, 1, 'his-attributes-the-one-who-welcomes-repentance', 33),
	(34, NULL, 1, 'his-attributes-the-gatherer', 34),
	(35, NULL, 1, 'his-attributes-the-constrainer', 35),
	(36, NULL, 1, 'his-attributes-allah-suffices-as-observer', 36),
	(37, NULL, 1, 'his-attributes-allah-the-perfect-guardian', 37),
	(38, NULL, 1, 'his-attributes-the-true', 38),
	(39, NULL, 1, 'his-attributes-the-wise', 39),
	(40, NULL, 1, 'his-attributes-allah-most-gentle', 40),
	(41, NULL, 1, 'his-attributes-the-indulgent', 41),
	(42, NULL, 1, 'his-attributes-allah-worthy-of-praise', 42),
	(43, NULL, 1, 'his-attributes-he-is-worthy-of-praise', 43),
	(44, NULL, 1, 'his-attributes-the-living', 44),
	(45, NULL, 1, 'his-attributes-the-creator', 45),
	(46, NULL, 1, 'his-attributes-allah-perfectly-knowing', 46),
	(47, NULL, 1, 'his-attributes-the-great-creator', 47),
	(48, NULL, 1, 'his-attributes-allah-compassionate', 48),
	(49, NULL, 1, 'his-attributes-the-most-merciful', 49),
	(50, NULL, 1, 'his-attributes-the-very-merciful', 50),
	(51, NULL, 1, 'his-attributes-the-great-provider', 51),
	(52, NULL, 1, 'his-attributes-allah-perfectly-observes', 52),
	(53, NULL, 1, 'his-attributes-the-peace-giver', 53),
	(54, NULL, 1, 'his-attributes-the-all-hearing', 54),
	(55, NULL, 1, 'his-attributes-allah-thankful', 55),
	(56, NULL, 1, 'his-attributes-allah-witness', 56),
	(57, NULL, 1, 'his-attributes-allah-truthful', 57),
	(58, NULL, 1, 'his-attributes-the-one-invoked-for-needs', 58),
	(59, NULL, 1, 'his-attributes-allah-causes-harm', 59),
	(60, NULL, 1, 'his-attributes-the-apparent', 60),
	(61, NULL, 1, 'his-attributes-allah-the-mighty', 61),
	(62, NULL, 1, 'his-attributes-the-most-great', 62),
	(63, NULL, 1, 'his-attributes-allah-indulgent', 63),
	(64, NULL, 1, 'his-attributes-the-most-high', 64),
	(65, NULL, 1, 'his-attributes-allah-all-knowing', 65),
	(66, NULL, 1, 'his-attributes-allah-the-great-forgiver', 66),
	(67, NULL, 1, 'his-attributes-allah-forgiving', 67),
	(68, NULL, 1, 'his-attributes-allah-needs-nothing', 68),
	(69, NULL, 1, 'his-attributes-allah-self-sufficient', 69),
	(70, NULL, 1, 'his-attributes-allah-the-great-judge', 70),
	(71, NULL, 1, 'his-attributes-allah-capable', 71),
	(72, NULL, 1, 'his-attributes-allah-the-supreme-dominator', 72),
	(73, NULL, 1, 'his-attributes-the-pure', 73),
	(74, NULL, 1, 'his-attributes-allah-has-power-over-all-things', 74),
	(75, NULL, 1, 'his-attributes-allah-very-capable', 75),
	(76, NULL, 1, 'his-attributes-allah-very-near', 76),
	(77, NULL, 1, 'his-attributes-the-supreme-dominator', 77),
	(78, NULL, 1, 'his-attributes-allah-strong', 78),
	(79, NULL, 1, 'his-attributes-self-subsisting', 79),
	(80, NULL, 1, 'his-attributes-allah-sufficient-as-helper', 80),
	(81, NULL, 1, 'his-attributes-allah-great', 81),
	(82, NULL, 1, 'his-attributes-allah-generous', 82),
	(83, NULL, 1, 'his-attributes-allah-gentle', 83),
	(84, NULL, 1, 'his-attributes-the-reassurer', 84),
	(85, NULL, 1, 'his-attributes-the-sublime', 85),
	(86, NULL, 1, 'his-attributes-the-proud', 86),
	(87, NULL, 1, 'his-attributes-the-possessor-of-strength', 87),
	(88, NULL, 1, 'his-attributes-allah-answers-calls', 88),
	(89, NULL, 1, 'his-attributes-allah-is-worthy-of-praise', 89),
	(90, NULL, 1, 'his-attributes-allah-enumerates-all', 90),
	(91, NULL, 1, 'his-attributes-allah-encompasses', 91),
	(92, NULL, 1, 'his-attributes-allah-restores-life', 92),
	(93, NULL, 1, 'his-attributes-allah-humiliates', 93),
	(94, NULL, 1, 'his-attributes-allah-to-be-implored-for-help', 94),
	(95, NULL, 1, 'his-attributes-the-shaper', 95),
	(96, NULL, 1, 'his-attributes-allah-gives-power', 96),
	(97, NULL, 1, 'his-attributes-allah-recreates', 97),
	(98, NULL, 1, 'his-attributes-allah-enriches', 98),
	(99, NULL, 1, 'his-attributes-allah-omnipotent', 99),
	(100, NULL, 1, 'his-attributes-allah-makes-acquire', 100),
	(101, NULL, 1, 'his-attributes-allah-powerful-over-all-things', 101),
	(102, NULL, 1, 'his-attributes-allah-the-sovereign', 102),
	(103, NULL, 1, 'his-attributes-he-is-the-sovereign', 103),
	(104, NULL, 1, 'his-attributes-allah-avenge-criminals', 104),
	(105, NULL, 1, 'his-attributes-the-predominant', 105),
	(106, NULL, 1, 'his-attributes-allah-our-master', 106),
	(107, NULL, 1, 'his-attributes-allah-sufficient-as-protector', 107),
	(108, NULL, 1, 'his-attributes-allah-light', 108),
	(109, NULL, 1, 'his-attributes-allah-sufficient-as-guide', 109),
	(110, NULL, 1, 'his-attributes-allah-the-unique', 110),
	(111, NULL, 1, 'his-attributes-allah-the-inheritor', 111),
	(112, NULL, 1, 'his-attributes-allah-the-immense', 112),
	(113, NULL, 1, 'his-attributes-allah-the-protector', 113);
UNLOCK TABLES;


LOCK TABLES `subcategory_translations` WRITE;
TRUNCATE TABLE `subcategory_translations`;
INSERT INTO `subcategory_translations` (`id`, `subcategory_id`, `language_code`, `label`, `description`) VALUES 
	(1, 1, 'fr', 'L\'unicité d\'Allah', NULL),
	(2, 1, 'en', 'The Oneness of Allah', NULL),
	(3, 2, 'fr', 'L\'éloignement des ignorants', NULL),
	(4, 2, 'en', 'Avoidance of the Ignorant', NULL),
	(5, 3, 'fr', 'Les punitions des apostats', NULL),
	(6, 3, 'en', 'Punishment of Apostates', NULL),
	(7, 4, 'fr', 'Le polythéisme et les polythéistes', NULL),
	(8, 4, 'en', 'Polytheism and the Polytheists', NULL),
	(9, 5, 'fr', 'Les mécréants', NULL),
	(10, 5, 'en', 'The Disbelievers', NULL),
	(11, 6, 'fr', 'Les menteurs et les injustes', NULL),
	(12, 6, 'en', 'The Liars and the Unjust', NULL),
	(13, 7, 'fr', 'Les athées qui ne croient pas au Jour de la Résurrection', NULL),
	(14, 7, 'en', 'Atheists Who Deny the Day of Resurrection', NULL),
	(15, 8, 'fr', 'La punition des corrupteurs, des criminels et des pervers', NULL),
	(16, 8, 'en', 'Punishment of the Corrupt, Criminals, and the Wicked', NULL);
UNLOCK TABLES;


LOCK TABLES `topics` WRITE;
TRUNCATE TABLE `topics`;
INSERT INTO `topics` (`id`, `slug`, `sort_order`) VALUES 
	(1, 'pillars-of-islam', 1),
	(2, 'belief', 2),
	(3, 'preaching-to-allah', 3),
	(4, 'the-holy-quran', 4),
	(5, 'jihad', 5),
	(6, 'work', 6),
	(7, 'moral-relations', 7),
	(8, 'social-relations', 8),
	(9, 'financial-relations', 9),
	(10, 'commerce-agriculture-manufacturing', 10),
	(11, 'jurisprudential-relations', 11),
	(12, 'political-and-public-relations', 12),
	(13, 'sciences-and-arts', 13),
	(14, 'religions', 14),
	(15, 'stories-and-history', 15);
UNLOCK TABLES;


LOCK TABLES `topic_translations` WRITE;
TRUNCATE TABLE `topic_translations`;
INSERT INTO `topic_translations` (`id`, `topic_id`, `language_code`, `label`, `description`) VALUES 
	(1, 1, 'fr', 'Les piliers de l\'islam', NULL),
	(2, 1, 'en', 'The Pillars of Islam', NULL),
	(3, 2, 'fr', 'La croyance', NULL),
	(4, 2, 'en', 'Belief', NULL),
	(5, 3, 'fr', 'Le prêche (Al-Da\'waa) à Allah', NULL),
	(6, 3, 'en', 'Preaching (Al-Da\'waa) to Allah', NULL),
	(7, 4, 'fr', 'Le Saint Coran', NULL),
	(8, 4, 'en', 'The Holy Quran', NULL),
	(9, 5, 'fr', 'Le Jihad (la bataille dans la voie d\'Allah)', NULL),
	(10, 5, 'en', 'Jihad (Striving in the Path of Allah)', NULL),
	(11, 6, 'fr', 'Le travail', NULL),
	(12, 6, 'en', 'Work', NULL),
	(13, 7, 'fr', 'L\'homme et les relations morales', NULL),
	(14, 7, 'en', 'Man and Moral Relations', NULL),
	(15, 8, 'fr', 'L\'homme et les relations sociales', NULL),
	(16, 8, 'en', 'Man and Social Relations', NULL),
	(17, 9, 'fr', 'L\'organisation des relations financières', NULL),
	(18, 9, 'en', 'The Organization of Financial Relations', NULL),
	(19, 10, 'fr', 'Le commerce, l\'agriculture et la fabrication', NULL),
	(20, 10, 'en', 'Commerce, Agriculture, and Manufacturing', NULL),
	(21, 11, 'fr', 'Les relations jurisprudentielles', NULL),
	(22, 11, 'en', 'Jurisprudential Relations', NULL),
	(23, 12, 'fr', 'Les relations politiques et publiques', NULL),
	(24, 12, 'en', 'Political and Public Relations', NULL),
	(25, 13, 'fr', 'Les Sciences et les Arts', NULL),
	(26, 13, 'en', 'Sciences and Arts', NULL),
	(27, 14, 'fr', 'Les religions', NULL),
	(28, 14, 'en', 'Religions', NULL),
	(29, 15, 'fr', 'Les contes et l\'histoire', NULL),
	(30, 15, 'en', 'Stories and History', NULL);
UNLOCK TABLES;






SET FOREIGN_KEY_CHECKS = @ORIG_FOREIGN_KEY_CHECKS;

SET UNIQUE_CHECKS = @ORIG_UNIQUE_CHECKS;

SET @ORIG_TIME_ZONE = @@TIME_ZONE;
SET TIME_ZONE = @ORIG_TIME_ZONE;



#  Export Finished: 20 November 2025 at 22:33:44 CET
