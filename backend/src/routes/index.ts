import { Router } from 'express';
import { ScanController } from '../controllers/scan.controller';

const router = Router();

// Scan routes
router.post('/scans', ScanController.createScan);
router.get('/scans', ScanController.getAllScans);
router.get('/scans/:id', ScanController.getScanById);
router.get('/scans/:id/results', ScanController.getScanResults);

export default router;
