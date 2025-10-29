// src/app.js
import express from 'express';
import prisma from './config/database.js';
import routes from './routes/index.js';
import {
  notFoundHandler,
  globalErrorHandler,
  rateLimiter,
  corsMiddleware
} from './middlewares/index.js';
import helmet from 'helmet';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
const isProd = process.env.NODE_ENV === 'production';
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: isProd ? undefined : false
  })
);

// CORS
app.use(corsMiddleware);

// Global rate limiter
app.use(rateLimiter);

app.use('/', routes);

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Stockly API',
    version: '1.0.0'
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
