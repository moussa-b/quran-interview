/**
 * Query builder utilities for database-agnostic SQL generation
 * 
 * Handles differences between MySQL and SQLite SQL dialects,
 * particularly for JSON aggregation functions.
 */

import { getDatabaseType } from './factory';

/**
 * Build JSON_OBJECT equivalent for the current database type
 * 
 * MySQL: JSON_OBJECT(key1, value1, key2, value2, ...)
 * SQLite: json_object(key1, value1, key2, value2, ...)
 * 
 * @param pairs - Array of [key, value] pairs
 * @returns SQL fragment for JSON object creation
 */
export function jsonObject(pairs: Array<[string, string]>): string {
  const dbType = getDatabaseType();
  const functionName = dbType === 'mysql' ? 'JSON_OBJECT' : 'json_object';
  
  const args = pairs.map(([key, value]) => `'${key}', ${value}`).join(', ');
  return `${functionName}(${args})`;
}

/**
 * Build JSON_ARRAYAGG equivalent for the current database type
 * 
 * MySQL: JSON_ARRAYAGG(expression)
 * SQLite: json_group_array(expression)
 * 
 * @param expression - SQL expression to aggregate
 * @returns SQL fragment for JSON array aggregation
 */
export function jsonArrayAgg(expression: string): string {
  const dbType = getDatabaseType();
  const functionName = dbType === 'mysql' ? 'JSON_ARRAYAGG' : 'json_group_array';
  
  return `${functionName}(${expression})`;
}

/**
 * Build a complete JSON aggregation query pattern
 * 
 * This is a convenience function that combines jsonObject and jsonArrayAgg
 * for the common pattern of aggregating JSON objects into an array.
 * 
 * @param objectPairs - Array of [key, value] pairs for the JSON object
 * @returns SQL fragment for aggregated JSON array of objects
 */
export function jsonArrayAggObject(objectPairs: Array<[string, string]>): string {
  return jsonArrayAgg(jsonObject(objectPairs));
}

