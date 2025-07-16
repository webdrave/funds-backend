import { Router } from 'express';
import { authenticate, requireDSA } from '../middleware';
import expressAsyncHandler from 'express-async-handler';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from '../controllers/loanTemplate.controller';

const loanTemplateRoutes = Router();

// All routes assume /api prefix is handled globally
loanTemplateRoutes.get('/', authenticate,requireDSA, expressAsyncHandler(getTemplates));
loanTemplateRoutes.get('/:id', authenticate,requireDSA, expressAsyncHandler(getTemplateById));
loanTemplateRoutes.post('/', authenticate,requireDSA, expressAsyncHandler(createTemplate));
loanTemplateRoutes.put('/:id', authenticate,requireDSA, expressAsyncHandler(updateTemplate));
loanTemplateRoutes.delete('/:id', authenticate,requireDSA, expressAsyncHandler(deleteTemplate));

export default loanTemplateRoutes; 