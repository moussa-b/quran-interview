/**
 * API Module Index
 * 
 * This module provides convenience re-exports for:
 * - Quran Foundation API Client (external API integration)
 * - Service layer (database operations)
 * 
 * @example
 * ```typescript
 * // Quran API Client
 * import { getChapters, getChapter, getVerse } from '@/lib/api/clients/quran';
 * 
 * // Services
 * import { getTopics, getTopicById } from '@/lib/api/services/topics';
 * import { getCategories, getCategory } from '@/lib/api/services/categories';
 * import { getSubcategories, getSubcategory } from '@/lib/api/services/subcategories';
 * import { getItems, getItem } from '@/lib/api/services/items';
 * ```
 */

// Re-export Quran API Client for convenience
export * from './clients/quran';

// Re-export all services for convenience
export * from './services/topics';
export * from './services/categories';
export * from './services/subcategories';
export * from './services/items';

// Export all types
export * from './services/types';

// Export generic types
export type { ApiError } from './types';

