import { getConnection } from '@/lib/db/connection';
import type { RowDataPacket } from 'mysql2/promise';
import {
  ItemWithDetails,
  Topic,
  TopicTranslation,
  TopicWithTranslations,
} from '../types';

/**
 * Fetch all topics with their translations
 * 
 * @param language - Optional language code to filter translations
 * @returns Promise with array of topics
 */
export async function getTopics(language?: string): Promise<TopicWithTranslations[]> {
  const connection = await getConnection();
  
  try {
    const query = language
      ? `
        SELECT 
          t.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', tt.id,
              'topic_id', tt.topic_id,
              'language_code', tt.language_code,
              'label', tt.label,
              'description', tt.description
            )
          ) as translations_json,
          (SELECT COUNT(*) FROM categories c WHERE c.topic_id = t.id) as categories_count,
          (SELECT COUNT(*) FROM subcategories s 
           INNER JOIN categories c ON s.category_id = c.id 
           WHERE c.topic_id = t.id) as subcategories_count,
          (SELECT COUNT(DISTINCT iqr.chapter) FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as chapters_count,
          (SELECT COUNT(DISTINCT CONCAT(iqr.chapter, '-', iqr.start_verse, '-', COALESCE(iqr.end_verse, iqr.start_verse))) 
           FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as verses_count
        FROM topics t
        LEFT JOIN topic_translations tt ON tt.topic_id = t.id AND tt.language_code = ?
        GROUP BY t.id
        ORDER BY t.sort_order ASC
      `
      : `
        SELECT 
          t.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', tt.id,
              'topic_id', tt.topic_id,
              'language_code', tt.language_code,
              'label', tt.label,
              'description', tt.description
            )
          ) as translations_json,
          (SELECT COUNT(*) FROM categories c WHERE c.topic_id = t.id) as categories_count,
          (SELECT COUNT(*) FROM subcategories s 
           INNER JOIN categories c ON s.category_id = c.id 
           WHERE c.topic_id = t.id) as subcategories_count,
          (SELECT COUNT(DISTINCT iqr.chapter) FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as chapters_count,
          (SELECT COUNT(DISTINCT CONCAT(iqr.chapter, '-', iqr.start_verse, '-', COALESCE(iqr.end_verse, iqr.start_verse))) 
           FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as verses_count
        FROM topics t
        LEFT JOIN topic_translations tt ON tt.topic_id = t.id
        GROUP BY t.id
        ORDER BY t.sort_order ASC
      `;
    
    const params = language ? [language] : [];
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    // Parse JSON and construct results
    return rows.map(row => {
      const translationsJson = row.translations_json;
      let translations: TopicTranslation[] = [];
      
      if (translationsJson && translationsJson !== 'null') {
        const parsed = typeof translationsJson === 'string' 
          ? JSON.parse(translationsJson) 
          : translationsJson;
        // Filter out null entries (from LEFT JOIN with no match)
        translations = parsed.filter((t: TopicTranslation | null) => t && t.id !== null);
      }
      
      return {
        id: row.id,
        slug: row.slug,
        sort_order: row.sort_order,
        translations,
        categories_count: Number(row.categories_count) || 0,
        subcategories_count: Number(row.subcategories_count) || 0,
        chapters_count: Number(row.chapters_count) || 0,
        verses_count: Number(row.verses_count) || 0,
      };
    });
  } finally {
    await connection.end();
  }
}

/**
 * Fetch a single topic by ID with translations
 * 
 * @param id - Topic ID
 * @param language - Optional language code to filter translations
 * @returns Promise with topic data or null if not found
 */
export async function getTopicById(id: number, language?: string): Promise<TopicWithTranslations | null> {
  const connection = await getConnection();
  
  try {
    const query = language
      ? `
        SELECT 
          t.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', tt.id,
              'topic_id', tt.topic_id,
              'language_code', tt.language_code,
              'label', tt.label,
              'description', tt.description
            )
          ) as translations_json,
          (SELECT COUNT(*) FROM categories c WHERE c.topic_id = t.id) as categories_count,
          (SELECT COUNT(*) FROM subcategories s 
           INNER JOIN categories c ON s.category_id = c.id 
           WHERE c.topic_id = t.id) as subcategories_count,
          (SELECT COUNT(DISTINCT iqr.chapter) FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as chapters_count,
          (SELECT COUNT(DISTINCT CONCAT(iqr.chapter, '-', iqr.start_verse, '-', COALESCE(iqr.end_verse, iqr.start_verse))) 
           FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as verses_count
        FROM topics t
        LEFT JOIN topic_translations tt ON tt.topic_id = t.id AND tt.language_code = ?
        WHERE t.id = ?
        GROUP BY t.id
      `
      : `
        SELECT 
          t.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', tt.id,
              'topic_id', tt.topic_id,
              'language_code', tt.language_code,
              'label', tt.label,
              'description', tt.description
            )
          ) as translations_json,
          (SELECT COUNT(*) FROM categories c WHERE c.topic_id = t.id) as categories_count,
          (SELECT COUNT(*) FROM subcategories s 
           INNER JOIN categories c ON s.category_id = c.id 
           WHERE c.topic_id = t.id) as subcategories_count,
          (SELECT COUNT(DISTINCT iqr.chapter) FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as chapters_count,
          (SELECT COUNT(DISTINCT CONCAT(iqr.chapter, '-', iqr.start_verse, '-', COALESCE(iqr.end_verse, iqr.start_verse))) 
           FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as verses_count
        FROM topics t
        LEFT JOIN topic_translations tt ON tt.topic_id = t.id
        WHERE t.id = ?
        GROUP BY t.id
      `;
    
    const params = language ? [language, id] : [id];
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    const translationsJson = row.translations_json;
    let translations: TopicTranslation[] = [];
    
    if (translationsJson && translationsJson !== 'null') {
      const parsed = typeof translationsJson === 'string' 
        ? JSON.parse(translationsJson) 
        : translationsJson;
      // Filter out null entries (from LEFT JOIN with no match)
      translations = parsed.filter((t: TopicTranslation | null) => t && t.id !== null);
    }
    
    return {
      id: row.id,
      slug: row.slug,
      sort_order: row.sort_order,
      translations,
      categories_count: Number(row.categories_count) || 0,
      subcategories_count: Number(row.subcategories_count) || 0,
      chapters_count: Number(row.chapters_count) || 0,
      verses_count: Number(row.verses_count) || 0,
    };
  } finally {
    await connection.end();
  }
}

