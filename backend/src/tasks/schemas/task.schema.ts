import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Project } from '../../projects/schemas/project.schema';
import { User } from '../../auth/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ trim: true })
  descripcion: string;

  @Prop({
    type: String,
    default: 'sin iniciar',
    index: true,
  })
  estado: string;

  @Prop({
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media',
    index: true,
  })
  prioridad: string;

  @Prop()
  fechaVencimiento: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true, index: true })
  proyecto: MongooseSchema.Types.ObjectId | Project;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  usuario: MongooseSchema.Types.ObjectId | User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
