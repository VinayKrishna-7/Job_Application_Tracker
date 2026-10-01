import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { uploadResume } from '../middleware/upload.middleware.js';
import {
  createApplicationSchema,
  updateApplicationSchema,
  listApplicationQuerySchema,
} from '../validators/application.validator.js';

const router = Router();

router.use(authenticate);

// Specific routes before :id
router.get('/kanban', ApplicationController.getKanbanBoard);
router.post('/upload-resume', uploadResume.single('resume'), ApplicationController.uploadResume);

// CRUD
router.post('/', validateRequest(createApplicationSchema), ApplicationController.createApplication);
router.get('/', validateRequest(listApplicationQuerySchema), ApplicationController.listApplications);
router.get('/:id', ApplicationController.getApplicationById);
router.patch('/:id', validateRequest(updateApplicationSchema), ApplicationController.updateApplication);
router.delete('/:id', ApplicationController.deleteApplication);

export default router;
