import { Router } from 'express';
import { body } from 'express-validator';
import { createUserPreference } from '../controllers/userPreference.controller';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post('/', [
  body('userId').isString().notEmpty().withMessage('User ID is required'),
  body('preferences').isObject().notEmpty().withMessage('Preferences object is required'),
  validateRequest
], createUserPreference);

export const userPreferenceRoutes = router; 