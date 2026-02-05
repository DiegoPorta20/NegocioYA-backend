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
}
