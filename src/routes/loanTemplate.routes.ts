import { Router } from 'express';
import { authenticate, requireDSA, requireSuperadmin } from '../middleware';
import expressAsyncHandler from 'express-async-handler';
import {
  createTemplate,
  getTemplates,
  getTemplateNamesByLoanType,
  updateTemplate,
  deleteTemplate,
  getTemplateById,
} from '../controllers/loanTemplate.controller';

const loanTemplateRoutes = Router();

// All routes assume /api prefix is handled globally
loanTemplateRoutes.get('/by-type/:loanType', authenticate,requireSuperadmin, expressAsyncHandler(getTemplateNamesByLoanType))
loanTemplateRoutes.get('/', authenticate,requireSuperadmin, expressAsyncHandler(getTemplates));
// loanTemplateRoutes.get('/:name', authenticate,requireDSA, expressAsyncHandler(getTemplateByName));
loanTemplateRoutes.get('/temp/:id', authenticate,requireDSA, expressAsyncHandler(getTemplateById));
loanTemplateRoutes.post('/', authenticate,requireSuperadmin, expressAsyncHandler(createTemplate));
loanTemplateRoutes.put('/:id', authenticate,requireSuperadmin, expressAsyncHandler(updateTemplate));
loanTemplateRoutes.delete('/:id', authenticate,requireSuperadmin, expressAsyncHandler(deleteTemplate));

export default loanTemplateRoutes; 