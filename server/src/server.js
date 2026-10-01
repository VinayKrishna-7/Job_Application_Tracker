import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 EasyTrack Server running in ${env.NODE_ENV} mode`);
      console.log(`📡 URL: http://localhost:${env.PORT}`);
      console.log(`🩺 Health: http://localhost:${env.PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        await disconnectDB();
        console.log('[Server] Graceful shutdown completed.');
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        console.error('[Server] Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error(`[Server] Failed to initialize server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
