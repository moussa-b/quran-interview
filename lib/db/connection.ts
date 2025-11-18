import mysql from 'mysql2/promise';

/**
 * Database configuration from environment variables
 */
interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/**
 * Get database configuration from environment variables
 */
function getDatabaseConfig(): DatabaseConfig {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3308', 10);
  const user = process.env.DB_USER || 'nextjs';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'quran';

  if (!password && process.env.NODE_ENV === 'production') {
    console.warn('Warning: DB_PASSWORD is not set in production environment');
  }

  return {
    host,
    port,
    user,
    password,
    database,
  };
}

/**
 * Check database connection health
 * 
 * @returns Promise that resolves to true if connection is successful, false otherwise
 * @throws Error with connection details if connection fails
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  const config = getDatabaseConfig();
  let connection: mysql.Connection | null = null;

  try {
    // Create a connection with a timeout
    connection = await mysql.createConnection({
      ...config,
      connectTimeout: 5000, // 5 second timeout
    });

    // Test the connection with a simple query
    await connection.ping();

    return true;
  } catch (error) {
    const err = error as Error;
    throw new Error(
      `Database connection failed: ${err.message || 'Unknown error'}`
    );
  } finally {
    // Always close the connection
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        // Ignore errors when closing
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}

/**
 * Get a database connection for queries
 * Note: Caller is responsible for closing the connection
 * 
 * @returns Promise that resolves to a mysql connection
 */
export async function getConnection(): Promise<mysql.Connection> {
  const config = getDatabaseConfig();
  
  return mysql.createConnection({
    ...config,
    connectTimeout: 5000,
  });
}

