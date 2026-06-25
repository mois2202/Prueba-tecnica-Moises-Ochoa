import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { UserDocument } from '../auth/models';
import { UnauthorizedException } from '../exceptions/http.exception';

export function createAuthMiddleware(
  userModel: Model<UserDocument>,
  jwtSecret: string
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No se proporcionó un token de autenticación.');
      }

      const token = authHeader.split(' ')[1];
      let payload: any;
      
      try {
        payload = jwt.verify(token, jwtSecret);
      } catch (err) {
        throw new UnauthorizedException('Token de autenticación inválido o expirado.');
      }

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Token de autenticación inválido.');
      }

      const user = await userModel.findById(payload.sub).select('-password').exec();
      if (!user) {
        throw new UnauthorizedException('El usuario no autorizado o inexistente.');
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
}
