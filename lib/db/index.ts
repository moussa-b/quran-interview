/**
 * Database utilities
 * 
 * This module provides database connection utilities for MySQL and SQLite.
 */

export {
  checkDatabaseConnection,
  getConnection,
} from './connection';

export type {
  DatabaseConnection,
  DatabaseAdapter,
  DatabaseRow,
  DatabaseType,
  QueryResult,
} from './types';

export {
  createDatabaseAdapter,
  getDatabaseType,
} from './factory';

export {
  jsonObject,
  jsonArrayAgg,
  jsonArrayAggObject,
} from './query-builder';

