import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import {
  createInterviewSchema,
  updateInterviewSchema,
} from '../validators/interview.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createInterviewSchema), InterviewController.createInterview);
router.get('/', InterviewController.listInterviews);
router.get('/:id', InterviewController.getInterviewById);
router.patch('/:id', validateRequest(updateInterviewSchema), InterviewController.updateInterview);
router.delete('/:id', InterviewController.deleteInterview);

export default router;
