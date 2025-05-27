import { Router } from 'express';
import * as controllers from '../controllers';

const router = Router();

// Base routes
router.get('/', controllers.getWelcomeMessage);
router.get('/health', controllers.getHealthStatus);

// User routes - without validation middleware for now
router.get('/users', controllers.getAllUsers);
router.get('/users/:id', controllers.getUserById);
router.post('/users', controllers.createUser);
router.put('/users/:id', controllers.updateUser);
router.delete('/users/:id', controllers.deleteUser);

export default router;
