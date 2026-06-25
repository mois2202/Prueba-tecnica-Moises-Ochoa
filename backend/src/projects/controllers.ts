import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { ProjectDocument } from './models';
import { TaskDocument } from '../tasks/models';
import { ForbiddenException, NotFoundException } from '../exceptions/http.exception';

export class ProjectsController {
  constructor(
    private projectModel: Model<ProjectDocument>,
    private taskModel: Model<TaskDocument>
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      let estados = req.body.estados;
      if (estados) {
        if (!estados.includes('sin iniciar')) {
          estados = ['sin iniciar', ...estados];
        }
      }
      const project = new this.projectModel({
        ...req.body,
        ...(estados ? { estados } : {}),
        usuario: userId,
      });
      const savedProject = await project.save();
      res.status(201).json(savedProject);
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const search = req.query.search as string | undefined;
      const sortOrder = (req.query.sort as 'asc' | 'desc' | undefined) || 'desc';

      const query: any = { usuario: userId };
      if (search) {
        query.nombre = { $regex: search, $options: 'i' };
      }

      const projects = await this.projectModel
        .find(query)
        .sort({ fechaLimite: sortOrder === 'asc' ? 1 : -1 })
        .exec();

      res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  }

  // Internal helper to get project and verify owner
  public async getProjectAndVerifyOwner(id: string, userId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado.');
    }
    if (project.usuario.toString() !== userId) {
      throw new ForbiddenException('No tiene permisos para acceder a este proyecto.');
    }
    return project;
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const project = await this.getProjectAndVerifyOwner(req.params.id as string, userId);
      res.status(200).json(project);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const projectId = req.params.id as string;
      const oldProject = await this.getProjectAndVerifyOwner(projectId, userId);

      const updatedDto = { ...req.body };
      if (req.body.estados) {
        let estados = [...req.body.estados];
        if (!estados.includes('sin iniciar')) {
          estados = ['sin iniciar', ...estados];
        }
        updatedDto.estados = estados;

        // Move tasks from deleted states back to 'sin iniciar'
        const deletedStates = oldProject.estados.filter((state) => !estados.includes(state));
        if (deletedStates.length > 0) {
          await this.taskModel.updateMany(
            { proyecto: projectId as any, estado: { $in: deletedStates } } as any,
            { estado: 'sin iniciar' },
          ).exec();
        }
      }

      const updatedProject = await this.projectModel
        .findByIdAndUpdate(projectId, updatedDto, { new: true })
        .exec();

      if (!updatedProject) {
        throw new NotFoundException('Proyecto no encontrado.');
      }
      res.status(200).json(updatedProject);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const projectId = req.params.id as string;
      const project = await this.getProjectAndVerifyOwner(projectId, userId);
      await this.projectModel.deleteOne({ _id: project._id }).exec();
      res.status(200).json({ message: 'Proyecto eliminado exitosamente.' });
    } catch (err) {
      next(err);
    }
  }
}