/**
 * Fetch a single topic by slug with translations
 * 
 * @param slug - Topic slug
 * @param language - Optional language code to filter translations
 * @returns Promise with topic data or null if not found
 */
export async function getTopicBySlug(slug: string, language?: string): Promise<TopicWithTranslations | null> {
  const connection = await getConnection();
  
  try {
    const query = language
      ? `
        SELECT 
          t.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', tt.id,
              'topic_id', tt.topic_id,
              'language_code', tt.language_code,
              'label', tt.label,
              'description', tt.description
            )
          ) as translations_json,
          (SELECT COUNT(*) FROM categories c WHERE c.topic_id = t.id) as categories_count,
          (SELECT COUNT(*) FROM subcategories s 
           INNER JOIN categories c ON s.category_id = c.id 
           WHERE c.topic_id = t.id) as subcategories_count,
          (SELECT COUNT(DISTINCT iqr.chapter) FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as chapters_count,
          (SELECT COUNT(DISTINCT CONCAT(iqr.chapter, '-', iqr.start_verse, '-', COALESCE(iqr.end_verse, iqr.start_verse))) 
           FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as verses_count
        FROM topics t
        LEFT JOIN topic_translations tt ON tt.topic_id = t.id AND tt.language_code = ?
        WHERE t.slug = ?
        GROUP BY t.id
      `
      : `
        SELECT 
          t.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', tt.id,
              'topic_id', tt.topic_id,
              'language_code', tt.language_code,
              'label', tt.label,
              'description', tt.description
            )
          ) as translations_json,
          (SELECT COUNT(*) FROM categories c WHERE c.topic_id = t.id) as categories_count,
          (SELECT COUNT(*) FROM subcategories s 
           INNER JOIN categories c ON s.category_id = c.id 
           WHERE c.topic_id = t.id) as subcategories_count,
          (SELECT COUNT(DISTINCT iqr.chapter) FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as chapters_count,
          (SELECT COUNT(DISTINCT CONCAT(iqr.chapter, '-', iqr.start_verse, '-', COALESCE(iqr.end_verse, iqr.start_verse))) 
           FROM item_quran_refs iqr
           INNER JOIN items i ON iqr.item_id = i.id
           LEFT JOIN categories c ON i.category_id = c.id
           LEFT JOIN subcategories s ON i.subcategory_id = s.id
           LEFT JOIN categories c2 ON s.category_id = c2.id
           WHERE (c.topic_id = t.id OR c2.topic_id = t.id)) as verses_count
        FROM topics t
        LEFT JOIN topic_translations tt ON tt.topic_id = t.id
        WHERE t.slug = ?
        GROUP BY t.id
      `;
    
    const params = language ? [language, slug] : [slug];
    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    const translationsJson = row.translations_json;
    let translations: TopicTranslation[] = [];
    
    if (translationsJson && translationsJson !== 'null') {
      const parsed = typeof translationsJson === 'string' 
        ? JSON.parse(translationsJson) 
        : translationsJson;
      // Filter out null entries (from LEFT JOIN with no match)
      translations = parsed.filter((t: TopicTranslation | null) => t && t.id !== null);
    }
    
    return {
      id: row.id,
      slug: row.slug,
      sort_order: row.sort_order,
      translations,
      categories_count: Number(row.categories_count) || 0,
      subcategories_count: Number(row.subcategories_count) || 0,
      chapters_count: Number(row.chapters_count) || 0,
      verses_count: Number(row.verses_count) || 0,
    };
  } finally {
    await connection.end();
  }
}

/**
 * Search items by query string
 * Currently returns an empty list (placeholder implementation).
 *
 * @param query - User provided search text
 * @param language - Optional language for filtering translations
 */
export async function searchTopics(query: string, language?: string): Promise<ItemWithDetails[]> {
  void query;
  void language;
  return [];
}
