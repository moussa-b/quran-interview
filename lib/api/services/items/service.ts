import { getConnection } from '@/lib/db/connection';
import type { RowDataPacket } from 'mysql2/promise';
import {
  Item,
  ItemTranslation,
  ItemQuranRef,
  ItemWithDetails,
} from '../types';

/**
 * Fetch all items with their translations and Quran references
 * 
 * @param categoryId - Optional category ID to filter items
 * @param subcategoryId - Optional subcategory ID to filter items
 * @param language - Optional language code to filter translations
 * @returns Promise with array of items
 */
export async function getItems(
  categoryId?: number,
  subcategoryId?: number,
  language?: string
): Promise<ItemWithDetails[]> {
  const connection = await getConnection();
  
  try {
    // Build base query with subqueries for translations and refs
    let query = `
      SELECT 
        i.*,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', it.id,
              'item_id', it.item_id,
              'language_code', it.language_code,
              'label', it.label,
              'description', it.description
            )
          )
          FROM item_translations it
          WHERE it.item_id = i.id
          ${language ? 'AND it.language_code = ?' : ''}
        ) as translations_json,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', iqr.id,
              'item_id', iqr.item_id,
              'chapter', iqr.chapter,
              'start_verse', iqr.start_verse,
              'end_verse', iqr.end_verse,
              'metadata', iqr.metadata,
              'created_at', iqr.created_at,
              'updated_at', iqr.updated_at
            )
          )
          FROM item_quran_refs iqr
          WHERE iqr.item_id = i.id
          ORDER BY iqr.chapter, iqr.start_verse
        ) as quran_refs_json
      FROM items i
    `;
    
    const params: unknown[] = [];
    
    if (language) {
      params.push(language);
    }
    
    if (categoryId !== undefined) {
      query += ' WHERE i.category_id = ?';
      params.push(categoryId);
    } else if (subcategoryId !== undefined) {
      query += ' WHERE i.subcategory_id = ?';
      params.push(subcategoryId);
    }
    
    query += ' ORDER BY i.sort_order ASC';
    
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    // Parse JSON and construct results
    return rows.map(row => {
      const translationsJson = row.translations_json;
      const quranRefsJson = row.quran_refs_json;
      
      let translations: ItemTranslation[] = [];
      let quran_refs: ItemQuranRef[] = [];
      
      if (translationsJson && translationsJson !== 'null') {
        const parsed = typeof translationsJson === 'string' 
          ? JSON.parse(translationsJson) 
          : translationsJson;
        // Filter out null entries
        translations = parsed.filter((t: ItemTranslation | null) => t && t.id !== null);
      }
      
      if (quranRefsJson && quranRefsJson !== 'null') {
        const parsed = typeof quranRefsJson === 'string' 
          ? JSON.parse(quranRefsJson) 
          : quranRefsJson;
        // Filter out null entries
        quran_refs = parsed.filter((r: ItemQuranRef | null) => r && r.id !== null);
      }
      
      return {
        id: row.id,
        category_id: row.category_id,
        subcategory_id: row.subcategory_id,
        slug: row.slug,
        sort_order: row.sort_order,
        translations,
        quran_refs,
      };
    });
  } finally {
    await connection.end();
  }
}

/**
 * Fetch a single item by ID with translations and Quran references
 * 
 * @param id - Item ID
 * @param language - Optional language code to filter translations
 * @returns Promise with item data or null if not found
 */
export async function getItem(id: number, language?: string): Promise<ItemWithDetails | null> {
  const connection = await getConnection();
  
  try {
    const query = `
      SELECT 
        i.*,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', it.id,
              'item_id', it.item_id,
              'language_code', it.language_code,
              'label', it.label,
              'description', it.description
            )
          )
          FROM item_translations it
          WHERE it.item_id = i.id
          ${language ? 'AND it.language_code = ?' : ''}
        ) as translations_json,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', iqr.id,
              'item_id', iqr.item_id,
              'chapter', iqr.chapter,
              'start_verse', iqr.start_verse,
              'end_verse', iqr.end_verse,
              'metadata', iqr.metadata,
              'created_at', iqr.created_at,
              'updated_at', iqr.updated_at
            )
          )
          FROM item_quran_refs iqr
          WHERE iqr.item_id = i.id
          ORDER BY iqr.chapter, iqr.start_verse
        ) as quran_refs_json
      FROM items i
      WHERE i.id = ?
    `;
    
    const params = language ? [language, id] : [id];
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    const translationsJson = row.translations_json;
    const quranRefsJson = row.quran_refs_json;
    
    let translations: ItemTranslation[] = [];
    let quran_refs: ItemQuranRef[] = [];
    
    if (translationsJson && translationsJson !== 'null') {
      const parsed = typeof translationsJson === 'string' 
        ? JSON.parse(translationsJson) 
        : translationsJson;
      // Filter out null entries
      translations = parsed.filter((t: ItemTranslation | null) => t && t.id !== null);
    }
    
    if (quranRefsJson && quranRefsJson !== 'null') {
      const parsed = typeof quranRefsJson === 'string' 
        ? JSON.parse(quranRefsJson) 
        : quranRefsJson;
      // Filter out null entries
      quran_refs = parsed.filter((r: ItemQuranRef | null) => r && r.id !== null);
    }
    
    return {
      id: row.id,
      category_id: row.category_id,
      subcategory_id: row.subcategory_id,
      slug: row.slug,
      sort_order: row.sort_order,
      translations,
      quran_refs,
    };
  } finally {
    await connection.end();
  }
}

