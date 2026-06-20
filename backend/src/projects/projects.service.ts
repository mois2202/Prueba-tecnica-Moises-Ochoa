import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<ProjectDocument> {
    const project = new this.projectModel({
      ...createProjectDto,
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
    await this.findOne(id, userId);

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
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
