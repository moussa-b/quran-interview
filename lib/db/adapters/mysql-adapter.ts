import mysql from 'mysql2/promise';
import type { DatabaseAdapter, DatabaseConnection, DatabaseRow } from '../types';

/**
 * MySQL database connection wrapper
 */
class MySQLConnection implements DatabaseConnection {
  constructor(private connection: mysql.Connection) {}

  async execute<T extends DatabaseRow = DatabaseRow>(
    query: string,
    params?: unknown[]
  ): Promise<[T[], unknown]> {
    const [result, fields] = await this.connection.execute(query, params);
    
    // MySQL execute returns RowDataPacket[] for SELECT queries
    // or ResultSetHeader/OkPacket for INSERT/UPDATE/DELETE
    // We need to normalize to T[] for SELECT queries
    const rows = Array.isArray(result) ? (result as T[]) : [];
    return [rows, fields];
  }

  async ping(): Promise<void> {
    await this.connection.ping();
  }

  async end(): Promise<void> {
    await this.connection.end();
  }
}

/**
 * MySQL database adapter
 */
export class MySQLAdapter implements DatabaseAdapter {
  private config: mysql.ConnectionOptions;

  constructor(config: mysql.ConnectionOptions) {
    this.config = {
      ...config,
      connectTimeout: 5000,
    };
  }

  async createConnection(): Promise<DatabaseConnection> {
    const connection = await mysql.createConnection(this.config);
    return new MySQLConnection(connection);
  }

  async checkConnection(): Promise<boolean> {
    let connection: mysql.Connection | null = null;

    try {
      connection = await mysql.createConnection({
        ...this.config,
        connectTimeout: 5000,
      });

      await connection.ping();
      return true;
    } catch (error) {
      return false;
    } finally {
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
}

