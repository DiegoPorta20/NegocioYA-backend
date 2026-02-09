import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale, SaleStatus } from '../sales/entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { Client } from '../clients/entities/client.entity';

export interface DashboardStats {
  todaySales: number;
  todayRevenue: number;
  todayProfit: number;
  lowStockProducts: number;
  totalProducts: number;
  totalClients: number;
}

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  salesByDay: { date: string; sales: number; revenue: number }[];
  topProducts: { productName: string; quantity: number; revenue: number }[];
}

export interface MonthlyRevenueChart {
  labels: string[];
  datasets: {
    label: string;
    backgroundColor: string;
    borderColor: string;
    data: number[];
  }[];
}

export interface WeeklySalesChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async getDashboardStats(companyId: string): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Ventas de hoy
    const todaySales = await this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.details', 'details')
      .where('sale.companyId = :companyId', { companyId })
      .andWhere('sale.createdAt >= :today', { today })
      .andWhere('sale.createdAt < :tomorrow', { tomorrow })
      .andWhere('sale.status = :status', { status: SaleStatus.COMPLETED })
      .getMany();

    const todayRevenue = todaySales.reduce(
      (sum, sale) => sum + Number(sale.total),
      0,
    );

    const todayProfit = todaySales.reduce(
      (sum, sale) => sum + Number(sale.profit),
      0,
    );

    // Productos con stock bajo
    const lowStockProducts = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.companyId = :companyId', { companyId })
      .andWhere('product.stock <= product.minStock')
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getCount();

    const totalProducts = await this.productsRepository.count({
      where: { companyId, isActive: true },
    });

    const totalClients = await this.clientsRepository.count({
      where: { companyId, isActive: true },
    });

    return {
      todaySales: todaySales.length,
      todayRevenue,
      todayProfit,
      lowStockProducts,
      totalProducts,
      totalClients,
    };
  }

  async getSalesReport(companyId: string, startDate: Date, endDate: Date): Promise<SalesReport> {
    const sales = await this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.details', 'details')
      .leftJoinAndSelect('details.product', 'product')
      .where('sale.companyId = :companyId', { companyId })
      .andWhere('sale.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('sale.status = :status', { status: SaleStatus.COMPLETED })
      .orderBy('sale.createdAt', 'ASC')
      .getMany();

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
    const totalProfit = sales.reduce((sum, sale) => sum + Number(sale.profit), 0);

    // Agrupar ventas por día
    const salesByDayMap = new Map<string, { sales: number; revenue: number }>();
    sales.forEach((sale) => {
      const date = sale.createdAt.toISOString().split('T')[0];
      const current = salesByDayMap.get(date) || { sales: 0, revenue: 0 };
      salesByDayMap.set(date, {
        sales: current.sales + 1,
        revenue: current.revenue + Number(sale.total),
      });
    });

    const salesByDay = Array.from(salesByDayMap.entries()).map(
      ([date, data]) => ({
        date,
        ...data,
      }),
    );

    // Productos más vendidos
    const productMap = new Map<
      string,
      { quantity: number; revenue: number }
    >();
    sales.forEach((sale) => {
      sale.details.forEach((detail) => {
        const current = productMap.get(detail.productName) || {
          quantity: 0,
          revenue: 0,
        };
        productMap.set(detail.productName, {
          quantity: current.quantity + detail.quantity,
          revenue: current.revenue + Number(detail.subtotal),
        });
      });
    });

    const topProducts = Array.from(productMap.entries())
      .map(([productName, data]) => ({
        productName,
        ...data,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalSales,
      totalRevenue,
      totalProfit,
      salesByDay,
      topProducts,
    };
  }

  async getMonthlyRevenueChart(companyId: string, months: number = 6): Promise<MonthlyRevenueChart> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Obtener ventas del período
    const sales = await this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.details', 'details')
      .where('sale.companyId = :companyId', { companyId })
      .andWhere('sale.createdAt >= :startDate', { startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate })
      .andWhere('sale.status = :status', { status: SaleStatus.COMPLETED })
      .getMany();

    // Crear array de meses
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const labels: string[] = [];
    const revenueData: number[] = [];
    const profitData: number[] = [];

    // Generar labels y datos para cada mes
    for (let i = 0; i < months; i++) {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - months + i + 1);
      const monthIndex = currentDate.getMonth();
      const year = currentDate.getFullYear();
      
      labels.push(monthNames[monthIndex]);

      // Filtrar ventas del mes actual
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getMonth() === monthIndex && saleDate.getFullYear() === year;
      });

      const monthRevenue = monthSales.reduce((sum, sale) => sum + Number(sale.total), 0);
      const monthProfit = monthSales.reduce((sum, sale) => sum + Number(sale.profit), 0);

      revenueData.push(Math.round(monthRevenue * 100) / 100);
      profitData.push(Math.round(monthProfit * 100) / 100);
    }

    const currentYear = new Date().getFullYear();

    return {
      labels,
      datasets: [
        {
          label: `Ingresos ${currentYear}`,
          backgroundColor: '#2AB7B7',
          borderColor: '#2AB7B7',
          data: revenueData,
        },
        {
          label: `Ganancias ${currentYear}`,
          backgroundColor: '#10375C',
          borderColor: '#10375C',
          data: profitData,
        },
      ],
    };
  }

  async getWeeklySalesChart(companyId: string): Promise<WeeklySalesChart> {
    // Obtener inicio y fin de la semana actual (Lunes a Domingo)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para que Lunes sea el primer día
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Obtener ventas de la semana
    const sales = await this.salesRepository
      .createQueryBuilder('sale')
      .where('sale.companyId = :companyId', { companyId })
      .andWhere('sale.createdAt >= :startOfWeek', { startOfWeek })
      .andWhere('sale.createdAt <= :endOfWeek', { endOfWeek })
      .andWhere('sale.status = :status', { status: SaleStatus.COMPLETED })
      .getMany();

    // Labels de días de la semana
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const data: number[] = [0, 0, 0, 0, 0, 0, 0];

    // Contar ventas por día
    sales.forEach((sale) => {
      const saleDate = new Date(sale.createdAt);
      const saleDayOfWeek = saleDate.getDay();
      // Convertir: Domingo (0) -> índice 6, Lunes (1) -> índice 0, etc.
      const dayIndex = saleDayOfWeek === 0 ? 6 : saleDayOfWeek - 1;
      data[dayIndex]++;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Ventas de la Semana',
          data,
          fill: true,
          borderColor: '#10375C',
          backgroundColor: 'rgba(16, 55, 92, 0.2)',
          tension: 0.4,
        },
      ],
    };
  }
}
