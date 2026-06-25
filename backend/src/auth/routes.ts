import { Router, RequestHandler } from 'express';
import { AuthController } from './controllers';
import { validationMiddleware } from '../middleware/validation.middleware';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export function createAuthRouter(
  authController: AuthController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  router.post(
    '/register',
    validationMiddleware(RegisterDto),
    (req, res, next) => authController.register(req, res, next)
  );

  router.post(
    '/login',
    validationMiddleware(LoginDto),
    (req, res, next) => authController.login(req, res, next)
  );

  router.get(
    '/profile',
    authMiddleware,
    (req, res, next) => authController.getProfile(req, res, next)
  );

  return router;
}
