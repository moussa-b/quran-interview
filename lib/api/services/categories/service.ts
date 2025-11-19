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
    let query: string;
    let params: unknown[];
    
    if (topicId !== undefined && language) {
      query = `
        SELECT 
          c.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ct.id,
              'category_id', ct.category_id,
              'language_code', ct.language_code,
              'label', ct.label,
              'description', ct.description
            )
          ) as translations_json
        FROM categories c
        LEFT JOIN category_translations ct ON ct.category_id = c.id AND ct.language_code = ?
        WHERE c.topic_id = ?
        GROUP BY c.id
        ORDER BY c.sort_order ASC
      `;
      params = [language, topicId];
    } else if (topicId !== undefined) {
      query = `
        SELECT 
          c.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ct.id,
              'category_id', ct.category_id,
              'language_code', ct.language_code,
              'label', ct.label,
              'description', ct.description
            )
          ) as translations_json
        FROM categories c
        LEFT JOIN category_translations ct ON ct.category_id = c.id
        WHERE c.topic_id = ?
        GROUP BY c.id
        ORDER BY c.sort_order ASC
      `;
      params = [topicId];
    } else if (language) {
      query = `
        SELECT 
          c.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ct.id,
              'category_id', ct.category_id,
              'language_code', ct.language_code,
              'label', ct.label,
              'description', ct.description
            )
          ) as translations_json
        FROM categories c
        LEFT JOIN category_translations ct ON ct.category_id = c.id AND ct.language_code = ?
        GROUP BY c.id
        ORDER BY c.sort_order ASC
      `;
      params = [language];
    } else {
      query = `
        SELECT 
          c.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ct.id,
              'category_id', ct.category_id,
              'language_code', ct.language_code,
              'label', ct.label,
              'description', ct.description
            )
          ) as translations_json
        FROM categories c
        LEFT JOIN category_translations ct ON ct.category_id = c.id
        GROUP BY c.id
        ORDER BY c.sort_order ASC
      `;
      params = [];
    }
    
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    // Parse JSON and construct results
    return rows.map(row => {
      const translationsJson = row.translations_json;
      let translations: CategoryTranslation[] = [];
      
      if (translationsJson && translationsJson !== 'null') {
        const parsed = typeof translationsJson === 'string' 
          ? JSON.parse(translationsJson) 
          : translationsJson;
        // Filter out null entries (from LEFT JOIN with no match)
        translations = parsed.filter((t: CategoryTranslation | null) => t && t.id !== null);
      }
      
      return {
        id: row.id,
        topic_id: row.topic_id,
        slug: row.slug,
        sort_order: row.sort_order,
        translations,
      };
    });
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
    const query = language
      ? `
        SELECT 
          c.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ct.id,
              'category_id', ct.category_id,
              'language_code', ct.language_code,
              'label', ct.label,
              'description', ct.description
            )
          ) as translations_json
        FROM categories c
        LEFT JOIN category_translations ct ON ct.category_id = c.id AND ct.language_code = ?
        WHERE c.id = ?
        GROUP BY c.id
      `
      : `
        SELECT 
          c.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ct.id,
              'category_id', ct.category_id,
              'language_code', ct.language_code,
              'label', ct.label,
              'description', ct.description
            )
          ) as translations_json
        FROM categories c
        LEFT JOIN category_translations ct ON ct.category_id = c.id
        WHERE c.id = ?
        GROUP BY c.id
      `;
    
    const params = language ? [language, id] : [id];
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    const translationsJson = row.translations_json;
    let translations: CategoryTranslation[] = [];
    
    if (translationsJson && translationsJson !== 'null') {
      const parsed = typeof translationsJson === 'string' 
        ? JSON.parse(translationsJson) 
        : translationsJson;
      // Filter out null entries (from LEFT JOIN with no match)
      translations = parsed.filter((t: CategoryTranslation | null) => t && t.id !== null);
    }
    
    return {
      id: row.id,
      topic_id: row.topic_id,
      slug: row.slug,
      sort_order: row.sort_order,
      translations,
    };
  } finally {
    await connection.end();
  }
}

