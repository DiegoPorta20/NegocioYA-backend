import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from './dto/login.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const roleName = user.role?.name || 'CASHIER';

    const payload = {
      sub: user.id,
      email: user.email,
      role: roleName,
      companyId: user.companyId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: roleName,
        companyId: user.companyId,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    const { password, ...result } = user;
    return result;
  }

  async registerCompany(registerDto: RegisterCompanyDto) {
    // Verificar que el email del usuario no esté en uso
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.userEmail },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar que el businessId no esté en uso
    const existingCompany = await this.companiesService.findByBusinessId(
      registerDto.businessId,
    );

    if (existingCompany) {
      throw new ConflictException('El RUC/NIT de la empresa ya está registrado');
    }

    // Crear la empresa
    const company = await this.companiesService.create({
      name: registerDto.companyName,
      businessId: registerDto.businessId,
      email: registerDto.companyEmail,
      phone: registerDto.companyPhone,
      address: registerDto.companyAddress,
      industry: registerDto.industry,
    });

    // Buscar el rol ADMIN
    const adminRole = await this.rolesService.findByName('ADMIN');
    if (!adminRole) {
      throw new Error('Rol ADMIN no encontrado. Ejecute el seed de roles.');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario administrador
    const user = this.usersRepository.create({
      email: registerDto.userEmail,
      password: hashedPassword,
      fullName: registerDto.fullName,
      roleId: adminRole.id,
      companyId: company.id,
      isActive: true,
    });

    await this.usersRepository.save(user);

    // Generar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: 'ADMIN',
      companyId: user.companyId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      company: {
        id: company.id,
        name: company.name,
        businessId: company.businessId,
        email: company.email,
      },
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: 'ADMIN',
        companyId: user.companyId,
      },
    };
  }
}
