import express from 'express';
import { login, logout, me, profile, register } from '../controllers/user.controller';
import auth from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validators/user.valid';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', auth, profile);
router.post('/logout', logout);
router.get('/me', auth, me);
export default router;
