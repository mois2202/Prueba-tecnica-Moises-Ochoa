import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<ProjectDocument> {
    let estados = createProjectDto.estados;
    if (estados) {
      if (!estados.includes('sin iniciar')) {
        estados = ['sin iniciar', ...estados];
      }
    }
    const project = new this.projectModel({
      ...createProjectDto,
      ...(estados ? { estados } : {}),
      usuario: userId,
    });
    return project.save();
  }

  async findAll(userId: string, search?: string, sortOrder: 'asc' | 'desc' = 'desc'): Promise<ProjectDocument[]> {
    const query: any = { usuario: userId };
    
    if (search) {
      query.nombre = { $regex: search, $options: 'i' };
    }

    return this.projectModel
      .find(query)
      .sort({ fechaLimite: sortOrder === 'asc' ? 1 : -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado.');
    }

    if (project.usuario.toString() !== userId) {
      throw new ForbiddenException('No tiene permisos para acceder a este proyecto.');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<ProjectDocument> {
    const oldProject = await this.findOne(id, userId);

    const updatedDto = { ...updateProjectDto };
    if (updateProjectDto.estados) {
      let estados = [...updateProjectDto.estados];
      if (!estados.includes('sin iniciar')) {
        estados = ['sin iniciar', ...estados];
      }
      updatedDto.estados = estados;

      // Move tasks from deleted states back to 'sin iniciar'
      const deletedStates = oldProject.estados.filter((state) => !estados.includes(state));
      if (deletedStates.length > 0) {
        await this.taskModel.updateMany(
          { proyecto: id as any, estado: { $in: deletedStates } } as any,
          { estado: 'sin iniciar' },
        ).exec();
      }
    }

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updatedDto, { new: true })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Proyecto no encontrado.');
    }
    return updatedProject;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const project = await this.findOne(id, userId);
    await this.projectModel.deleteOne({ _id: project._id }).exec();
    return { message: 'Proyecto eliminado exitosamente.' };
  }
}
