import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'SUPERVISOR' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'Supervisor de Ventas' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  displayName: string;

  @ApiProperty({ example: 'Supervisa el área de ventas', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['products:read', 'sales:create', 'sales:read'],
    type: [String],
    required: false,
  })
  @IsOptional()
  permissions?: string[];
}
