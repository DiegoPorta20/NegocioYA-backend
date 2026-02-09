import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Role } from '../roles/entities/role.entity';
import {
  Permission,
  PermissionModule,
  PermissionAction,
} from '../roles/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { Product } from '../products/entities/product.entity';
import { Client } from '../clients/entities/client.entity';
import { Sale } from '../sales/entities/sale.entity';
import { SaleDetail } from '../sales/entities/sale-detail.entity';

// Cargar variables de entorno
dotenv.config();

async function seedRoles() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'negocio_ya',
    entities: [Role, Permission, User, Company, Product, Client, Sale, SaleDetail],
    synchronize: true, // Crear tablas automáticamente
  });

  await dataSource.initialize();
  console.log('✅ Conexión a base de datos establecida');

  try {
    const roleRepository = dataSource.getRepository(Role);
    const permissionRepository = dataSource.getRepository(Permission);

    // ====================================
    // CREAR PERMISOS
    // ====================================
    console.log('\n📝 Creando permisos...');

    const permissionsData = [
      // USERS
      {
        name: 'users:create',
        displayName: 'Crear Usuarios',
        description: 'Permite crear nuevos usuarios',
        module: PermissionModule.USERS,
        action: PermissionAction.CREATE,
      },
      {
        name: 'users:read',
        displayName: 'Ver Usuarios',
        description: 'Permite ver la lista de usuarios',
        module: PermissionModule.USERS,
        action: PermissionAction.READ,
      },
      {
        name: 'users:update',
        displayName: 'Actualizar Usuarios',
        description: 'Permite actualizar usuarios existentes',
        module: PermissionModule.USERS,
        action: PermissionAction.UPDATE,
      },
      {
        name: 'users:delete',
        displayName: 'Eliminar Usuarios',
        description: 'Permite eliminar usuarios',
        module: PermissionModule.USERS,
        action: PermissionAction.DELETE,
      },
      {
        name: 'users:manage',
        displayName: 'Gestionar Usuarios',
        description: 'Acceso completo a gestión de usuarios',
        module: PermissionModule.USERS,
        action: PermissionAction.MANAGE,
      },
      // PRODUCTS
      {
        name: 'products:create',
        displayName: 'Crear Productos',
        description: 'Permite crear nuevos productos',
        module: PermissionModule.PRODUCTS,
        action: PermissionAction.CREATE,
      },
      {
        name: 'products:read',
        displayName: 'Ver Productos',
        description: 'Permite ver la lista de productos',
        module: PermissionModule.PRODUCTS,
        action: PermissionAction.READ,
      },
      {
        name: 'products:update',
        displayName: 'Actualizar Productos',
        description: 'Permite actualizar productos existentes',
        module: PermissionModule.PRODUCTS,
        action: PermissionAction.UPDATE,
      },
      {
        name: 'products:delete',
        displayName: 'Eliminar Productos',
        description: 'Permite eliminar productos',
        module: PermissionModule.PRODUCTS,
        action: PermissionAction.DELETE,
      },
      {
        name: 'products:manage',
        displayName: 'Gestionar Productos',
        description: 'Acceso completo a gestión de productos',
        module: PermissionModule.PRODUCTS,
        action: PermissionAction.MANAGE,
      },
      // CLIENTS
      {
        name: 'clients:create',
        displayName: 'Crear Clientes',
        description: 'Permite crear nuevos clientes',
        module: PermissionModule.CLIENTS,
        action: PermissionAction.CREATE,
      },
      {
        name: 'clients:read',
        displayName: 'Ver Clientes',
        description: 'Permite ver la lista de clientes',
        module: PermissionModule.CLIENTS,
        action: PermissionAction.READ,
      },
      {
        name: 'clients:update',
        displayName: 'Actualizar Clientes',
        description: 'Permite actualizar clientes existentes',
        module: PermissionModule.CLIENTS,
        action: PermissionAction.UPDATE,
      },
      {
        name: 'clients:delete',
        displayName: 'Eliminar Clientes',
        description: 'Permite eliminar clientes',
        module: PermissionModule.CLIENTS,
        action: PermissionAction.DELETE,
      },
      {
        name: 'clients:manage',
        displayName: 'Gestionar Clientes',
        description: 'Acceso completo a gestión de clientes',
        module: PermissionModule.CLIENTS,
        action: PermissionAction.MANAGE,
      },
      // SALES
      {
        name: 'sales:create',
        displayName: 'Crear Ventas',
        description: 'Permite registrar nuevas ventas',
        module: PermissionModule.SALES,
        action: PermissionAction.CREATE,
      },
      {
        name: 'sales:read',
        displayName: 'Ver Ventas',
        description: 'Permite ver la lista de ventas',
        module: PermissionModule.SALES,
        action: PermissionAction.READ,
      },
      {
        name: 'sales:update',
        displayName: 'Actualizar Ventas',
        description: 'Permite actualizar ventas existentes',
        module: PermissionModule.SALES,
        action: PermissionAction.UPDATE,
      },
      {
        name: 'sales:delete',
        displayName: 'Cancelar Ventas',
        description: 'Permite cancelar ventas',
        module: PermissionModule.SALES,
        action: PermissionAction.DELETE,
      },
      {
        name: 'sales:manage',
        displayName: 'Gestionar Ventas',
        description: 'Acceso completo a gestión de ventas',
        module: PermissionModule.SALES,
        action: PermissionAction.MANAGE,
      },
      // DASHBOARD
      {
        name: 'dashboard:read',
        displayName: 'Ver Dashboard',
        description: 'Permite ver estadísticas del dashboard',
        module: PermissionModule.DASHBOARD,
        action: PermissionAction.READ,
      },
      // REPORTS
      {
        name: 'reports:read',
        displayName: 'Ver Reportes',
        description: 'Permite ver reportes',
        module: PermissionModule.REPORTS,
        action: PermissionAction.READ,
      },
      // COMPANIES
      {
        name: 'companies:manage',
        displayName: 'Gestionar Empresa',
        description: 'Permite gestionar la información de la empresa',
        module: PermissionModule.COMPANIES,
        action: PermissionAction.MANAGE,
      },
      // SETTINGS
      {
        name: 'settings:manage',
        displayName: 'Gestionar Configuración',
        description: 'Permite gestionar configuración del sistema',
        module: PermissionModule.SETTINGS,
        action: PermissionAction.MANAGE,
      },
    ];

    const permissions: Permission[] = [];
    for (const permData of permissionsData) {
      let permission = await permissionRepository.findOne({
        where: { name: permData.name },
      });

      if (!permission) {
        permission = permissionRepository.create(permData);
        await permissionRepository.save(permission);
      }
      permissions.push(permission);
    }

    console.log(`✅ ${permissions.length} permisos creados o verificados`);

    // ====================================
    // CREAR ROLES DEL SISTEMA
    // ====================================
    console.log('\n👥 Creando roles del sistema...');

    // ROL: ADMIN - Acceso total
    let adminRole = await roleRepository.findOne({
      where: { name: 'ADMIN' },
      relations: ['permissions'],
    });

    if (!adminRole) {
      adminRole = roleRepository.create({
        name: 'ADMIN',
        displayName: 'Administrador',
        description: 'Acceso total al sistema',
        isSystem: true,
      });
      adminRole.permissions = permissions; // Todos los permisos
      await roleRepository.save(adminRole);
      console.log('✅ Rol ADMIN creado con todos los permisos');
    } else {
      console.log('✅ Rol ADMIN ya existe');
    }

    // ROL: MANAGER - Gestión de operaciones
    let managerRole = await roleRepository.findOne({
      where: { name: 'MANAGER' },
      relations: ['permissions'],
    });

    if (!managerRole) {
      const managerPermissions = permissions.filter((p) =>
        [
          'products:manage',
          'clients:manage',
          'sales:manage',
          'dashboard:read',
          'reports:read',
          'users:read',
        ].includes(p.name),
      );

      managerRole = roleRepository.create({
        name: 'MANAGER',
        displayName: 'Gerente',
        description: 'Gestión de productos, clientes y ventas',
        isSystem: true,
      });
      managerRole.permissions = managerPermissions;
      await roleRepository.save(managerRole);
      console.log('✅ Rol MANAGER creado');
    } else {
      console.log('✅ Rol MANAGER ya existe');
    }

    // ROL: CASHIER - Solo registro de ventas
    let cashierRole = await roleRepository.findOne({
      where: { name: 'CASHIER' },
      relations: ['permissions'],
    });

    if (!cashierRole) {
      const cashierPermissions = permissions.filter((p) =>
        [
          'products:read',
          'clients:read',
          'clients:create',
          'sales:create',
          'sales:read',
        ].includes(p.name),
      );

      cashierRole = roleRepository.create({
        name: 'CASHIER',
        displayName: 'Cajero',
        description: 'Registro de ventas y consulta básica',
        isSystem: true,
      });
      cashierRole.permissions = cashierPermissions;
      await roleRepository.save(cashierRole);
      console.log('✅ Rol CASHIER creado');
    } else {
      console.log('✅ Rol CASHIER ya existe');
    }

    console.log('\n🎉 ¡SEED DE ROLES Y PERMISOS COMPLETADO!');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ 3 Roles del sistema creados');
    console.log(`✅ ${permissions.length} Permisos configurados`);
    console.log('═══════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Error durante el seed de roles:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('✅ Conexión cerrada');
  }
}

// Ejecutar seed
seedRoles()
  .then(() => {
    console.log('✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
