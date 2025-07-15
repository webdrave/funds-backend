import { Router } from 'express';
import { authenticate } from '../middleware';
import expressAsyncHandler from 'express-async-handler';
import { createSubmission, getSubmissions } from '../controllers/loanForm.controller';

const loanFormRoutes = Router();

// All routes assume /api prefix is handled globally
loanFormRoutes.post('/', authenticate, expressAsyncHandler(createSubmission));
loanFormRoutes.get('/', authenticate, expressAsyncHandler(getSubmissions));

export default loanFormRoutes; 