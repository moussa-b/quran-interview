/**
 * Items Service
 * 
 * This module provides functions for working with items and their Quran references.
 * 
 * @example
 * ```typescript
 * import { getItems, getItem } from '@/lib/api/services/items';
 * 
 * const items = await getItems(undefined, 1, 'en'); // Items for subcategory 1
 * const item = await getItem(1, 'en');
 * ```
 */

// Export service functions
export {
  getItems,
  getItem,
  searchItems,
} from './service';

// Re-export relevant types
export type {
  Item,
  ItemTranslation,
  ItemQuranRef,
  ItemWithDetails,
  ItemsResponse,
  ItemResponse,
} from '../types';

