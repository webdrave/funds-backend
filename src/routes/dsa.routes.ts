import { Router } from 'express';
import { authenticate } from '../middleware';
import expressAsyncHandler from 'express-async-handler';
import {
    getDSAProfile,
    updateDSAProfile
} from '../controllers/dsa.controller';

const dsaRoutes = Router();

// All routes assume /api prefix is handled globally
dsaRoutes.get('/:id', authenticate, expressAsyncHandler(getDSAProfile));
dsaRoutes.put('/:id', authenticate, expressAsyncHandler(updateDSAProfile));
// dsaRoutes.patch('/:id/read', authenticate, expressAsyncHandler(markAsRead));
// dsaRoutes.patch('/:id', authenticate, expressAsyncHandler(deleteNotification));

export default dsaRoutes;

// {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODgwZjk1NDFkYmM5OGNkMDMxYjk1YzUiLCJpYXQiOjE3NTMzNTc2NDR9.weWJaG5A7eClJjEwVlKQBQBCaJEtdW6iaj19x5me3Nc","user":{"id":"6880f9541dbc98cd031b95c5","name":"Test","email":"abc@testing.com","role":"DSA","features":["Leads","Loans","Govt-Loans","emiCalculator","TrainingAndSupport","FeedbackAndGrievance"],"planId":"687b6208bc6f56b019bb6c08","planName":"Standard plan"}}