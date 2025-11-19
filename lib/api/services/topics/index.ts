/**
 * Topics Service
 * 
 * This module provides functions for working with topics.
 * 
 * @example
 * ```typescript
 * import { getTopics, getTopicById, getTopicBySlug } from '@/lib/api/services/topics';
 * 
 * const topics = await getTopics('en');
 * const topic = await getTopicById(1, 'en');
 * const topicBySlug = await getTopicBySlug('beliefs', 'fr');
 * ```
 */

// Export service functions
export {
  getTopics,
  getTopicById,
  getTopicBySlug,
} from './service';

// Re-export relevant types
export type {
  Topic,
  TopicTranslation,
  TopicWithTranslations,
  TopicsResponse,
  TopicResponse,
} from '../types';
