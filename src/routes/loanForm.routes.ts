import { Router } from 'express';
import { authenticate, requireDSA } from '../middleware';
import expressAsyncHandler from 'express-async-handler';
import { createSubmission, getSubmissions } from '../controllers/loanForm.controller';

const loanFormRoutes = Router();

// All routes assume /api prefix is handled globally
loanFormRoutes.post('/', authenticate, requireDSA, expressAsyncHandler(createSubmission));
loanFormRoutes.get('/', authenticate, requireDSA, expressAsyncHandler(getSubmissions));

export default loanFormRoutes; 