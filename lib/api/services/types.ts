/**
 * Database Types for Quran Topics Taxonomy
 * 
 * This module defines centralized types for topics, categories, subcategories, and items
 * that organize Quran topics and their references. All services import from this file.
 */

/**
 * Topic - Top level categorization of Quran topics
 */
export interface Topic {
  id: number;
  slug: string;
  sort_order: number;
}

/**
 * Topic Translation
 */
export interface TopicTranslation {
  id: number;
  topic_id: number;
  language_code: string;
  label: string;
  description: string | null;
}

/**
 * Topic with translations (joined data)
 */
export interface TopicWithTranslations extends Topic {
  translations: TopicTranslation[];
  categories_count: number;
  subcategories_count: number;
  chapters_count: number;
  verses_count: number;
}

/**
 * Category - Linked to a Topic
 */
export interface Category {
  id: number;
  topic_id: number;
  slug: string;
  sort_order: number;
}

/**
 * Category Translation
 */
export interface CategoryTranslation {
  id: number;
  category_id: number;
  language_code: string;
  label: string;
  description: string | null;
}

/**
 * Category with translations (joined data)
 */
export interface CategoryWithTranslations extends Category {
  translations: CategoryTranslation[];
}

/**
 * Subcategory - Linked to a Category
 */
export interface Subcategory {
  id: number;
  category_id: number;
  slug: string;
  sort_order: number;
}

/**
 * Subcategory Translation
 */
export interface SubcategoryTranslation {
  id: number;
  subcategory_id: number;
  language_code: string;
  label: string;
  description: string | null;
}

/**
 * Subcategory with translations (joined data)
 */
export interface SubcategoryWithTranslations extends Subcategory {
  translations: SubcategoryTranslation[];
}

/**
 * Item - Linked to either a Category or Subcategory
 * Can have many Quran references
 */
export interface Item {
  id: number;
  category_id: number | null;
  subcategory_id: number | null;
  slug: string;
  sort_order: number;
}

/**
 * Item Translation
 */
export interface ItemTranslation {
  id: number;
  item_id: number;
  language_code: string;
  label: string;
  description: string | null;
}

/**
 * Item Quran Reference - Links an Item to specific Quran verses
 */
export interface ItemQuranRef {
  id: number;
  item_id: number;
  chapter: number;
  start_verse: number;
  end_verse: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Item with translations and Quran references (joined data)
 */
export interface ItemWithDetails extends Item {
  translations: ItemTranslation[];
  quran_refs: ItemQuranRef[];
}

export interface ItemSearchResultWithDetails extends ItemWithDetails {
  topic?: {
    id: number;
    slug: string;
    translations: TopicTranslation[];
  };
  category?: {
    id: number;
    slug: string;
    translations: CategoryTranslation[];
  };
  subcategory?: {
    id: number;
    slug: string;
    translations: SubcategoryTranslation[];
  };
}

/**
 * API Response types
 */
export interface TopicsResponse {
  topics: TopicWithTranslations[];
}

export interface TopicResponse {
  topic: TopicWithTranslations;
}

export interface CategoriesResponse {
  categories: CategoryWithTranslations[];
}

export interface CategoryResponse {
  category: CategoryWithTranslations;
}

export interface SubcategoriesResponse {
  subcategories: SubcategoryWithTranslations[];
}

export interface SubcategoryResponse {
  subcategory: SubcategoryWithTranslations;
}

export interface ItemsResponse {
  items: ItemWithDetails[];
}

export interface ItemResponse {
  item: ItemWithDetails;
}

export interface ItemSearchResponse {
  items: ItemSearchResultWithDetails[];
}

