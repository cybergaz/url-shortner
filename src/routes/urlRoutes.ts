import express from 'express';
import { handleShort, handleShortRedirect } from '../controllers/urlController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router()
// predicate the router with a check and bail out when needed

// router.use(authenticateJWT)

router.post('/shorten', authenticateJWT, handleShort)
router.get('/shorten/:alias', handleShortRedirect)

export default router;
