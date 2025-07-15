import { Router } from 'express';
import { authenticate, requireSuperadmin } from '../middleware';
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
loanTemplateRoutes.get('/', authenticate, requireSuperadmin, expressAsyncHandler(getTemplates));
loanTemplateRoutes.get('/:id', authenticate, requireSuperadmin, expressAsyncHandler(getTemplateById));
loanTemplateRoutes.post('/', authenticate, requireSuperadmin, expressAsyncHandler(createTemplate));
loanTemplateRoutes.put('/:id', authenticate, requireSuperadmin, expressAsyncHandler(updateTemplate));
loanTemplateRoutes.delete('/:id', authenticate, requireSuperadmin, expressAsyncHandler(deleteTemplate));

export default loanTemplateRoutes; 