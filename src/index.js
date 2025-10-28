// src/server.js
import dotenv from 'dotenv';
import app from './app.js';
import prisma from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Stockly API Server`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received...`);
  
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Shutdown complete');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));