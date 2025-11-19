/**
 * Categories Service
 * 
 * This module provides functions for working with categories.
 * 
 * @example
 * ```typescript
 * import { getCategories, getCategory } from '@/lib/api/services/categories';
 * 
 * const categories = await getCategories(1, 'en'); // Categories for topic 1
 * const category = await getCategory(1, 'en');
 * ```
 */

// Export service functions
export {
  getCategories,
  getCategory,
} from './service';

// Re-export relevant types
export type {
  Category,
  CategoryTranslation,
  CategoryWithTranslations,
  CategoriesResponse,
  CategoryResponse,
} from '../types';

