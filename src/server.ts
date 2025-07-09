import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { config } from './config';
import { requestLogger, errorHandler } from './middleware';
import usersRoutes from './routes/users.routes';
import adminRoutes from './routes/admin.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = config.server.port;

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes); // Assuming admin routes are similar to user routes

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