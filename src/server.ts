import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { config } from './config';
import { requestLogger, errorHandler } from './middleware';
import superadminRoutes from './routes/superadmin.routes';
import plansRoutes from './routes/plans.routes';
import loanTemplateRoutes from './routes/loanTemplate.routes';
import loanFormRoutes from './routes/loanForm.routes';
import notificationRoutes from './routes/notification.routes';
import applicationRoutes from './routes/application.routes';
import dsaRoutes from './routes/dsa.routes';
import uploadRoutes from './routes/upload.routes'

// Load environment variables
dotenv.config();

const app: Express = express();
const port = config.server.port;

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api/superadmin', superadminRoutes);
app.use('/api/application',applicationRoutes ); 
app.use('/api/plans' , plansRoutes);
app.use('/api/loan-templates', loanTemplateRoutes);
app.use('/api/loan-forms', loanFormRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/upload', uploadRoutes);

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