import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { App } from './app';
import { UserModel } from './auth/models';
import { ProjectModel } from './projects/models';
import { TaskModel } from './tasks/models';
import { AuthController } from './auth/controllers';
import { ProjectsController } from './projects/controllers';
import { TasksController } from './tasks/controllers';
import { ReportsController } from './reports/controllers';
import { createAuthMiddleware } from './middleware/auth.middleware';

async function bootstrap() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
  if (!mongoUri) {
    throw new Error('MONGO_URI o MONGO_URL no está definido en las variables de entorno');
  }

  const jwtSecret = process.env.JWT_SECRET || 'development_secret_key_change_me';

  // 1. Conectar a MongoDB
  await mongoose.connect(mongoUri);
  console.log('[Base de Datos] Conectado exitosamente a MongoDB.');

  // 2. Instanciación e Inyección de Dependencias
  const authController = new AuthController(UserModel, jwtSecret);
  const projectsController = new ProjectsController(ProjectModel, TaskModel);
  const tasksController = new TasksController(TaskModel, ProjectModel);
  const reportsController = new ReportsController(ProjectModel, TaskModel);

  const authMiddleware = createAuthMiddleware(UserModel, jwtSecret);

  // 3. Inicializar App Express
  const app = new App(
    authController,
    projectsController,
    tasksController,
    reportsController,
    authMiddleware
  );

  const port = parseInt(process.env.PORT || '3000', 10);
  app.listen(port);
}

bootstrap().catch((err) => {
  console.error('Error fatal durante la inicialización:', err);
  process.exit(1);
});
