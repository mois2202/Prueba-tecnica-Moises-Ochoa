import { Router, RequestHandler } from 'express';
import { ProjectsController } from './controllers';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

export function createProjectsRouter(
  projectsController: ProjectsController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  // Apply authentication to all projects routes
  router.use(authMiddleware);

  router.post(
    '/',
    validationMiddleware(CreateProjectDto),
    (req, res, next) => projectsController.create(req, res, next)
  );

  router.get(
    '/',
    (req, res, next) => projectsController.findAll(req, res, next)
  );

  router.get(
    '/:id',
    (req, res, next) => projectsController.findOne(req, res, next)
  );

  router.put(
    '/:id',
    validationMiddleware(UpdateProjectDto),
    (req, res, next) => projectsController.update(req, res, next)
  );

  router.delete(
    '/:id',
    (req, res, next) => projectsController.remove(req, res, next)
  );

  return router;
}
