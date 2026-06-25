import { Router, RequestHandler } from 'express';
import { TasksController } from './controllers';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export function createTasksRouter(
  tasksController: TasksController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  // Apply authentication to all tasks routes
  router.use(authMiddleware);

  router.post(
    '/',
    validationMiddleware(CreateTaskDto),
    (req, res, next) => tasksController.create(req, res, next)
  );

  router.get(
    '/',
    (req, res, next) => tasksController.findAll(req, res, next)
  );

  router.get(
    '/:id',
    (req, res, next) => tasksController.findOne(req, res, next)
  );

  router.put(
    '/:id',
    validationMiddleware(UpdateTaskDto),
    (req, res, next) => tasksController.update(req, res, next)
  );

  router.delete(
    '/:id',
    (req, res, next) => tasksController.remove(req, res, next)
  );

  return router;
}
