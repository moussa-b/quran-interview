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
    let query: string;
    let params: unknown[];
    
    if (categoryId !== undefined && language) {
      query = `
        SELECT 
          s.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', st.id,
              'subcategory_id', st.subcategory_id,
              'language_code', st.language_code,
              'label', st.label,
              'description', st.description
            )
          ) as translations_json
        FROM subcategories s
        LEFT JOIN subcategory_translations st ON st.subcategory_id = s.id AND st.language_code = ?
        WHERE s.category_id = ?
        GROUP BY s.id
        ORDER BY s.sort_order ASC
      `;
      params = [language, categoryId];
    } else if (categoryId !== undefined) {
      query = `
        SELECT 
          s.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', st.id,
              'subcategory_id', st.subcategory_id,
              'language_code', st.language_code,
              'label', st.label,
              'description', st.description
            )
          ) as translations_json
        FROM subcategories s
        LEFT JOIN subcategory_translations st ON st.subcategory_id = s.id
        WHERE s.category_id = ?
        GROUP BY s.id
        ORDER BY s.sort_order ASC
      `;
      params = [categoryId];
    } else if (language) {
      query = `
        SELECT 
          s.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', st.id,
              'subcategory_id', st.subcategory_id,
              'language_code', st.language_code,
              'label', st.label,
              'description', st.description
            )
          ) as translations_json
        FROM subcategories s
        LEFT JOIN subcategory_translations st ON st.subcategory_id = s.id AND st.language_code = ?
        GROUP BY s.id
        ORDER BY s.sort_order ASC
      `;
      params = [language];
    } else {
      query = `
        SELECT 
          s.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', st.id,
              'subcategory_id', st.subcategory_id,
              'language_code', st.language_code,
              'label', st.label,
              'description', st.description
            )
          ) as translations_json
        FROM subcategories s
        LEFT JOIN subcategory_translations st ON st.subcategory_id = s.id
        GROUP BY s.id
        ORDER BY s.sort_order ASC
      `;
      params = [];
    }
    
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    // Parse JSON and construct results
    return rows.map(row => {
      const translationsJson = row.translations_json;
      let translations: SubcategoryTranslation[] = [];
      
      if (translationsJson && translationsJson !== 'null') {
        const parsed = typeof translationsJson === 'string' 
          ? JSON.parse(translationsJson) 
          : translationsJson;
        // Filter out null entries (from LEFT JOIN with no match)
        translations = parsed.filter((t: SubcategoryTranslation | null) => t && t.id !== null);
      }
      
      return {
        id: row.id,
        category_id: row.category_id,
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
 * Fetch a single subcategory by ID with translations
 * 
 * @param id - Subcategory ID
 * @param language - Optional language code to filter translations
 * @returns Promise with subcategory data or null if not found
 */
export async function getSubcategory(id: number, language?: string): Promise<SubcategoryWithTranslations | null> {
  const connection = await getConnection();
  
  try {
    const query = language
      ? `
        SELECT 
          s.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', st.id,
              'subcategory_id', st.subcategory_id,
              'language_code', st.language_code,
              'label', st.label,
              'description', st.description
            )
          ) as translations_json
        FROM subcategories s
        LEFT JOIN subcategory_translations st ON st.subcategory_id = s.id AND st.language_code = ?
        WHERE s.id = ?
        GROUP BY s.id
      `
      : `
        SELECT 
          s.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', st.id,
              'subcategory_id', st.subcategory_id,
              'language_code', st.language_code,
              'label', st.label,
              'description', st.description
            )
          ) as translations_json
        FROM subcategories s
        LEFT JOIN subcategory_translations st ON st.subcategory_id = s.id
        WHERE s.id = ?
        GROUP BY s.id
      `;
    
    const params = language ? [language, id] : [id];
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    const translationsJson = row.translations_json;
    let translations: SubcategoryTranslation[] = [];
    
    if (translationsJson && translationsJson !== 'null') {
      const parsed = typeof translationsJson === 'string' 
        ? JSON.parse(translationsJson) 
        : translationsJson;
      // Filter out null entries (from LEFT JOIN with no match)
      translations = parsed.filter((t: SubcategoryTranslation | null) => t && t.id !== null);
    }
    
    return {
      id: row.id,
      category_id: row.category_id,
      slug: row.slug,
      sort_order: row.sort_order,
      translations,
    };
  } finally {
    await connection.end();
  }
}

