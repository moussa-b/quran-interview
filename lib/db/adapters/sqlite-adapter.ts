import Database from 'better-sqlite3';
import * as fs from 'fs';
import type { DatabaseAdapter, DatabaseConnection, DatabaseRow } from '../types';

/**
 * SQLite database connection wrapper
 */
class SQLiteConnection implements DatabaseConnection {
  constructor(private db: Database.Database) {}

  async execute<T extends DatabaseRow = DatabaseRow>(
    query: string,
    params?: unknown[]
  ): Promise<[T[], unknown]> {
    try {
      const stmt = this.db.prepare(query);
      const rows = params ? (stmt.all(...params) as T[]) : (stmt.all() as T[]);
      // SQLite doesn't provide metadata like MySQL, so we return empty object
      return [rows, {}];
    } catch (error) {
      throw new Error(`SQLite query execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async ping(): Promise<void> {
    // SQLite doesn't have a ping method, so we execute a simple query
    this.db.prepare('SELECT 1').get();
  }

  async end(): Promise<void> {
    this.db.close();
  }
}

/**
 * SQLite database adapter
 */
export class SQLiteAdapter implements DatabaseAdapter {
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  async createConnection(): Promise<DatabaseConnection> {
    console.log(`[SQLite] Creating connection to path: ${this.dbPath}`);
    const fileExists = fs.existsSync(this.dbPath);
    console.log(`[SQLite] File exists: ${fileExists}`);
    
    if (!fileExists) {
      console.warn(`[SQLite] Warning: Database file does not exist at ${this.dbPath}`);
    }
    
    try {
      const db = new Database(this.dbPath);
      // Enable foreign keys
      db.pragma('foreign_keys = ON');
      console.log(`[SQLite] Connection established successfully`);
      return new SQLiteConnection(db);
    } catch (error) {
      throw new Error(
        `Failed to create SQLite connection to ${this.dbPath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async checkConnection(): Promise<boolean> {
    console.log(`[SQLite] Checking connection to path: ${this.dbPath}`);
    const fileExists = fs.existsSync(this.dbPath);
    console.log(`[SQLite] File exists: ${fileExists}`);
    
    let db: Database.Database | null = null;

    try {
      db = new Database(this.dbPath);
      // Test the connection with a simple query
      db.prepare('SELECT 1').get();
      console.log(`[SQLite] Connection check successful`);
      return true;
    } catch (error) {
      console.error(`[SQLite] Connection check failed:`, error);
      return false;
    } finally {
      if (db) {
        try {
          db.close();
        } catch (closeError) {
          // Ignore errors when closing
          console.error('Error closing database connection:', closeError);
        }
      }
    }
  }
}

