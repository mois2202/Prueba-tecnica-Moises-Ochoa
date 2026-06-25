import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import { ProjectDocument } from '../projects/models';
import { TaskDocument } from '../tasks/models';

export class ReportsController {
  constructor(
    private projectModel: Model<ProjectDocument>,
    private taskModel: Model<TaskDocument>
  ) {}

  async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const userObjectId = new Types.ObjectId(userId);

      // 1. Global summary
      const [totalProjects, totalTasks, completedTasks] = await Promise.all([
        this.projectModel.countDocuments({ usuario: userId } as any).exec(),
        this.taskModel.countDocuments({ usuario: userId } as any).exec(),
        this.taskModel.countDocuments({ usuario: userId, estado: 'completada' } as any).exec(),
      ]);

      const porcentajeCompletado = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      // 2. Status distribution
      const distribucionEstados = await this.taskModel.aggregate([
        { $match: { usuario: userObjectId } },
        { $group: { _id: '$estado', cantidad: { $sum: 1 } } },
        { $project: { estado: '$_id', cantidad: 1, _id: 0 } },
      ]);

      // 3. Historical productivity: Completed tasks in the last 30 days
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

      res.status(200).json({
        resumenGlobal: {
          totalProyectos: totalProjects,
          totalTareas: totalTasks,
          porcentajeCompletado,
        },
        distribucionEstados,
        productividadHistorica,
      });
    } catch (err) {
      next(err);
    }
  }
}
