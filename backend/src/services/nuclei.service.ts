import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '../config';
import { NucleiFinding } from '../models/types';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

/**
 * NUCLEI Integration Service
 * Handles execution of NUCLEI scans and parsing of results
 */
export class NucleiService {
  /**
   * Execute a NUCLEI scan on the target domain
   */
  static async executeScan(targetDomain: string): Promise<NucleiFinding[]> {
    // Create temporary file for results
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nuclei-'));
    const outputFile = path.join(tmpDir, 'results.json');

    try {
      // Build NUCLEI command
      const nucleiCmd = this.buildNucleiCommand(targetDomain, outputFile);

      console.log(`Executing NUCLEI scan: ${nucleiCmd}`);

      // Execute NUCLEI with timeout
      const { stdout, stderr } = await execAsync(nucleiCmd, {
        timeout: config.scan.timeout,
        maxBuffer: 10 * 1024 * 1024, // 10MB
      });

      if (stderr && !stderr.includes('Using Nuclei Engine')) {
        console.warn('NUCLEI stderr:', stderr);
      }

      // Read and parse results
      const results = await this.parseResults(outputFile);
      
      // Cleanup
      await fs.rm(tmpDir, { recursive: true, force: true });

      return results;
    } catch (error: any) {
      // Cleanup on error
      await fs.rm(tmpDir, { recursive: true, force: true });

      if (error.killed) {
        throw new Error('Scan timeout exceeded');
      }

      throw new Error(`NUCLEI scan failed: ${error.message}`);
    }
  }

  /**
   * Build NUCLEI command with appropriate flags
   */
  private static buildNucleiCommand(target: string, outputFile: string): string {
    const parts = [
      config.nuclei.path,
      '-target', `"${target}"`,
      '-json',
      '-output', `"${outputFile}"`,
      '-silent',
      '-no-color',
    ];

    // Add templates path if configured
    if (config.nuclei.templatesPath) {
      parts.push('-t', `"${config.nuclei.templatesPath}"`);
    }

    return parts.join(' ');
  }

  /**
   * Parse NUCLEI JSON output
   */
  private static async parseResults(outputFile: string): Promise<NucleiFinding[]> {
    try {
      const content = await fs.readFile(outputFile, 'utf-8');
      
      if (!content.trim()) {
        return [];
      }

      // NUCLEI outputs one JSON object per line
      const lines = content.trim().split('\n');
      const findings: NucleiFinding[] = [];

      for (const line of lines) {
        try {
          const finding = JSON.parse(line);
          findings.push(finding);
        } catch (e) {
          console.warn('Failed to parse NUCLEI output line:', line);
        }
      }

      return findings;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // No results file means no findings
        return [];
      }
      throw error;
    }
  }

  /**
   * Check if NUCLEI is installed and accessible
   */
  static async checkInstallation(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`${config.nuclei.path} -version`);
      console.log('NUCLEI version:', stdout.trim());
      return true;
    } catch (error) {
      console.error('NUCLEI not found or not executable');
      return false;
    }
  }

  /**
   * Update NUCLEI templates
   */
  static async updateTemplates(): Promise<void> {
    try {
      await execAsync(`${config.nuclei.path} -update-templates`);
      console.log('NUCLEI templates updated successfully');
    } catch (error: any) {
      throw new Error(`Failed to update NUCLEI templates: ${error.message}`);
    }
  }
}
