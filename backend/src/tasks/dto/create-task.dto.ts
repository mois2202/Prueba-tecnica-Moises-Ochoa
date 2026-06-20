import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'El título de la tarea es obligatorio.' })
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsEnum(['baja', 'media', 'alta'], {
    message: 'La prioridad debe ser: baja, media o alta.',
  })
  @IsOptional()
  prioridad?: string;

  @IsDateString({}, { message: 'Debe proporcionar una fecha de vencimiento válida.' })
  @IsOptional()
  fechaVencimiento?: string;

  @IsMongoId({ message: 'Debe proporcionar un ID de proyecto válido.' })
  @IsNotEmpty({ message: 'El ID del proyecto es obligatorio.' })
  proyecto: string;
}
