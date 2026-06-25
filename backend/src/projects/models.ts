import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  nombre: string;
  descripcion: string;
  fechaLimite: Date;
  usuario: mongoose.Types.ObjectId;
  estados: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectDocument = IProject & Document;

export const ProjectSchema = new Schema<IProject>(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    fechaLimite: { type: Date, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    estados: {
      type: [String],
      default: ['sin iniciar', 'en progreso', 'completada'],
    },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<ProjectDocument>('Project', ProjectSchema);
export const Project = ProjectModel;
