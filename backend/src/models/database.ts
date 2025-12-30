import { Pool } from 'pg';
import { config } from '../config';

export class Database {
  private static pool: Pool;

  static async initialize() {
    this.pool = new Pool({
      connectionString: config.database.url,
    });

    await this.createTables();
  }

  private static async createTables() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS scans (
          id UUID PRIMARY KEY,
          target_domain VARCHAR(255) NOT NULL,
          status VARCHAR(50) NOT NULL,
          started_at TIMESTAMP,
          completed_at TIMESTAMP,
          error TEXT,
          findings_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS findings (
          id UUID PRIMARY KEY,
          scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
          risk_type VARCHAR(50) NOT NULL,
          priority VARCHAR(50) NOT NULL,
          business_description TEXT NOT NULL,
          business_impact JSONB NOT NULL,
          actions JSONB NOT NULL,
          technical JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
        CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_findings_scan_id ON findings(scan_id);
        CREATE INDEX IF NOT EXISTS idx_findings_priority ON findings(priority);
      `);
    } finally {
      client.release();
    }
  }

  static getPool(): Pool {
    return this.pool;
  }

  static async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
