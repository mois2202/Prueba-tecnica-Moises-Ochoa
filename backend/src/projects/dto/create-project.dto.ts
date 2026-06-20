import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del proyecto es obligatorio.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción del proyecto es obligatoria.' })
  descripcion: string;

  @IsDateString({}, { message: 'Debe proporcionar una fecha límite válida.' })
  @IsNotEmpty({ message: 'La fecha límite es obligatoria.' })
  fechaLimite: string;
}
