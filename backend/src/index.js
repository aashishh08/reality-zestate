import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import config from './config/env.js';
import { connectDatabase } from './database/bootstrap.js';
import errorHandler from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API routes
app.use(`/api/${config.apiVersion}`, apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port} in ${config.env} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
