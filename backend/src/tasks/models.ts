import mongoose, { Document, Schema } from 'mongoose';

export interface ITask {
  titulo: string;
  descripcion?: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: Date;
  proyecto: mongoose.Types.ObjectId;
  usuario: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TaskDocument = ITask & Document;

export const TaskSchema = new Schema<ITask>(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    estado: { type: String, default: 'sin iniciar', index: true },
    prioridad: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media',
      index: true,
    },
    fechaVencimiento: { type: Date },
    proyecto: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);
export const Task = TaskModel;
