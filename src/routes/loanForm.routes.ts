import { Router } from 'express';
import { authenticate, requireDSA, requireSuperadmin } from '../middleware';
import expressAsyncHandler from 'express-async-handler';
import { createLoan, getLoans,updateLoan } from '../controllers/loanForm.controller';

const loanFormRoutes = Router();

loanFormRoutes.post('/', authenticate, requireDSA, expressAsyncHandler(createLoan));
loanFormRoutes.get('/', authenticate, requireDSA, expressAsyncHandler(getLoans));
loanFormRoutes.put('/', authenticate, requireSuperadmin, expressAsyncHandler(updateLoan));

export default loanFormRoutes;