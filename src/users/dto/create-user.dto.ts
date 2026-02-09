import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@empresa.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'uuid-del-rol' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ example: 'uuid-de-la-empresa' })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;
}
