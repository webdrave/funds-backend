import { Router } from 'express';
import { authenticate, requireDSA, requireRM, requireSuperadmin } from '../middleware';
import expressAsyncHandler from 'express-async-handler';
import { createLoan, getLoanByDsaId, getLoanByRmId, getLoans,updateLoan } from '../controllers/loanForm.controller';

const loanFormRoutes = Router();

loanFormRoutes.post('/', authenticate, requireDSA, expressAsyncHandler(createLoan));
loanFormRoutes.get('/', authenticate, requireDSA, expressAsyncHandler(getLoans));
loanFormRoutes.get('/rm/:rmId', authenticate, requireRM, expressAsyncHandler(getLoanByRmId));
loanFormRoutes.get('/dsa/:dsaId', authenticate, requireDSA, expressAsyncHandler(getLoanByDsaId));
loanFormRoutes.put('/', authenticate, requireSuperadmin, expressAsyncHandler(updateLoan));

export default loanFormRoutes;