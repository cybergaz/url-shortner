import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { handleAnalytics, handleOverallAnalytics, handleTopicAnalytics } from '../controllers/analyticsController';

const router = express.Router()

// router.use(authenticateJWT)

router.get('/analytics/overall', authenticateJWT, handleOverallAnalytics)
router.get('/analytics/:alias', handleAnalytics)
router.get('/analytics/topic/:topic', handleTopicAnalytics)

export default router;
