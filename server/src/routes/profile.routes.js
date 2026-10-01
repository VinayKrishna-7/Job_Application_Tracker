import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { uploadAvatar } from '../middleware/upload.middleware.js';
import { updateProfileSchema } from '../validators/profile.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', ProfileController.getProfile);
router.patch('/', validateRequest(updateProfileSchema), ProfileController.updateProfile);
router.post('/avatar', uploadAvatar.single('avatar'), ProfileController.uploadAvatar);

export default router;
