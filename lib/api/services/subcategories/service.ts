import { getConnection } from '@/lib/db/connection';
import type { RowDataPacket } from 'mysql2/promise';
import {
  Subcategory,
  SubcategoryTranslation,
  SubcategoryWithTranslations,
} from '../types';

/**
 * Fetch all subcategories with their translations
 * 
 * @param categoryId - Optional category ID to filter subcategories
 * @param language - Optional language code to filter translations
 * @returns Promise with array of subcategories
 */
export async function getSubcategories(
  categoryId?: number,
  language?: string
): Promise<SubcategoryWithTranslations[]> {
  const connection = await getConnection();
  
  try {
    // Fetch subcategories
    const subcategoryQuery = categoryId
      ? 'SELECT * FROM subcategories WHERE category_id = ? ORDER BY sort_order ASC'
      : 'SELECT * FROM subcategories ORDER BY sort_order ASC';
    
    const subcategoryParams = categoryId ? [categoryId] : [];
    const [subcategoriesRows] = await connection.execute<RowDataPacket[]>(
      subcategoryQuery,
      subcategoryParams
    );
    const subcategories = subcategoriesRows as Subcategory[];

    // Get subcategory IDs for translations query
    const subcategoryIds = subcategories.map(s => s.id);
    if (subcategoryIds.length === 0) {
      return [];
    }

    // Fetch translations
    const translationQuery = language
      ? `SELECT * FROM subcategory_translations WHERE subcategory_id IN (?) AND language_code = ? ORDER BY subcategory_id`
      : `SELECT * FROM subcategory_translations WHERE subcategory_id IN (?) ORDER BY subcategory_id`;
    
    const translationParams = language ? [subcategoryIds, language] : [subcategoryIds];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as SubcategoryTranslation[];

    // Group translations by subcategory_id
    const translationsMap = new Map<number, SubcategoryTranslation[]>();
    translations.forEach(trans => {
      if (!translationsMap.has(trans.subcategory_id)) {
        translationsMap.set(trans.subcategory_id, []);
      }
      translationsMap.get(trans.subcategory_id)!.push(trans);
    });

    // Combine subcategories with translations
    return subcategories.map(subcategory => ({
      ...subcategory,
      translations: translationsMap.get(subcategory.id) || [],
    }));
  } finally {
    await connection.end();
  }
}

/**
 * Fetch a single subcategory by ID with translations
 * 
 * @param id - Subcategory ID
 * @param language - Optional language code to filter translations
 * @returns Promise with subcategory data or null if not found
 */
export async function getSubcategory(id: number, language?: string): Promise<SubcategoryWithTranslations | null> {
  const connection = await getConnection();
  
  try {
    // Fetch subcategory
    const [subcategoriesRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM subcategories WHERE id = ?',
      [id]
    );
    const subcategories = subcategoriesRows as Subcategory[];
    
    if (subcategories.length === 0) {
      return null;
    }
    const subcategory = subcategories[0];

    // Fetch translations
    const translationQuery = language
      ? 'SELECT * FROM subcategory_translations WHERE subcategory_id = ? AND language_code = ?'
      : 'SELECT * FROM subcategory_translations WHERE subcategory_id = ?';
    
    const translationParams = language ? [id, language] : [id];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as SubcategoryTranslation[];

    return {
      ...subcategory,
      translations,
    };
  } finally {
    await connection.end();
  }
}

