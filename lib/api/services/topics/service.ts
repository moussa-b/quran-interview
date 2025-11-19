import { getConnection } from '@/lib/db/connection';
import type { RowDataPacket } from 'mysql2/promise';
import {
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
          ) as translations_json
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
          ) as translations_json
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
          ) as translations_json
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
          ) as translations_json
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
          ) as translations_json
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
          ) as translations_json
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
    };
  } finally {
    await connection.end();
  }
}
