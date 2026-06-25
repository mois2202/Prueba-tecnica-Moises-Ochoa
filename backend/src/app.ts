import express, { Application, RequestHandler } from 'express';
import cors from 'cors';
import { AuthController } from './auth/controllers';
import { ProjectsController } from './projects/controllers';
import { TasksController } from './tasks/controllers';
import { ReportsController } from './reports/controllers';
import { createAuthRouter } from './auth/routes';
import { createProjectsRouter } from './projects/routes';
import { createTasksRouter } from './tasks/routes';
import { createReportsRouter } from './reports/routes';
import { errorMiddleware } from './middleware/error.middleware';

export class App {
  public app: Application;

  constructor(
    authController: AuthController,
    projectsController: ProjectsController,
    tasksController: TasksController,
    reportsController: ReportsController,
    authMiddleware: RequestHandler
  ) {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes(
      authController,
      projectsController,
      tasksController,
      reportsController,
      authMiddleware
    );
    this.configureErrorHandling();
  }

  private configureMiddleware() {
    this.app.use(
      cors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      })
    );
    this.app.use(express.json());
  }

  private configureRoutes(
    authController: AuthController,
    projectsController: ProjectsController,
    tasksController: TasksController,
    reportsController: ReportsController,
    authMiddleware: RequestHandler
  ) {
    this.app.use('/api/auth', createAuthRouter(authController, authMiddleware));
    this.app.use('/api/projects', createProjectsRouter(projectsController, authMiddleware));
    this.app.use('/api/tasks', createTasksRouter(tasksController, authMiddleware));
    this.app.use('/api/reportes', createReportsRouter(reportsController, authMiddleware));
  }

  private configureErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen(port: number) {
    return this.app.listen(port, () => {
      console.log(`[Servidor] Servidor Express corriendo en el puerto ${port}`);
    });
  }
}
