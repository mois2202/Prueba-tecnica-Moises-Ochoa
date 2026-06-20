import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString({}, { message: 'Debe proporcionar una fecha límite válida.' })
  @IsOptional()
  fechaLimite?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  estados?: string[];
}
