import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async getReports(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    // 1. Global summary
    const [totalProjects, totalTasks, completedTasks] = await Promise.all([
      this.projectModel.countDocuments({ usuario: userId } as any).exec(),
      this.taskModel.countDocuments({ usuario: userId } as any).exec(),
      this.taskModel.countDocuments({ usuario: userId, estado: 'completada' } as any).exec(),
    ]);

    const porcentajeCompletado = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // 2. Status distribution
    const estados = ['pendiente', 'en progreso', 'completada'];
    const distribucionEstados = await Promise.all(
      estados.map(async (estado) => {
        const cantidad = await this.taskModel.countDocuments({ usuario: userId, estado } as any).exec();
        return { estado, cantidad };
      }),
    );

    // 3. Risk alerts: Top 5 projects with highest volume of pending/in-progress tasks
    const alertasRiesgo = await this.taskModel.aggregate([
      {
        $match: {
          usuario: userObjectId,
          estado: { $in: ['pendiente', 'en progreso'] },
        },
      },
      {
        $group: {
          _id: '$proyecto',
          tareasPendientes: { $sum: 1 },
        },
      },
      {
        $sort: { tareasPendientes: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'proyectoInfo',
        },
      },
      {
        $unwind: '$proyectoInfo',
      },
      {
        $project: {
          _id: 1,
          tareasPendientes: 1,
          nombre: '$proyectoInfo.nombre',
        },
      },
    ]);

    // 4. Historical productivity: Completed tasks in the last 30 days
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const productividadHistorica = await this.taskModel.aggregate([
      {
        $match: {
          usuario: userObjectId,
          estado: 'completada',
          updatedAt: { $gte: hace30Dias },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
          },
          cantidad: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          fecha: '$_id',
          cantidad: 1,
          _id: 0,
        },
      },
    ]);

    return {
      resumenGlobal: {
        totalProyectos: totalProjects,
        totalTareas: totalTasks,
        porcentajeCompletado,
      },
      distribucionEstados,
      alertasRiesgo,
      productividadHistorica,
    };
  }
}
