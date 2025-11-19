import { getConnection } from '@/lib/db/connection';
import type { RowDataPacket } from 'mysql2/promise';
import {
  Category,
  CategoryTranslation,
  CategoryWithTranslations,
} from '../types';

/**
 * Fetch all categories with their translations
 * 
 * @param topicId - Optional topic ID to filter categories
 * @param language - Optional language code to filter translations
 * @returns Promise with array of categories
 */
export async function getCategories(
  topicId?: number,
  language?: string
): Promise<CategoryWithTranslations[]> {
  const connection = await getConnection();
  
  try {
    // Fetch categories
    const categoryQuery = topicId
      ? 'SELECT * FROM categories WHERE topic_id = ? ORDER BY sort_order ASC'
      : 'SELECT * FROM categories ORDER BY sort_order ASC';
    
    const categoryParams = topicId ? [topicId] : [];
    const [categoriesRows] = await connection.execute<RowDataPacket[]>(
      categoryQuery,
      categoryParams
    );
    const categories = categoriesRows as Category[];

    // Get category IDs for translations query
    const categoryIds = categories.map(c => c.id);
    if (categoryIds.length === 0) {
      return [];
    }

    // Fetch translations
    const translationQuery = language
      ? `SELECT * FROM category_translations WHERE category_id IN (?) AND language_code = ? ORDER BY category_id`
      : `SELECT * FROM category_translations WHERE category_id IN (?) ORDER BY category_id`;
    
    const translationParams = language ? [categoryIds, language] : [categoryIds];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as CategoryTranslation[];

    // Group translations by category_id
    const translationsMap = new Map<number, CategoryTranslation[]>();
    translations.forEach(trans => {
      if (!translationsMap.has(trans.category_id)) {
        translationsMap.set(trans.category_id, []);
      }
      translationsMap.get(trans.category_id)!.push(trans);
    });

    // Combine categories with translations
    return categories.map(category => ({
      ...category,
      translations: translationsMap.get(category.id) || [],
    }));
  } finally {
    await connection.end();
  }
}

/**
 * Fetch a single category by ID with translations
 * 
 * @param id - Category ID
 * @param language - Optional language code to filter translations
 * @returns Promise with category data or null if not found
 */
export async function getCategory(id: number, language?: string): Promise<CategoryWithTranslations | null> {
  const connection = await getConnection();
  
  try {
    // Fetch category
    const [categoriesRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    const categories = categoriesRows as Category[];
    
    if (categories.length === 0) {
      return null;
    }
    const category = categories[0];

    // Fetch translations
    const translationQuery = language
      ? 'SELECT * FROM category_translations WHERE category_id = ? AND language_code = ?'
      : 'SELECT * FROM category_translations WHERE category_id = ?';
    
    const translationParams = language ? [id, language] : [id];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as CategoryTranslation[];

    return {
      ...category,
      translations,
    };
  } finally {
    await connection.end();
  }
}

