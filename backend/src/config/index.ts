import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://scanner:scanner123@localhost:5432/domain_scanner',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  nuclei: {
    path: process.env.NUCLEI_PATH || 'nuclei',
    templatesPath: process.env.NUCLEI_TEMPLATES_PATH || '',
  },
  scan: {
    timeout: parseInt(process.env.SCAN_TIMEOUT || '300000', 10),
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_SCANS || '5', 10),
  },
};
