/**
 * IFSCFinder TypeScript SDK - Database Provider
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 */

import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { IfscDetails, SearchParams, SearchOptions } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * SQLite database provider with prepared statements and WAL mode.
 */
export class IFSCDatabase {
  private db: Database.Database;
  private lookupStmt: Database.Statement;
  private searchStmts: Map<string, Database.Statement> = new Map();

  constructor(dbPath?: string) {
    // Default to bundled database in assets/
    const resolvedPath = dbPath || join(__dirname, '../assets/ifsc.db');
    
    this.db = new Database(resolvedPath, { 
      readonly: true,
      fileMustExist: true 
    });

    // Enable WAL mode for better concurrent access (matches Python)
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = 1000'); // 1MB cache

    // Prepare lookup statement
    this.lookupStmt = this.db.prepare(
      'SELECT * FROM ifsc_codes WHERE code = ?'
    );
  }

  /**
   * Lookup IFSC code details.
   * Returns null if not found. Omits keys with null/empty values (Python parity).
   */
  lookup(ifscCode: string): IfscDetails | null {
    try {
      const row = this.lookupStmt.get(ifscCode) as Record<string, unknown> | undefined;
      
      if (!row) {
        return null;
      }

      // Filter out null/empty values and convert to uppercase keys (Python parity)
      const result: IfscDetails = {};
      for (const [key, value] of Object.entries(row)) {
        if (value != null && String(value).trim() !== '') {
          const upperKey = key.toUpperCase() as keyof IfscDetails;
          result[upperKey] = String(value).trim();
        }
      }

      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      // Database errors return null (matches Python behavior)
      return null;
    }
  }

  /**
   * Search IFSC records by bank, branch, city, or state.
   */
  search(params: SearchParams, options: SearchOptions = {}): IfscDetails[] {
    const { limit = 100, exact = true } = options;
    const whereClauses: string[] = [];
    const values: unknown[] = [];

    if (params.bank) {
      whereClauses.push(exact ? 'bank = ?' : 'bank LIKE ?');
      values.push(exact ? params.bank : `%${params.bank}%`);
    }

    if (params.branch) {
      whereClauses.push(exact ? 'branch = ?' : 'branch LIKE ?');
      values.push(exact ? params.branch : `%${params.branch}%`);
    }

    if (params.city) {
      whereClauses.push('(city1 = ? OR city2 = ?)');
      values.push(params.city, params.city);
    }

    if (params.state) {
      whereClauses.push(exact ? 'state = ?' : 'state LIKE ?');
      values.push(exact ? params.state : `%${params.state}%`);
    }

    if (whereClauses.length === 0) {
      return [];
    }

    const sql = `
      SELECT * FROM ifsc_codes 
      WHERE ${whereClauses.join(' AND ')}
      LIMIT ?
    `;
    values.push(limit);

    // Cache prepared statements per query signature
    const cacheKey = sql;
    let stmt = this.searchStmts.get(cacheKey);
    if (!stmt) {
      stmt = this.db.prepare(sql);
      this.searchStmts.set(cacheKey, stmt);
    }

    try {
      const rows = stmt.all(...values) as Record<string, unknown>[];
      return rows.map(row => {
        const result: IfscDetails = {};
        for (const [key, value] of Object.entries(row)) {
          if (value != null && String(value).trim() !== '') {
            const upperKey = key.toUpperCase() as keyof IfscDetails;
            result[upperKey] = String(value).trim();
          }
        }
        return result;
      });
    } catch (error) {
      return [];
    }
  }

  /**
   * Close the database connection.
   */
  close(): void {
    this.db.close();
  }
}

// Singleton instance
let dbInstance: IFSCDatabase | null = null;

/**
 * Get the singleton database instance.
 */
export function getDatabase(dbPath?: string): IFSCDatabase {
  if (!dbInstance) {
    dbInstance = new IFSCDatabase(dbPath);
  }
  return dbInstance;
}

/**
 * Reset the singleton instance (useful for testing).
 */
export function resetDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

