import {
  Controller,
  Get,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService, DashboardStats, SalesReport, MonthlyRevenueChart, WeeklySalesChart } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas del dashboard' })
  getStats(@Request() req): Promise<DashboardStats> {
    return this.dashboardService.getDashboardStats(req.user.companyId);
  }

  @Get('reports/sales')
  @ApiOperation({ summary: 'Obtener reporte de ventas' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  getSalesReport(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<SalesReport> {
    return this.dashboardService.getSalesReport(
      req.user.companyId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('charts/monthly-revenue')
  @ApiOperation({ summary: 'Obtener datos del gráfico de ingresos y ganancias mensuales' })
  @ApiQuery({ name: 'months', required: false, description: 'Número de meses a mostrar (default: 6)' })
  getMonthlyRevenueChart(
    @Request() req,
    @Query('months') months?: number,
  ): Promise<MonthlyRevenueChart> {
    return this.dashboardService.getMonthlyRevenueChart(
      req.user.companyId,
      months ? Number(months) : 6,
    );
  }

  @Get('charts/weekly-sales')
  @ApiOperation({ summary: 'Obtener datos del gráfico de ventas de la semana actual' })
  getWeeklySalesChart(@Request() req): Promise<WeeklySalesChart> {
    return this.dashboardService.getWeeklySalesChart(req.user.companyId);
  }
}
