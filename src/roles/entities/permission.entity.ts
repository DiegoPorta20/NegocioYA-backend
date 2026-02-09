import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';

export enum PermissionModule {
  USERS = 'users',
  PRODUCTS = 'products',
  CLIENTS = 'clients',
  SALES = 'sales',
  DASHBOARD = 'dashboard',
  COMPANIES = 'companies',
  REPORTS = 'reports',
  SETTINGS = 'settings',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string; // Ej: 'products:create', 'users:manage'

  @Column({ length: 100 })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PermissionModule,
  })
  module: PermissionModule;

  @Column({
    type: 'enum',
    enum: PermissionAction,
  })
  action: PermissionAction;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
