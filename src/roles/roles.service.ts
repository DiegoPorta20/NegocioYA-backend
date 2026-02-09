import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verificar que el nombre no exista
    const existingRole = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name.toUpperCase() },
    });

    if (existingRole) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    const role = this.rolesRepository.create({
      name: createRoleDto.name.toUpperCase(),
      displayName: createRoleDto.displayName,
      description: createRoleDto.description,
      isSystem: false,
    });

    // Asignar permisos si se proporcionan
    if (createRoleDto.permissions && createRoleDto.permissions.length > 0) {
      const permissions = await this.permissionsRepository.find({
        where: { name: In(createRoleDto.permissions) },
      });
      role.permissions = permissions;
    }

    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['permissions'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return role;
  }

  async findByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: { name: name.toUpperCase() },
      relations: ['permissions'],
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // No permitir editar roles del sistema
    if (role.isSystem) {
      throw new BadRequestException('No se pueden modificar los roles del sistema');
    }

    // Verificar nombre único si se está cambiando
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: updateRoleDto.name.toUpperCase() },
      });

      if (existingRole) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
    }

    // Actualizar campos básicos
    if (updateRoleDto.name) {
      role.name = updateRoleDto.name.toUpperCase();
    }
    if (updateRoleDto.displayName) {
      role.displayName = updateRoleDto.displayName;
    }
    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    // Actualizar permisos si se proporcionan
    if (updateRoleDto.permissions) {
      const permissions = await this.permissionsRepository.find({
        where: { name: In(updateRoleDto.permissions) },
      });
      role.permissions = permissions;
    }

    return this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    // No permitir eliminar roles del sistema
    if (role.isSystem) {
      throw new BadRequestException('No se pueden eliminar los roles del sistema');
    }

    // Verificar que no haya usuarios asignados
    if (role.users && role.users.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el rol porque tiene usuarios asignados',
      );
    }

    await this.rolesRepository.remove(role);
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionsRepository.find({
      order: { module: 'ASC', action: 'ASC' },
    });
  }

  async hasPermission(roleId: string, permissionName: string): Promise<boolean> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      return false;
    }

    return role.permissions.some((p) => p.name === permissionName);
  }
}
