import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { config } from './config';
import { requestLogger, errorHandler } from './middleware';
import superadminRoutes from './routes/superadmin.routes';
import plansRoutes from './routes/plans.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = config.server.port;

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api/superadmin', superadminRoutes); // Assuming admin routes are similar to user routes
app.use('/api/plans' , plansRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.path
    }
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;