import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  // Datos de la empresa
  @ApiProperty({ example: 'Mi Negocio S.A.' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  businessId: string;

  @ApiProperty({ example: 'empresa@example.com' })
  @IsEmail()
  companyEmail: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  companyPhone?: string;

  @ApiProperty({ example: 'Calle Principal 123, Ciudad', required: false })
  @IsOptional()
  @IsString()
  companyAddress?: string;

  @ApiProperty({ example: 'Retail', required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  // Datos del usuario administrador
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  userEmail: string;

  @ApiProperty({ example: 'Admin123!' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  fullName: string;
}
