import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto, companyId: string): Promise<Client> {
    const client = this.clientsRepository.create({
      ...createClientDto,
      companyId,
    });
    return this.clientsRepository.save(client);
  }

  async findAll(companyId: string, search?: string): Promise<Client[]> {
    const query = this.clientsRepository.createQueryBuilder('client');

    query.where('client.companyId = :companyId', { companyId });

    if (search) {
      query.andWhere(
        '(client.fullName LIKE :search OR client.documentNumber LIKE :search OR client.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.orderBy('client.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string, companyId?: string): Promise<Client> {
    const where: any = { id };
    if (companyId) {
      where.companyId = companyId;
    }

    const client = await this.clientsRepository.findOne({ where });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, companyId?: string): Promise<Client> {
    const client = await this.findOne(id, companyId);
    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    client.isActive = false;
    await this.clientsRepository.save(client);
  }
}
