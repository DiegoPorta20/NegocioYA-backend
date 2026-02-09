import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Empresas')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles('ADMIN') // Solo super admin puede crear empresas
  @ApiOperation({ summary: 'Crear nueva empresa' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Roles('ADMIN') // Solo super admin ve todas las empresas
  @ApiOperation({ summary: 'Obtener todas las empresas' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('my-company')
  @ApiOperation({ summary: 'Obtener mi empresa' })
  getMyCompany(@Request() req) {
    return this.companiesService.findOne(req.user.companyId);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Obtener estadísticas de la empresa' })
  getStatistics(@Param('id') id: string) {
    return this.companiesService.getStatistics(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una empresa' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar una empresa (desactivar)' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
