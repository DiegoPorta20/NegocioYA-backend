import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, LessThanOrEqual } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, companyId: string): Promise<Product> {
    // Validar SKU único por empresa
    if (createProductDto.sku) {
      const existingSku = await this.productsRepository.findOne({
        where: { sku: createProductDto.sku, companyId },
      });
      if (existingSku) {
        throw new ConflictException('El SKU ya está registrado en tu empresa');
      }
    }

    // Validar código de barras único por empresa
    if (createProductDto.barcode) {
      const existingBarcode = await this.productsRepository.findOne({
        where: { barcode: createProductDto.barcode, companyId },
      });
      if (existingBarcode) {
        throw new ConflictException('El código de barras ya está registrado en tu empresa');
      }
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      companyId,
    });
    return this.productsRepository.save(product);
  }

  async findAll(
    companyId: string,
    search?: string,
    category?: string,
    lowStock?: boolean,
  ): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product');

    query.where('product.companyId = :companyId', { companyId });

    if (search) {
      query.andWhere(
        '(product.name LIKE :search OR product.sku LIKE :search OR product.barcode LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    if (lowStock) {
      query.andWhere('product.stock <= product.minStock');
    }

    query.orderBy('product.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string, companyId?: string): Promise<Product> {
    const where: any = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const product = await this.productsRepository.findOne({ where });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findByBarcode(barcode: string, companyId: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { barcode, companyId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con código de barras ${barcode} no encontrado`,
      );
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, companyId?: string): Promise<Product> {
    const product = await this.findOne(id, companyId);

    // Validar SKU único dentro de la empresa
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.productsRepository.findOne({
        where: { sku: updateProductDto.sku, companyId: product.companyId },
      });
      if (existingSku) {
        throw new ConflictException('El SKU ya está registrado');
      }
    }

    // Validar código de barras único dentro de la empresa
    if (
      updateProductDto.barcode &&
      updateProductDto.barcode !== product.barcode
    ) {
      const existingBarcode = await this.productsRepository.findOne({
        where: { barcode: updateProductDto.barcode },
      });
      if (existingBarcode) {
        throw new ConflictException('El código de barras ya está registrado');
      }
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async updateStock(
    id: string,
    quantity: number,
    operation: 'add' | 'subtract',
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (operation === 'subtract') {
      if (product.stock < quantity) {
        throw new BadRequestException('Stock insuficiente');
      }
      product.stock -= quantity;
    } else {
      product.stock += quantity;
    }

    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    product.isActive = false;
    await this.productsRepository.save(product);
  }

  async getLowStockProducts(companyId: string): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.companyId = :companyId', { companyId })
      .andWhere('product.stock <= product.minStock')
      .andWhere('product.isActive = :isActive', { isActive: true })
      .orderBy('product.stock', 'ASC')
      .getMany();
  }

  async getCategories(): Promise<string[]> {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.category IS NOT NULL')
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getRawMany();

    return result.map((r) => r.category);
  }
}
