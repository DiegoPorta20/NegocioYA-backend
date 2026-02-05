import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Sale, SaleStatus } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(SaleDetail)
    private saleDetailsRepository: Repository<SaleDetail>,
    private productsService: ProductsService,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: string, companyId: string): Promise<Sale> {
    // Validar stock y obtener información de productos
    const productDetails = await Promise.all(
      createSaleDto.details.map(async (detail) => {
        const product = await this.productsService.findOne(detail.productId);

        // Verificar que el producto pertenezca a la misma empresa
        if (product.companyId !== companyId) {
          throw new BadRequestException('Producto no pertenece a tu empresa');
        }

        if (product.stock < detail.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}`,
          );
        }

        return {
          ...detail,
          product,
        };
      }),
    );

    // Calcular subtotal
    const subtotal = productDetails.reduce(
      (sum, detail) => sum + detail.unitPrice * detail.quantity,
      0,
    );

    const discount = createSaleDto.discount || 0;
    const tax = createSaleDto.tax || 0;
    const total = subtotal - discount + tax;

    // Generar número de venta
    const lastSale = await this.salesRepository.findOne({
      order: { createdAt: 'DESC' },
    });

    let saleNumber = 'V-00001';
    if (lastSale) {
      const lastNumber = parseInt(lastSale.saleNumber.split('-')[1]);
      saleNumber = `V-${String(lastNumber + 1).padStart(5, '0')}`;
    }

    // Crear venta
    const sale = this.salesRepository.create({
      saleNumber,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod: createSaleDto.paymentMethod,
      notes: createSaleDto.notes,
      userId,
      clientId: createSaleDto.clientId,
      companyId,
      status: SaleStatus.COMPLETED,
    });

    const savedSale = await this.salesRepository.save(sale);

    // Crear detalles y actualizar stock
    const saleDetails = await Promise.all(
      productDetails.map(async (detail) => {
        const saleDetail = this.saleDetailsRepository.create({
          saleId: savedSale.id,
          productId: detail.productId,
          productName: detail.product.name,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          purchasePrice: detail.product.purchasePrice,
          subtotal: detail.unitPrice * detail.quantity,
        });

        // Actualizar stock
        await this.productsService.updateStock(
          detail.productId,
          detail.quantity,
          'subtract',
        );

        return this.saleDetailsRepository.save(saleDetail);
      }),
    );

    savedSale.details = saleDetails;
    return savedSale;
  }

  async findAll(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
    userId?: string,
    clientId?: string,
  ): Promise<Sale[]> {
    const query = this.salesRepository
      .createQueryBuilder('sale')
      .where('sale.companyId = :companyId', { companyId })
      .leftJoinAndSelect('sale.details', 'details')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('sale.client', 'client');

    if (startDate && endDate) {
      query.andWhere('sale.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (userId) {
      query.andWhere('sale.userId = :userId', { userId });
    }

    if (clientId) {
      query.andWhere('sale.clientId = :clientId', { clientId });
    }

    query.orderBy('sale.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['details', 'details.product', 'user', 'client'],
    });

    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return sale;
  }

  async cancel(id: string): Promise<Sale> {
    const sale = await this.findOne(id);

    if (sale.status === SaleStatus.CANCELLED) {
      throw new BadRequestException('La venta ya está cancelada');
    }

    // Devolver stock
    await Promise.all(
      sale.details.map((detail) =>
        this.productsService.updateStock(
          detail.productId,
          detail.quantity,
          'add',
        ),
      ),
    );

    sale.status = SaleStatus.CANCELLED;
    return this.salesRepository.save(sale);
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.salesRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        status: SaleStatus.COMPLETED,
      },
      relations: ['details'],
      order: { createdAt: 'DESC' },
    });
  }
}
