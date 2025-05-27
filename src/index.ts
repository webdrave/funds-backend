import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import { config } from './config';
import { requestLogger, errorHandler } from './middleware';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = config.server.port;

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use(config.api.prefix, routes);

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

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running in ${config.server.env} mode at http://localhost:${port}`);
  console.log(`⚡️[server]: API available at http://localhost:${port}${config.api.prefix}`);
});

export default app;