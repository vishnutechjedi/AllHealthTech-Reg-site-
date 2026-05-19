import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import rateLimiter from './middleware/rateLimit.js';
import errorHandler from './middleware/errorHandler.js';

import eventsRouter from './routes/events.js';
import speakersRouter from './routes/speakers.js';
import agendaRouter from './routes/agenda.js';
import statsRouter from './routes/stats.js';
import registrationsRouter from './routes/registrations.js';
import contactRouter from './routes/contact.js';
import paymentsRouter from './routes/payments.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// The production app sits behind one hosting/load-balancer proxy.
// This lets express-rate-limit use X-Forwarded-For safely.
app.set('trust proxy', 1);

// Security middleware
// Helmet adds various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration with enhanced security
const corsOptions = {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // No cookies
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Limit request body size

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/events', eventsRouter);
app.use('/api/speakers', speakersRouter);
app.use('/api/agenda', agendaRouter);
app.use('/api/stats', statsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/payments', paymentsRouter);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  
  // Start Google Sheets retry processor if configured
  if (process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SHEETS_CREDENTIALS_PATH) {
    try {
      const { startRetryProcessor } = await import('./services/retryManager.js');
      
      const retryConfig = {
        maxRetries: parseInt(process.env.GOOGLE_SHEETS_MAX_RETRIES || '3'),
        initialDelayMs: parseInt(process.env.GOOGLE_SHEETS_INITIAL_DELAY_MS || '1000'),
        backoffMultiplier: parseInt(process.env.GOOGLE_SHEETS_BACKOFF_MULTIPLIER || '2'),
      };
      
      const googleSheetsConfig = {
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Registrations',
        credentialsPath: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
      };
      
      startRetryProcessor(retryConfig, googleSheetsConfig);
      console.log('[GoogleSheets] Retry processor started');
    } catch (error) {
      console.error('[GoogleSheets] Failed to start retry processor:', error.message);
    }
  } else {
    console.log('[GoogleSheets] Sync not configured, retry processor not started');
  }
});

export default app;
