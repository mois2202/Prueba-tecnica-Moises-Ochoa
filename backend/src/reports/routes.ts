import { Router, RequestHandler } from 'express';
import { ReportsController } from './controllers';

export function createReportsRouter(
  reportsController: ReportsController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  // Apply authentication to all reports routes
  router.use(authMiddleware);

  router.get(
    '/',
    (req, res, next) => reportsController.getReports(req, res, next)
  );

  return router;
}
