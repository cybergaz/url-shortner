import express from 'express';
import { handleLogin, handleGoogleCallback } from '../controllers/authController'

const router = express.Router()

router.get('/login', handleLogin)
router.get('/google/callback', handleGoogleCallback)

export default router;
