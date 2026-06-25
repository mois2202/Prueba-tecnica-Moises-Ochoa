import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/http.exception';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err instanceof HttpException ? err.status : 500;
  const message = err.message || 'Error interno del servidor.';

  if (status === 500) {
    console.error('[Error interno del servidor]', err);
  }

  res.status(status).json({
    statusCode: status,
    message: message,
    error: err.name || 'InternalServerError',
  });
}
