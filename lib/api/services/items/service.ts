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
    // Build items query based on filters
    let itemQuery = 'SELECT * FROM items';
    const itemParams: unknown[] = [];
    
    if (categoryId !== undefined) {
      itemQuery += ' WHERE category_id = ?';
      itemParams.push(categoryId);
    } else if (subcategoryId !== undefined) {
      itemQuery += ' WHERE subcategory_id = ?';
      itemParams.push(subcategoryId);
    }
    
    itemQuery += ' ORDER BY sort_order ASC';
    
    const [itemsRows] = await connection.execute<RowDataPacket[]>(
      itemQuery,
      itemParams
    );
    const items = itemsRows as Item[];

    // Get item IDs for related queries
    const itemIds = items.map(i => i.id);
    if (itemIds.length === 0) {
      return [];
    }

    // Fetch translations
    const translationQuery = language
      ? `SELECT * FROM item_translations WHERE item_id IN (?) AND language_code = ? ORDER BY item_id`
      : `SELECT * FROM item_translations WHERE item_id IN (?) ORDER BY item_id`;
    
    const translationParams = language ? [itemIds, language] : [itemIds];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as ItemTranslation[];

    // Fetch Quran references
    const [refsRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM item_quran_refs WHERE item_id IN (?) ORDER BY item_id, chapter, start_verse',
      [itemIds]
    );
    const refs = refsRows as ItemQuranRef[];

    // Group translations and refs by item_id
    const translationsMap = new Map<number, ItemTranslation[]>();
    translations.forEach(trans => {
      if (!translationsMap.has(trans.item_id)) {
        translationsMap.set(trans.item_id, []);
      }
      translationsMap.get(trans.item_id)!.push(trans);
    });

    const refsMap = new Map<number, ItemQuranRef[]>();
    refs.forEach(ref => {
      if (!refsMap.has(ref.item_id)) {
        refsMap.set(ref.item_id, []);
      }
      refsMap.get(ref.item_id)!.push(ref);
    });

    // Combine items with translations and refs
    return items.map(item => ({
      ...item,
      translations: translationsMap.get(item.id) || [],
      quran_refs: refsMap.get(item.id) || [],
    }));
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
    // Fetch item
    const [itemsRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM items WHERE id = ?',
      [id]
    );
    const items = itemsRows as Item[];
    
    if (items.length === 0) {
      return null;
    }
    const item = items[0];

    // Fetch translations
    const translationQuery = language
      ? 'SELECT * FROM item_translations WHERE item_id = ? AND language_code = ?'
      : 'SELECT * FROM item_translations WHERE item_id = ?';
    
    const translationParams = language ? [id, language] : [id];
    const [translationsRows] = await connection.execute<RowDataPacket[]>(
      translationQuery,
      translationParams
    );
    const translations = translationsRows as ItemTranslation[];

    // Fetch Quran references
    const [refsRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM item_quran_refs WHERE item_id = ? ORDER BY chapter, start_verse',
      [id]
    );
    const quran_refs = refsRows as ItemQuranRef[];

    return {
      ...item,
      translations,
      quran_refs,
    };
  } finally {
    await connection.end();
  }
}

