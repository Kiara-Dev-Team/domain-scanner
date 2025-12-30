import { Database } from '../models/database';
import { Scan, ScanStatus, BusinessFinding, ScanResult, Priority, RiskType } from '../models/types';
import { v4 as uuidv4 } from 'uuid';
import { NucleiService } from './nuclei.service';
import { TranslationEngine } from './translation.service';

/**
 * Scan Service - Manages scan lifecycle and data persistence
 */
export class ScanService {
  /**
   * Create a new scan
   */
  static async createScan(targetDomain: string): Promise<Scan> {
    const pool = Database.getPool();
    
    const scan: Scan = {
      id: uuidv4(),
      targetDomain,
      status: ScanStatus.PENDING,
      createdAt: new Date(),
    };

    await pool.query(
      `INSERT INTO scans (id, target_domain, status, created_at)
       VALUES ($1, $2, $3, $4)`,
      [scan.id, scan.targetDomain, scan.status, scan.createdAt]
    );

    return scan;
  }

  /**
   * Execute a scan (called by worker)
   */
  static async executeScan(scanId: string): Promise<void> {
    const pool = Database.getPool();

    try {
      // Update scan status to RUNNING
      await pool.query(
        `UPDATE scans SET status = $1, started_at = $2 WHERE id = $3`,
        [ScanStatus.RUNNING, new Date(), scanId]
      );

      // Get scan details
      const result = await pool.query('SELECT * FROM scans WHERE id = $1', [scanId]);
      const scan = result.rows[0];

      if (!scan) {
        throw new Error('Scan not found');
      }

      // Execute NUCLEI scan
      const nucleiFindings = await NucleiService.executeScan(scan.target_domain);

      // Translate to business findings
      const businessFindings = TranslationEngine.translateFindings(scanId, nucleiFindings);

      // Save findings to database
      for (const finding of businessFindings) {
        await pool.query(
          `INSERT INTO findings (id, scan_id, risk_type, priority, business_description, 
           business_impact, actions, technical, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            finding.id,
            finding.scanId,
            finding.riskType,
            finding.priority,
            finding.businessDescription,
            JSON.stringify(finding.businessImpact),
            JSON.stringify(finding.actions),
            JSON.stringify(finding.technical),
            finding.createdAt,
          ]
        );
      }

      // Update scan as completed
      await pool.query(
        `UPDATE scans SET status = $1, completed_at = $2, findings_count = $3 WHERE id = $4`,
        [ScanStatus.COMPLETED, new Date(), businessFindings.length, scanId]
      );
    } catch (error: any) {
      // Update scan as failed
      await pool.query(
        `UPDATE scans SET status = $1, completed_at = $2, error = $3 WHERE id = $4`,
        [ScanStatus.FAILED, new Date(), error.message, scanId]
      );
      throw error;
    }
  }

  /**
   * Get scan by ID
   */
  static async getScanById(scanId: string): Promise<Scan | null> {
    const pool = Database.getPool();
    const result = await pool.query('SELECT * FROM scans WHERE id = $1', [scanId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToScan(result.rows[0]);
  }

  /**
   * Get all scans
   */
  static async getAllScans(limit: number = 50, offset: number = 0): Promise<Scan[]> {
    const pool = Database.getPool();
    const result = await pool.query(
      'SELECT * FROM scans ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows.map(row => this.mapRowToScan(row));
  }

  /**
   * Get scan results with findings
   */
  static async getScanResults(scanId: string): Promise<ScanResult | null> {
    const pool = Database.getPool();
    
    // Get scan
    const scanResult = await pool.query('SELECT * FROM scans WHERE id = $1', [scanId]);
    if (scanResult.rows.length === 0) {
      return null;
    }
    const scan = this.mapRowToScan(scanResult.rows[0]);

    // Get findings
    const findingsResult = await pool.query(
      'SELECT * FROM findings WHERE scan_id = $1 ORDER BY priority',
      [scanId]
    );
    const findings = findingsResult.rows.map(row => this.mapRowToFinding(row));

    // Calculate summary
    const summary = this.calculateSummary(findings);

    return {
      scan,
      findings,
      summary,
    };
  }

  /**
   * Calculate summary statistics
   */
  private static calculateSummary(findings: BusinessFinding[]) {
    const summary = {
      immediate: 0,
      high: 0,
      medium: 0,
      low: 0,
      byRiskType: {
        financial: 0,
        governance: 0,
        operational: 0,
      },
    };

    for (const finding of findings) {
      // Count by priority
      switch (finding.priority) {
        case Priority.IMMEDIATE:
          summary.immediate++;
          break;
        case Priority.HIGH:
          summary.high++;
          break;
        case Priority.MEDIUM:
          summary.medium++;
          break;
        case Priority.LOW:
          summary.low++;
          break;
      }

      // Count by risk type
      switch (finding.riskType) {
        case RiskType.FINANCIAL:
          summary.byRiskType.financial++;
          break;
        case RiskType.GOVERNANCE:
          summary.byRiskType.governance++;
          break;
        case RiskType.OPERATIONAL:
          summary.byRiskType.operational++;
          break;
      }
    }

    return summary;
  }

  /**
   * Map database row to Scan object
   */
  private static mapRowToScan(row: any): Scan {
    return {
      id: row.id,
      targetDomain: row.target_domain,
      status: row.status as ScanStatus,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      error: row.error,
      findingsCount: row.findings_count,
      createdAt: row.created_at,
    };
  }

  /**
   * Map database row to BusinessFinding object
   */
  private static mapRowToFinding(row: any): BusinessFinding {
    return {
      id: row.id,
      scanId: row.scan_id,
      riskType: row.risk_type as RiskType,
      priority: row.priority as Priority,
      businessDescription: row.business_description,
      businessImpact: JSON.parse(row.business_impact),
      actions: JSON.parse(row.actions),
      technical: JSON.parse(row.technical),
      createdAt: row.created_at,
    };
  }
}
