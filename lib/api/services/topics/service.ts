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
    // Fetch topics
    const [topicsRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM topics ORDER BY sort_order ASC'
    );
    const topics = topicsRows as Topic[];

    // Fetch translations
    const translationQuery = language
      ? 'SELECT * FROM topic_translations WHERE language_code = ? ORDER BY topic_id'
      : 'SELECT * FROM topic_translations ORDER BY topic_id';
    
    const translationParams = language ? [language] : [];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as TopicTranslation[];

    // Group translations by topic_id
    const translationsMap = new Map<number, TopicTranslation[]>();
    translations.forEach(trans => {
      if (!translationsMap.has(trans.topic_id)) {
        translationsMap.set(trans.topic_id, []);
      }
      translationsMap.get(trans.topic_id)!.push(trans);
    });

    // Combine topics with translations
    return topics.map(topic => ({
      ...topic,
      translations: translationsMap.get(topic.id) || [],
    }));
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
    // Fetch topic
    const [topicsRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM topics WHERE id = ?',
      [id]
    );
    const topics = topicsRows as Topic[];
    
    if (topics.length === 0) {
      return null;
    }
    const topic = topics[0];

    // Fetch translations
    const translationQuery = language
      ? 'SELECT * FROM topic_translations WHERE topic_id = ? AND language_code = ?'
      : 'SELECT * FROM topic_translations WHERE topic_id = ?';
    
    const translationParams = language ? [id, language] : [id];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as TopicTranslation[];

    return {
      ...topic,
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
    // Fetch topic
    const [topicsRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM topics WHERE slug = ?',
      [slug]
    );
    const topics = topicsRows as Topic[];
    
    if (topics.length === 0) {
      return null;
    }
    const topic = topics[0];

    // Fetch translations
    const translationQuery = language
      ? 'SELECT * FROM topic_translations WHERE topic_id = ? AND language_code = ?'
      : 'SELECT * FROM topic_translations WHERE topic_id = ?';
    
    const translationParams = language ? [topic.id, language] : [topic.id];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as TopicTranslation[];

    return {
      ...topic,
      translations,
    };
  } finally {
    await connection.end();
  }
}
