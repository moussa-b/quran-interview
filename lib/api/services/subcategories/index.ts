/**
 * Subcategories Service
 * 
 * This module provides functions for working with subcategories.
 * 
 * @example
 * ```typescript
 * import { getSubcategories, getSubcategory } from '@/lib/api/services/subcategories';
 * 
 * const subcategories = await getSubcategories(1, 'en'); // Subcategories for category 1
 * const subcategory = await getSubcategory(1, 'en');
 * ```
 */

// Export service functions
export {
  getSubcategories,
  getSubcategory,
} from './service';

// Re-export relevant types
export type {
  Subcategory,
  SubcategoryTranslation,
  SubcategoryWithTranslations,
  SubcategoriesResponse,
  SubcategoryResponse,
} from '../types';

