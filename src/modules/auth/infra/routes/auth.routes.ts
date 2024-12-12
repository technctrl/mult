import { Router } from 'express';
import { AuthController } from '@/modules/auth/infra/controller/auth.controller';
import { validator } from '@main/@types/Validator/Zod/Validator';
import { loginSchema } from '@/modules/auth/schema/auth.schema';

const router = Router();

router.post('/login',validator(loginSchema),AuthController.login);

export default router;
