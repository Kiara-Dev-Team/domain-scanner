import axios from 'axios';
import { Scan, ScanResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanService = {
  async createScan(targetDomain: string): Promise<{ scan: Scan }> {
    const response = await api.post('/scans', { targetDomain });
    return response.data;
  },

  async getAllScans(limit = 50, offset = 0): Promise<{ scans: Scan[] }> {
    const response = await api.get('/scans', { params: { limit, offset } });
    return response.data;
  },

  async getScanById(id: string): Promise<{ scan: Scan }> {
    const response = await api.get(`/scans/${id}`);
    return response.data;
  },

  async getScanResults(id: string): Promise<ScanResult> {
    const response = await api.get(`/scans/${id}/results`);
    return response.data;
  },
};
