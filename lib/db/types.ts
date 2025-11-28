/**
 * Database abstraction types
 * 
 * This module defines the unified interface for database operations
 * that works with both MySQL and SQLite.
 */

/**
 * Result row from a database query
 */
export type DatabaseRow = Record<string, unknown>;

/**
 * Query result from execute operation
 * Returns an array of rows and metadata
 */
export type QueryResult = [DatabaseRow[], unknown];

/**
 * Database connection interface
 * Abstracts the connection lifecycle and query execution
 */
export interface DatabaseConnection {
  /**
   * Execute a SQL query with parameters
   * 
   * @param query - SQL query string
   * @param params - Query parameters
   * @returns Promise that resolves to [rows, metadata] tuple
   */
  execute<T extends DatabaseRow = DatabaseRow>(
    query: string,
    params?: unknown[]
  ): Promise<[T[], unknown]>;

  /**
   * Ping the database to check connectivity
   * 
   * @returns Promise that resolves when ping is successful
   */
  ping(): Promise<void>;

  /**
   * Close the database connection
   * 
   * @returns Promise that resolves when connection is closed
   */
  end(): Promise<void>;
}

/**
 * Database adapter interface
 * Factory for creating database connections
 */
export interface DatabaseAdapter {
  /**
   * Create a new database connection
   * 
   * @returns Promise that resolves to a database connection
   */
  createConnection(): Promise<DatabaseConnection>;

  /**
   * Check database connection health
   * 
   * @returns Promise that resolves to true if connection is successful
   */
  checkConnection(): Promise<boolean>;
}

/**
 * Database type enumeration
 */
export type DatabaseType = 'mysql' | 'sqlite';

