import { Request, Response } from 'express';
import { ScanService } from '../services/scan.service';
import Queue from 'bull';
import { config } from '../config';

// Create scan queue
const scanQueue = new Queue('scan-queue', config.redis.url);

// Process scan jobs
scanQueue.process(async (job) => {
  const { scanId } = job.data;
  await ScanService.executeScan(scanId);
});

/**
 * Scan Controller - Handles HTTP requests for scan operations
 */
export class ScanController {
  /**
   * POST /api/scans - Create and queue a new scan
   */
  static async createScan(req: Request, res: Response) {
    try {
      const { targetDomain } = req.body;

      if (!targetDomain) {
        return res.status(400).json({ error: 'targetDomain is required' });
      }

      // Validate domain format (basic validation)
      // Accept domains (example.com) or URLs (https://example.com)
      const domainRegex = /^([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/;
      const urlRegex = /^https?:\/\/([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.)+[a-zA-Z]{2,}/;
      
      if (!domainRegex.test(targetDomain) && !urlRegex.test(targetDomain)) {
        return res.status(400).json({ 
          error: 'Invalid domain format. Use example.com or https://example.com' 
        });
      }

      // Create scan record
      const scan = await ScanService.createScan(targetDomain);

      // Queue scan job
      await scanQueue.add({ scanId: scan.id });

      return res.status(201).json({
        message: 'Scan created and queued',
        scan,
      });
    } catch (error: any) {
      console.error('Error creating scan:', error);
      return res.status(500).json({ error: 'Failed to create scan' });
    }
  }

  /**
   * GET /api/scans - Get all scans
   */
  static async getAllScans(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const scans = await ScanService.getAllScans(limit, offset);

      return res.json({
        scans,
        pagination: {
          limit,
          offset,
          count: scans.length,
        },
      });
    } catch (error: any) {
      console.error('Error fetching scans:', error);
      return res.status(500).json({ error: 'Failed to fetch scans' });
    }
  }

  /**
   * GET /api/scans/:id - Get scan by ID
   */
  static async getScanById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const scan = await ScanService.getScanById(id);

      if (!scan) {
        return res.status(404).json({ error: 'Scan not found' });
      }

      return res.json({ scan });
    } catch (error: any) {
      console.error('Error fetching scan:', error);
      return res.status(500).json({ error: 'Failed to fetch scan' });
    }
  }

  /**
   * GET /api/scans/:id/results - Get scan results with findings
   */
  static async getScanResults(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const results = await ScanService.getScanResults(id);

      if (!results) {
        return res.status(404).json({ error: 'Scan not found' });
      }

      return res.json(results);
    } catch (error: any) {
      console.error('Error fetching scan results:', error);
      return res.status(500).json({ error: 'Failed to fetch scan results' });
    }
  }
}
