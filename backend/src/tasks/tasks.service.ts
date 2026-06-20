import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private projectsService: ProjectsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskDocument> {
    // Verify that the project belongs to the user
    await this.projectsService.findOne(createTaskDto.proyecto, userId);

    const task = new this.taskModel({
      ...createTaskDto,
      usuario: userId,
    });
    return task.save();
  }

  async findAll(
    userId: string,
    filters: { proyecto?: string; estado?: string; prioridad?: string },
    pagination: { page: number; limit: number } = { page: 1, limit: 10 },
  ): Promise<{ data: TaskDocument[]; total: number; page: number; limit: number }> {
    const query: any = { usuario: userId };

    if (filters.proyecto) {
      query.proyecto = filters.proyecto;
    }
    if (filters.estado) {
      query.estado = filters.estado;
    }
    if (filters.prioridad) {
      query.prioridad = filters.prioridad;
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.taskModel
        .find(query)
        .populate('proyecto', 'nombre')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.taskModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).populate('proyecto', 'nombre').exec();
    if (!task) {
      throw new NotFoundException('Tarea no encontrada.');
    }

    if (task.usuario.toString() !== userId) {
      throw new ForbiddenException('No tiene permisos para acceder a esta tarea.');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskDocument> {
    await this.findOne(id, userId);

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .populate('proyecto', 'nombre')
      .exec();

    if (!updatedTask) {
      throw new NotFoundException('Tarea no encontrada.');
    }
    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const task = await this.findOne(id, userId);
    await this.taskModel.deleteOne({ _id: task._id }).exec();
    return { message: 'Tarea eliminada exitosamente.' };
  }
}
