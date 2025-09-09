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
import analyticsRoutes from './routes/analytics.routes'
import issueRoutes from './routes/issue.routes';
import commissionRoutes from './routes/commission.routes';
import withdrawalRoutes from './routes/withdrawal.routes';
import loanChatRoutes from './routes/loanChat.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = config.server.port;

app.use("/api/health", async (req, res) => {
  res.status(200).json({ status: "ok! Server is running" });
});

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
app.use('/api/analytics', analyticsRoutes);
app.use('/api/issue', issueRoutes)
app.use('/api/commissions', commissionRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/loan-chats', loanChatRoutes);


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