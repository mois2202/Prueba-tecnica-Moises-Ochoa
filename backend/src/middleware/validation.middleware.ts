import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { BadRequestException } from '../exceptions/http.exception';

export function validationMiddleware(dtoClass: any): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const errorMessages: string[] = [];
        const formatErrors = (validationErrors: ValidationError[]) => {
          for (const err of validationErrors) {
            if (err.constraints) {
              errorMessages.push(...Object.values(err.constraints));
            }
            if (err.children && err.children.length > 0) {
              formatErrors(err.children);
            }
          }
        };
        formatErrors(errors);

        // Throw bad request exception with all validation messages
        next(new BadRequestException(errorMessages.join(', ')));
      } else {
        req.body = dtoInstance;
        next();
      }
    } catch (err) {
      next(err);
    }
  };
}
