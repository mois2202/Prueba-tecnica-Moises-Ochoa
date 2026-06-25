import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { TaskDocument } from './models';
import { ProjectDocument } from '../projects/models';
import { ForbiddenException, NotFoundException } from '../exceptions/http.exception';

export class TasksController {
  constructor(
    private taskModel: Model<TaskDocument>,
    private projectModel: Model<ProjectDocument>
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { proyecto } = req.body;

      // Verify that the project exists and belongs to the user
      const project = await this.projectModel.findById(proyecto).exec();
      if (!project) {
        throw new NotFoundException('Proyecto no encontrado.');
      }
      if (project.usuario.toString() !== userId) {
        throw new ForbiddenException('No tiene permisos para acceder a este proyecto.');
      }

      const task = new this.taskModel({
        ...req.body,
        usuario: userId,
      });
      const savedTask = await task.save();
      res.status(201).json(savedTask);
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const proyecto = req.query.proyecto as string | undefined;
      const estado = req.query.estado as string | undefined;
      const prioridad = req.query.prioridad as string | undefined;
      const page = req.query.page as string | undefined;
      const limit = req.query.limit as string | undefined;

      const pageNum = parseInt(page || '1', 10) || 1;
      const limitNum = parseInt(limit || '10', 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      const query: any = { usuario: userId };
      if (proyecto) {
        query.proyecto = proyecto;
      }
      if (estado) {
        query.estado = estado;
      }
      if (prioridad) {
        query.prioridad = prioridad;
      }

      const [data, total] = await Promise.all([
        this.taskModel
          .find(query)
          .populate('proyecto', 'nombre')
          .skip(skip)
          .limit(limitNum)
          .sort({ createdAt: -1 })
          .exec(),
        this.taskModel.countDocuments(query).exec(),
      ]);

      res.status(200).json({
        data,
        total,
        page: pageNum,
        limit: limitNum,
      });
    } catch (err) {
      next(err);
    }
  }

  private async getTaskAndVerifyOwner(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).populate('proyecto', 'nombre').exec();
    if (!task) {
      throw new NotFoundException('Tarea no encontrada.');
    }
    if (task.usuario.toString() !== userId) {
      throw new ForbiddenException('No tiene permisos para acceder a esta tarea.');
    }
    return task;
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const task = await this.getTaskAndVerifyOwner(req.params.id as string, userId);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const taskId = req.params.id as string;
      
      // Verify task ownership
      await this.getTaskAndVerifyOwner(taskId, userId);

      const updatedTask = await this.taskModel
        .findByIdAndUpdate(taskId, req.body, { new: true })
        .populate('proyecto', 'nombre')
        .exec();

      if (!updatedTask) {
        throw new NotFoundException('Tarea no encontrada.');
      }
      res.status(200).json(updatedTask);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const taskId = req.params.id as string;
      
      const task = await this.getTaskAndVerifyOwner(taskId, userId);
      await this.taskModel.deleteOne({ _id: task._id }).exec();
      res.status(200).json({ message: 'Tarea eliminada exitosamente.' });
    } catch (err) {
      next(err);
    }
  }
}
