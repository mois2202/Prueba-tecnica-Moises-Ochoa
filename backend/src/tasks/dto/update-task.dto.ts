import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  titulo?: string;

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
}
