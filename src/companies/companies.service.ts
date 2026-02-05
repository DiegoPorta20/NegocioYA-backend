import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const existingCompany = await this.companiesRepository.findOne({
      where: { name: createCompanyDto.name },
    });

    if (existingCompany) {
      throw new ConflictException('Ya existe una empresa con ese nombre');
    }

    if (createCompanyDto.businessId) {
      const existingBusinessId = await this.companiesRepository.findOne({
        where: { businessId: createCompanyDto.businessId },
      });

      if (existingBusinessId) {
        throw new ConflictException(
          'Ya existe una empresa con ese número de identificación',
        );
      }
    }

    const company = this.companiesRepository.create(createCompanyDto);
    return this.companiesRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    return company;
  }

  async findByBusinessId(businessId: string): Promise<Company | null> {
    return this.companiesRepository.findOne({
      where: { businessId },
    });
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id);

    if (updateCompanyDto.name && updateCompanyDto.name !== company.name) {
      const existingCompany = await this.companiesRepository.findOne({
        where: { name: updateCompanyDto.name },
      });

      if (existingCompany) {
        throw new ConflictException('Ya existe una empresa con ese nombre');
      }
    }

    Object.assign(company, updateCompanyDto);
    return this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    company.isActive = false;
    await this.companiesRepository.save(company);
  }

  async getStatistics(companyId: string) {
    const company = await this.companiesRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.users', 'users')
      .leftJoinAndSelect('company.products', 'products')
      .leftJoinAndSelect('company.clients', 'clients')
      .leftJoinAndSelect('company.sales', 'sales')
      .where('company.id = :companyId', { companyId })
      .getOne();

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return {
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
      },
      totalUsers: company.users?.length || 0,
      totalProducts: company.products?.length || 0,
      totalClients: company.clients?.length || 0,
      totalSales: company.sales?.length || 0,
    };
  }
}
