import express from 'express';
import { handleShort, handleShortRedirect } from '../controllers/urlController';

const router = express.Router()

router.post('/shorten', handleShort)
router.get('/shorten/:alias', handleShortRedirect)

export default router;
