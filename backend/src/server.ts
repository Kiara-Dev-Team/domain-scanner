import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { Database } from './models/database';
import routes from './routes';
import { NucleiService } from './services/nuclei.service';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize and start server
async function start() {
  try {
    console.log('Initializing Domain Scanner API...');

    // Check NUCLEI installation
    const nucleiInstalled = await NucleiService.checkInstallation();
    if (!nucleiInstalled) {
      console.warn('⚠️  NUCLEI not found. Please install NUCLEI to use scanning features.');
      console.warn('   Visit: https://github.com/projectdiscovery/nuclei');
    }

    // Initialize database
    await Database.initialize();
    console.log('✓ Database initialized');

    // Start server
    app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
      console.log(`  Environment: ${config.env}`);
      console.log(`  Health check: http://localhost:${config.port}/health`);
      console.log(`  API: http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await Database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await Database.close();
  process.exit(0);
});

// Start the server
start();
