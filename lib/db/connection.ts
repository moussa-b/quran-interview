import { createDatabaseAdapter } from './factory';
import type { DatabaseConnection } from './types';

// Cache the adapter instance to avoid recreating it on every call
let adapterInstance: ReturnType<typeof createDatabaseAdapter> | null = null;

/**
 * Get the database adapter instance (singleton pattern)
 */
function getAdapter() {
  if (!adapterInstance) {
    adapterInstance = createDatabaseAdapter();
  }
  return adapterInstance;
}

/**
 * Check database connection health
 * 
 * @returns Promise that resolves to true if connection is successful, false otherwise
 * @throws Error with connection details if connection fails
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  const adapter = getAdapter();

  try {
    const isHealthy = await adapter.checkConnection();
    if (!isHealthy) {
      throw new Error('Database connection check returned false');
    }
    return true;
  } catch (error) {
    const err = error as Error;
    throw new Error(
      `Database connection failed: ${err.message || 'Unknown error'}`
    );
  }
}

/**
 * Get a database connection for queries
 * Note: Caller is responsible for closing the connection
 * 
 * @returns Promise that resolves to a database connection
 */
export async function getConnection(): Promise<DatabaseConnection> {
  const adapter = getAdapter();
  return adapter.createConnection();
}

