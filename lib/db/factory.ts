import type { DatabaseAdapter } from './types';
import { MySQLAdapter } from './adapters/mysql-adapter';
import { SQLiteAdapter } from './adapters/sqlite-adapter';
import type mysql from 'mysql2/promise';

/**
 * Get database configuration from environment variables
 */
function getDatabaseConfig(): {
  type: 'mysql' | 'sqlite';
  mysqlConfig?: mysql.ConnectionOptions;
  sqlitePath?: string;
} {
  const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase() as 'mysql' | 'sqlite';

  if (dbType === 'mysql') {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3308', 10);
    const user = process.env.DB_USER || 'nextjs';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'quran';

    if (!password && process.env.NODE_ENV === 'production') {
      console.warn('Warning: DB_PASSWORD is not set in production environment');
    }

    return {
      type: 'mysql',
      mysqlConfig: {
        host,
        port,
        user,
        password,
        database,
      },
    };
  } else {
    // SQLite: use DB_PATH if set, otherwise fallback to DB_NAME as file path
    const dbPath = process.env.DB_PATH || process.env.DB_NAME || './quran.db';

    return {
      type: 'sqlite',
      sqlitePath: dbPath,
    };
  }
}

/**
 * Create a database adapter based on environment configuration
 * 
 * @returns Database adapter instance
 */
export function createDatabaseAdapter(): DatabaseAdapter {
  const config = getDatabaseConfig();

  if (config.type === 'mysql' && config.mysqlConfig) {
    return new MySQLAdapter(config.mysqlConfig);
  } else if (config.type === 'sqlite' && config.sqlitePath) {
    return new SQLiteAdapter(config.sqlitePath);
  } else {
    throw new Error(
      `Invalid database configuration: type=${config.type}, mysqlConfig=${!!config.mysqlConfig}, sqlitePath=${!!config.sqlitePath}`
    );
  }
}

/**
 * Get the current database type from environment
 * 
 * @returns Database type ('mysql' or 'sqlite')
 */
export function getDatabaseType(): 'mysql' | 'sqlite' {
  return (process.env.DB_TYPE || 'sqlite').toLowerCase() as 'mysql' | 'sqlite';
}

