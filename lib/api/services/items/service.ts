import { getConnection } from '@/lib/db/connection';
import { jsonArrayAggObject } from '@/lib/db/query-builder';
import type { DatabaseRow } from '@/lib/db/types';
import {
  CategoryTranslation,
  ItemQuranRef,
  ItemSearchResultWithDetails,
  ItemTranslation,
  ItemWithDetails,
  SubcategoryTranslation,
  TopicTranslation,
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
    const translationsJsonQuery = jsonArrayAggObject([
      ['id', 'it.id'],
      ['item_id', 'it.item_id'],
      ['language_code', 'it.language_code'],
      ['label', 'it.label'],
      ['description', 'it.description'],
    ]);
    
    const quranRefsJsonQuery = jsonArrayAggObject([
      ['id', 'iqr.id'],
      ['item_id', 'iqr.item_id'],
      ['chapter', 'iqr.chapter'],
      ['start_verse', 'iqr.start_verse'],
      ['end_verse', 'iqr.end_verse'],
      ['metadata', 'iqr.metadata'],
      ['created_at', 'iqr.created_at'],
      ['updated_at', 'iqr.updated_at'],
    ]);
    
    // Build base query with subqueries for translations and refs
    let query = `
      SELECT 
        i.*,
        (
          SELECT ${translationsJsonQuery}
          FROM item_translations it
          WHERE it.item_id = i.id
          ${language ? 'AND it.language_code = ?' : ''}
        ) as translations_json,
        (
          SELECT ${quranRefsJsonQuery}
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
    
    const [rows] = await connection.execute<DatabaseRow>(query, params);
    
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
        id: Number(row.id),
        category_id: row.category_id !== null ? Number(row.category_id) : null,
        subcategory_id: row.subcategory_id !== null ? Number(row.subcategory_id) : null,
        slug: String(row.slug),
        sort_order: Number(row.sort_order),
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
    const translationsJsonQuery = jsonArrayAggObject([
      ['id', 'it.id'],
      ['item_id', 'it.item_id'],
      ['language_code', 'it.language_code'],
      ['label', 'it.label'],
      ['description', 'it.description'],
    ]);
    
    const quranRefsJsonQuery = jsonArrayAggObject([
      ['id', 'iqr.id'],
      ['item_id', 'iqr.item_id'],
      ['chapter', 'iqr.chapter'],
      ['start_verse', 'iqr.start_verse'],
      ['end_verse', 'iqr.end_verse'],
      ['metadata', 'iqr.metadata'],
      ['created_at', 'iqr.created_at'],
      ['updated_at', 'iqr.updated_at'],
    ]);
    
    const query = `
      SELECT 
        i.*,
        (
          SELECT ${translationsJsonQuery}
          FROM item_translations it
          WHERE it.item_id = i.id
          ${language ? 'AND it.language_code = ?' : ''}
        ) as translations_json,
        (
          SELECT ${quranRefsJsonQuery}
          FROM item_quran_refs iqr
          WHERE iqr.item_id = i.id
          ORDER BY iqr.chapter, iqr.start_verse
        ) as quran_refs_json
      FROM items i
      WHERE i.id = ?
    `;
    
    const params = language ? [language, id] : [id];
    const [rows] = await connection.execute<DatabaseRow>(query, params);
    
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
      id: Number(row.id),
      category_id: row.category_id !== null ? Number(row.category_id) : null,
      subcategory_id: row.subcategory_id !== null ? Number(row.subcategory_id) : null,
      slug: String(row.slug),
      sort_order: Number(row.sort_order),
      translations,
      quran_refs,
    };
  } finally {
    await connection.end();
  }
}

/**
 * Search items by their translated label.
 *
 * @param query - Free text search term
 * @param language - Optional language code to filter translations
 */
export async function searchItems(
  query: string,
  language?: string
): Promise<ItemSearchResultWithDetails[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const connection = await getConnection();

  try {
    const itemTranslationsJsonQuery = jsonArrayAggObject([
      ['id', 'it.id'],
      ['item_id', 'it.item_id'],
      ['language_code', 'it.language_code'],
      ['label', 'it.label'],
      ['description', 'it.description'],
    ]);
    
    const quranRefsJsonQuery = jsonArrayAggObject([
      ['id', 'iqr.id'],
      ['item_id', 'iqr.item_id'],
      ['chapter', 'iqr.chapter'],
      ['start_verse', 'iqr.start_verse'],
      ['end_verse', 'iqr.end_verse'],
      ['metadata', 'iqr.metadata'],
      ['created_at', 'iqr.created_at'],
      ['updated_at', 'iqr.updated_at'],
    ]);
    
    const categoryTranslationsJsonQuery = jsonArrayAggObject([
      ['id', 'ct.id'],
      ['category_id', 'ct.category_id'],
      ['language_code', 'ct.language_code'],
      ['label', 'ct.label'],
      ['description', 'ct.description'],
    ]);
    
    const subcategoryTranslationsJsonQuery = jsonArrayAggObject([
      ['id', 'sct.id'],
      ['subcategory_id', 'sct.subcategory_id'],
      ['language_code', 'sct.language_code'],
      ['label', 'sct.label'],
      ['description', 'sct.description'],
    ]);
    
    const topicTranslationsJsonQuery = jsonArrayAggObject([
      ['id', 'tt.id'],
      ['topic_id', 'tt.topic_id'],
      ['language_code', 'tt.language_code'],
      ['label', 'tt.label'],
      ['description', 'tt.description'],
    ]);
    
    const likeQuery = `%${trimmed}%`;
    const params: unknown[] = [];

    if (language) {
      params.push(language);
    }

    if (language) {
      params.push(language);
    }

    if (language) {
      params.push(language);
    }

    if (language) {
      params.push(language);
    }

    params.push(likeQuery);

    if (language) {
      params.push(language);
    }

    const searchQuery = `
      SELECT 
        i.*,
        (
          SELECT ${itemTranslationsJsonQuery}
          FROM item_translations it
          WHERE it.item_id = i.id
          ${language ? 'AND it.language_code = ?' : ''}
        ) as translations_json,
        (
          SELECT ${quranRefsJsonQuery}
          FROM item_quran_refs iqr
          WHERE iqr.item_id = i.id
          ORDER BY iqr.chapter, iqr.start_verse
        ) as quran_refs_json,
        COALESCE(c.id, sc.id) as resolved_category_id,
        COALESCE(c.slug, sc.slug) as resolved_category_slug,
        (
          SELECT ${categoryTranslationsJsonQuery}
          FROM category_translations ct
          WHERE ct.category_id = COALESCE(c.id, sc.id)
          ${language ? 'AND ct.language_code = ?' : ''}
        ) as category_translations_json,
        s.id as subcategory_id,
        s.slug as subcategory_slug,
        (
          SELECT ${subcategoryTranslationsJsonQuery}
          FROM subcategory_translations sct
          WHERE sct.subcategory_id = s.id
          ${language ? 'AND sct.language_code = ?' : ''}
        ) as subcategory_translations_json,
        t.id as topic_id,
        t.slug as topic_slug,
        (
          SELECT ${topicTranslationsJsonQuery}
          FROM topic_translations tt
          WHERE tt.topic_id = t.id
          ${language ? 'AND tt.language_code = ?' : ''}
        ) as topic_translations_json
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN subcategories s ON i.subcategory_id = s.id
      LEFT JOIN categories sc ON s.category_id = sc.id
      LEFT JOIN topics t ON t.id = COALESCE(c.topic_id, sc.topic_id)
      WHERE i.id IN (
        SELECT search_it.item_id
        FROM item_translations search_it
        WHERE search_it.label LIKE ?
        ${language ? 'AND search_it.language_code = ?' : ''}
      )
      ORDER BY i.sort_order ASC
    `;

    const [rows] = await connection.execute<DatabaseRow>(searchQuery, params);

    const parseJsonArray = <T extends { id: number | null }>(
      json: DatabaseRow[keyof DatabaseRow]
    ): T[] => {
      if (!json || json === 'null') {
        return [];
      }

      const parsed = typeof json === 'string' ? JSON.parse(json as string) : json;
      return Array.isArray(parsed)
        ? parsed.filter((entry: T | null) => entry && entry.id !== null)
        : [];
    };

    return rows.map(row => {
      const translations = parseJsonArray<ItemTranslation>(row.translations_json);
      const quran_refs = parseJsonArray<ItemQuranRef>(row.quran_refs_json);
      const categoryTranslations =
        parseJsonArray<CategoryTranslation>(row.category_translations_json);
      const subcategoryTranslations =
        parseJsonArray<SubcategoryTranslation>(row.subcategory_translations_json);
      const topicTranslations =
        parseJsonArray<TopicTranslation>(row.topic_translations_json);

      const resolvedCategoryId = row.resolved_category_id as number | null;
      const resolvedCategorySlug = row.resolved_category_slug as string | null;
      const subcategoryId = row.subcategory_id as number | null;
      const subcategorySlug = row.subcategory_slug as string | null;
      const topicId = row.topic_id as number | null;
      const topicSlug = row.topic_slug as string | null;

      return {
        id: Number(row.id),
        category_id: row.category_id !== null ? Number(row.category_id) : null,
        subcategory_id: row.subcategory_id !== null ? Number(row.subcategory_id) : null,
        slug: String(row.slug),
        sort_order: Number(row.sort_order),
        translations,
        quran_refs,
        category:
          resolvedCategoryId && resolvedCategorySlug
            ? {
                id: resolvedCategoryId,
                slug: resolvedCategorySlug,
                translations: categoryTranslations,
              }
            : undefined,
        subcategory:
          subcategoryId && subcategorySlug
            ? {
                id: subcategoryId,
                slug: subcategorySlug,
                translations: subcategoryTranslations,
              }
            : undefined,
        topic:
          topicId && topicSlug
            ? {
                id: topicId,
                slug: topicSlug,
                translations: topicTranslations,
              }
            : undefined,
      };
    });
  } finally {
    await connection.end();
  }
}

