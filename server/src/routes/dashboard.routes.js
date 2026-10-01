import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/stats', DashboardController.getStats);
router.get('/application-trends', DashboardController.getApplicationTrends);
router.get('/status-distribution', DashboardController.getStatusDistribution);
router.get('/source-distribution', DashboardController.getSourceDistribution);
router.get('/work-mode-distribution', DashboardController.getWorkModeDistribution);
router.get('/follow-ups', DashboardController.getFollowUps);
router.get('/upcoming-interviews', DashboardController.getUpcomingInterviews);
router.get('/recent-applications', DashboardController.getRecentApplications);

export default router;
