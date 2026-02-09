import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../roles/entities/permission.entity';
import { Product } from '../products/entities/product.entity';
import { Client } from '../clients/entities/client.entity';
import { Sale, SaleStatus, PaymentMethod } from '../sales/entities/sale.entity';
import { SaleDetail } from '../sales/entities/sale-detail.entity';

// Cargar variables de entorno
dotenv.config();

async function seed() {
  // Configurar conexión a la base de datos
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'negocio_ya',
    entities: [Company, User, Role, Permission, Product, Client, Sale, SaleDetail],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('✅ Conexión a base de datos establecida');

  try {
    // Obtener roles del sistema
    const roleRepository = dataSource.getRepository(Role);
    const adminRole = await roleRepository.findOne({ where: { name: 'ADMIN' } });
    const managerRole = await roleRepository.findOne({ where: { name: 'MANAGER' } });
    const cashierRole = await roleRepository.findOne({ where: { name: 'CASHIER' } });

    if (!adminRole || !managerRole || !cashierRole) {
      console.log('❌ Error: Los roles del sistema no existen');
      console.log('⚠️  Ejecuta primero: npm run seed:roles');
      process.exit(1);
    }

    console.log('✅ Roles del sistema cargados');

    // ====================================
    // EMPRESA 1: Bodega Don José
    // ====================================
    const company1 = dataSource.getRepository(Company).create({
      name: 'Bodega Don José',
      businessId: '20123456789',
      email: 'contacto@bodegadonjose.com',
      phone: '+51987654321',
      address: 'Av. Los Olivos 234, Lima',
      industry: 'Retail - Abarrotes',
      isActive: true,
    });
    await dataSource.getRepository(Company).save(company1);
    console.log('✅ Empresa 1 creada: Bodega Don José');

    // Usuarios Bodega Don José
    const hashedPassword1 = await bcrypt.hash('Admin123!', 10);
    const user1Admin = dataSource.getRepository(User).create({
      email: 'admin@bodegadonjose.com',
      password: hashedPassword1,
      fullName: 'José Ramírez',
      roleId: adminRole.id,
      companyId: company1.id,
      isActive: true,
    });
    await dataSource.getRepository(User).save(user1Admin);

    const user1Manager = dataSource.getRepository(User).create({
      email: 'gerente@bodegadonjose.com',
      password: hashedPassword1,
      fullName: 'María González',
      roleId: managerRole.id,
      companyId: company1.id,
      isActive: true,
    });
    await dataSource.getRepository(User).save(user1Manager);

    const user1Cashier = dataSource.getRepository(User).create({
      email: 'cajero@bodegadonjose.com',
      password: hashedPassword1,
      fullName: 'Pedro Sánchez',
      roleId: cashierRole.id,
      companyId: company1.id,
      isActive: true,
    });
    await dataSource.getRepository(User).save(user1Cashier);
    console.log('✅ 3 usuarios creados para Bodega Don José');

    // Productos Bodega Don José
    const productsCompany1 = [
      {
        name: 'Coca Cola 500ml',
        description: 'Gaseosa Coca Cola 500ml',
        sku: 'CC500',
        barcode: '7501055300006',
        purchasePrice: 1.5,
        salePrice: 2.5,
        stock: 120,
        minStock: 20,
        category: 'Bebidas',
        unit: 'Unidad',
      },
      {
        name: 'Inca Kola 1.5L',
        description: 'Gaseosa Inca Kola 1.5 litros',
        sku: 'IK15',
        barcode: '7752410000017',
        purchasePrice: 3.0,
        salePrice: 5.0,
        stock: 80,
        minStock: 15,
        category: 'Bebidas',
        unit: 'Unidad',
      },
      {
        name: 'Arroz Costeño 1kg',
        description: 'Arroz extra Costeño 1kg',
        sku: 'AR1K',
        barcode: '7750100000011',
        purchasePrice: 3.5,
        salePrice: 4.8,
        stock: 50,
        minStock: 10,
        category: 'Abarrotes',
        unit: 'Kilogramo',
      },
      {
        name: 'Aceite Primor 1L',
        description: 'Aceite vegetal Primor 1 litro',
        sku: 'ACP1',
        barcode: '7750300000014',
        purchasePrice: 8.0,
        salePrice: 11.5,
        stock: 30,
        minStock: 8,
        category: 'Abarrotes',
        unit: 'Litro',
      },
      {
        name: 'Leche Gloria 1L',
        description: 'Leche evaporada Gloria 1 litro',
        sku: 'LG1',
        barcode: '7750200000012',
        purchasePrice: 4.2,
        salePrice: 5.5,
        stock: 60,
        minStock: 15,
        category: 'Lácteos',
        unit: 'Unidad',
      },
      {
        name: 'Pan integral Bimbo',
        description: 'Pan de molde integral 500g',
        sku: 'PBI500',
        barcode: '7501000200015',
        purchasePrice: 4.5,
        salePrice: 6.0,
        stock: 25,
        minStock: 5,
        category: 'Panadería',
        unit: 'Unidad',
      },
      {
        name: 'Fideos Don Vittorio 500g',
        description: 'Fideos spaghetti 500g',
        sku: 'FDV500',
        barcode: '7750400000018',
        purchasePrice: 2.0,
        salePrice: 3.2,
        stock: 100,
        minStock: 20,
        category: 'Abarrotes',
        unit: 'Paquete',
      },
      {
        name: 'Azúcar Blanca 1kg',
        description: 'Azúcar blanca refinada 1kg',
        sku: 'AZ1K',
        barcode: '7750500000019',
        purchasePrice: 2.8,
        salePrice: 3.8,
        stock: 70,
        minStock: 15,
        category: 'Abarrotes',
        unit: 'Kilogramo',
      },
      {
        name: 'Papel higiénico Suave 4 rollos',
        description: 'Papel higiénico doble hoja',
        sku: 'PHS4',
        barcode: '7750600000020',
        purchasePrice: 3.5,
        salePrice: 5.0,
        stock: 45,
        minStock: 10,
        category: 'Limpieza',
        unit: 'Paquete',
      },
      {
        name: 'Detergente Ariel 1kg',
        description: 'Detergente en polvo 1kg',
        sku: 'DET1K',
        barcode: '7750700000021',
        purchasePrice: 8.5,
        salePrice: 12.0,
        stock: 35,
        minStock: 8,
        category: 'Limpieza',
        unit: 'Kilogramo',
      },
    ];

    const savedProducts1: Product[] = [];
    for (const prod of productsCompany1) {
      const product = dataSource.getRepository(Product).create({
        ...prod,
        companyId: company1.id,
        isActive: true,
      });
      const saved = await dataSource.getRepository(Product).save(product);
      savedProducts1.push(saved);
    }
    console.log('✅ 10 productos creados para Bodega Don José');

    // Clientes Bodega Don José
    const clientsCompany1 = [
      {
        fullName: 'Ana María Torres',
        documentNumber: '12345678',
        email: 'ana.torres@email.com',
        phone: '+51987111222',
        address: 'Jr. Las Flores 123',
      },
      {
        fullName: 'Carlos Mendoza',
        documentNumber: '23456789',
        email: 'carlos.mendoza@email.com',
        phone: '+51987222333',
        address: 'Av. Central 456',
      },
      {
        fullName: 'Rosa Villalobos',
        documentNumber: '34567890',
        phone: '+51987333444',
        address: 'Calle Los Pinos 789',
      },
      {
        fullName: 'Luis Fernández',
        documentNumber: '45678901',
        email: 'luis.fernandez@email.com',
        phone: '+51987444555',
      },
      {
        fullName: 'Patricia Rojas',
        documentNumber: '56789012',
        phone: '+51987555666',
        address: 'Av. Los Incas 234',
      },
    ];

    const savedClients1: Client[] = [];
    for (const client of clientsCompany1) {
      const c = dataSource.getRepository(Client).create({
        ...client,
        companyId: company1.id,
        isActive: true,
      });
      const saved = await dataSource.getRepository(Client).save(c);
      savedClients1.push(saved);
    }
    console.log('✅ 5 clientes creados para Bodega Don José');

    // Ventas Bodega Don José
    const salesData1: Array<{
      client: Client | null;
      items: Array<{ product: Product; quantity: number }>;
      paymentMethod: PaymentMethod;
    }> = [
      {
        client: savedClients1[0],
        items: [
          { product: savedProducts1[0], quantity: 2 }, // Coca Cola
          { product: savedProducts1[4], quantity: 1 }, // Leche Gloria
        ],
        paymentMethod: PaymentMethod.CASH,
      },
      {
        client: savedClients1[1],
        items: [
          { product: savedProducts1[2], quantity: 2 }, // Arroz
          { product: savedProducts1[3], quantity: 1 }, // Aceite
          { product: savedProducts1[7], quantity: 1 }, // Azúcar
        ],
        paymentMethod: PaymentMethod.CARD,
      },
      {
        client: null, // Venta sin cliente
        items: [
          { product: savedProducts1[1], quantity: 1 }, // Inca Kola
          { product: savedProducts1[6], quantity: 2 }, // Fideos
        ],
        paymentMethod: PaymentMethod.CASH,
      },
      {
        client: savedClients1[2],
        items: [
          { product: savedProducts1[8], quantity: 2 }, // Papel higiénico
          { product: savedProducts1[9], quantity: 1 }, // Detergente
        ],
        paymentMethod: PaymentMethod.TRANSFER,
      },
      {
        client: savedClients1[3],
        items: [
          { product: savedProducts1[0], quantity: 3 }, // Coca Cola
          { product: savedProducts1[5], quantity: 2 }, // Pan
          { product: savedProducts1[4], quantity: 2 }, // Leche
        ],
        paymentMethod: PaymentMethod.CASH,
      },
    ];

    for (const saleData of salesData1) {
      let subtotal = 0;
      let profit = 0;

      for (const item of saleData.items) {
        const itemSubtotal = item.product.salePrice * item.quantity;
        const itemProfit =
          (item.product.salePrice - item.product.purchasePrice) * item.quantity;
        subtotal += itemSubtotal;
        profit += itemProfit;
      }

      const discount = 0;
      const tax = subtotal * 0.18;
      const total = subtotal - discount + tax;

      const saleNumber = `V-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const sale = dataSource.getRepository(Sale).create({
        saleNumber,
        subtotal,
        discount,
        tax,
        total,
        profit,
        paymentMethod: saleData.paymentMethod,
        status: SaleStatus.COMPLETED,
        userId: user1Cashier.id,
        clientId: saleData.client?.id,
        companyId: company1.id,
      });

      const savedSale = await dataSource.getRepository(Sale).save(sale);

      for (const item of saleData.items) {
        const saleDetail = dataSource.getRepository(SaleDetail).create({
          saleId: savedSale.id,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.salePrice,
          purchasePrice: item.product.purchasePrice,
          subtotal: item.product.salePrice * item.quantity,
        });

        await dataSource.getRepository(SaleDetail).save(saleDetail);

        // Actualizar stock
        item.product.stock -= item.quantity;
        await dataSource.getRepository(Product).save(item.product);
      }
    }
    console.log('✅ 5 ventas creadas para Bodega Don José');

    // ====================================
    // EMPRESA 2: Ferretería El Martillo
    // ====================================
    const company2 = dataSource.getRepository(Company).create({
      name: 'Ferretería El Martillo',
      businessId: '20987654321',
      email: 'ventas@ferreteriaelmartillo.com',
      phone: '+51912345678',
      address: 'Av. Industrial 567, Lima',
      industry: 'Retail - Ferretería',
      isActive: true,
    });
    await dataSource.getRepository(Company).save(company2);
    console.log('✅ Empresa 2 creada: Ferretería El Martillo');

    // Usuarios Ferretería El Martillo
    const hashedPassword2 = await bcrypt.hash('Martillo123!', 10);
    const user2Admin = dataSource.getRepository(User).create({
      email: 'admin@ferreteriaelmartillo.com',
      password: hashedPassword2,
      fullName: 'Roberto Martínez',
      roleId: adminRole.id,
      companyId: company2.id,
      isActive: true,
    });
    await dataSource.getRepository(User).save(user2Admin);

    const user2Cashier = dataSource.getRepository(User).create({
      email: 'vendedor@ferreteriaelmartillo.com',
      password: hashedPassword2,
      fullName: 'Carmen López',
      roleId: cashierRole.id,
      companyId: company2.id,
      isActive: true,
    });
    await dataSource.getRepository(User).save(user2Cashier);
    console.log('✅ 2 usuarios creados para Ferretería El Martillo');

    // Productos Ferretería El Martillo
    const productsCompany2 = [
      {
        name: 'Martillo 500g',
        description: 'Martillo de carpintero 500 gramos',
        sku: 'MAR500',
        barcode: '7890100000011',
        purchasePrice: 15.0,
        salePrice: 25.0,
        stock: 45,
        minStock: 10,
        category: 'Herramientas',
        unit: 'Unidad',
      },
      {
        name: 'Destornillador plano',
        description: 'Destornillador plano 6 pulgadas',
        sku: 'DESP6',
        barcode: '7890200000012',
        purchasePrice: 8.0,
        salePrice: 14.0,
        stock: 60,
        minStock: 15,
        category: 'Herramientas',
        unit: 'Unidad',
      },
      {
        name: 'Cinta métrica 5m',
        description: 'Cinta métrica de 5 metros',
        sku: 'CM5',
        barcode: '7890300000013',
        purchasePrice: 12.0,
        salePrice: 20.0,
        stock: 35,
        minStock: 8,
        category: 'Herramientas',
        unit: 'Unidad',
      },
      {
        name: 'Pintura látex blanco 1gl',
        description: 'Pintura látex color blanco 1 galón',
        sku: 'PINBLC1',
        barcode: '7890400000014',
        purchasePrice: 35.0,
        salePrice: 55.0,
        stock: 25,
        minStock: 5,
        category: 'Pinturas',
        unit: 'Galón',
      },
      {
        name: 'Brocha 3 pulgadas',
        description: 'Brocha para pintar 3 pulgadas',
        sku: 'BRO3',
        barcode: '7890500000015',
        purchasePrice: 6.0,
        salePrice: 10.0,
        stock: 50,
        minStock: 12,
        category: 'Pinturas',
        unit: 'Unidad',
      },
      {
        name: 'Cemento Portland 42.5kg',
        description: 'Cemento Portland tipo I bolsa 42.5kg',
        sku: 'CEM42',
        barcode: '7890600000016',
        purchasePrice: 18.0,
        salePrice: 28.0,
        stock: 100,
        minStock: 20,
        category: 'Construcción',
        unit: 'Bolsa',
      },
      {
        name: 'Clavos 2 pulgadas 1kg',
        description: 'Clavos para madera 2 pulgadas',
        sku: 'CLV2-1K',
        barcode: '7890700000017',
        purchasePrice: 4.0,
        salePrice: 7.0,
        stock: 80,
        minStock: 15,
        category: 'Ferretería',
        unit: 'Kilogramo',
      },
      {
        name: 'Tornillos 1 pulgada caja',
        description: 'Tornillos para madera 1 pulgada caja x100',
        sku: 'TOR1-100',
        barcode: '7890800000018',
        purchasePrice: 8.0,
        salePrice: 13.0,
        stock: 65,
        minStock: 12,
        category: 'Ferretería',
        unit: 'Caja',
      },
    ];

    const savedProducts2: Product[] = [];
    for (const prod of productsCompany2) {
      const product = dataSource.getRepository(Product).create({
        ...prod,
        companyId: company2.id,
        isActive: true,
      });
      const saved = await dataSource.getRepository(Product).save(product);
      savedProducts2.push(saved);
    }
    console.log('✅ 8 productos creados para Ferretería El Martillo');

    // Clientes Ferretería El Martillo
    const clientsCompany2 = [
      {
        fullName: 'Constructora ABC SAC',
        documentNumber: '20555666777',
        email: 'compras@construccionesabc.com',
        phone: '+51999888777',
        address: 'Av. Construcción 890',
      },
      {
        fullName: 'Miguel Ángel Castro',
        documentNumber: '87654321',
        phone: '+51988777666',
        address: 'Calle Los Maestros 345',
      },
      {
        fullName: 'Diana Flores',
        documentNumber: '76543210',
        email: 'diana.flores@email.com',
        phone: '+51977666555',
      },
    ];

    const savedClients2: Client[] = [];
    for (const client of clientsCompany2) {
      const c = dataSource.getRepository(Client).create({
        ...client,
        companyId: company2.id,
        isActive: true,
      });
      const saved = await dataSource.getRepository(Client).save(c);
      savedClients2.push(saved);
    }
    console.log('✅ 3 clientes creados para Ferretería El Martillo');

    // Ventas Ferretería El Martillo
    const salesData2: Array<{
      client: Client | null;
      items: Array<{ product: Product; quantity: number }>;
      paymentMethod: PaymentMethod;
    }> = [
      {
        client: savedClients2[0],
        items: [
          { product: savedProducts2[5], quantity: 10 }, // Cemento
          { product: savedProducts2[6], quantity: 5 }, // Clavos
        ],
        paymentMethod: PaymentMethod.TRANSFER,
      },
      {
        client: savedClients2[1],
        items: [
          { product: savedProducts2[0], quantity: 2 }, // Martillo
          { product: savedProducts2[1], quantity: 3 }, // Destornillador
          { product: savedProducts2[2], quantity: 1 }, // Cinta métrica
        ],
        paymentMethod: PaymentMethod.CASH,
      },
      {
        client: savedClients2[2],
        items: [
          { product: savedProducts2[3], quantity: 2 }, // Pintura
          { product: savedProducts2[4], quantity: 4 }, // Brocha
        ],
        paymentMethod: PaymentMethod.CARD,
      },
    ];

    for (const saleData of salesData2) {
      let subtotal = 0;
      let profit = 0;

      for (const item of saleData.items) {
        const itemSubtotal = item.product.salePrice * item.quantity;
        const itemProfit =
          (item.product.salePrice - item.product.purchasePrice) * item.quantity;
        subtotal += itemSubtotal;
        profit += itemProfit;
      }

      const discount = 0;
      const tax = subtotal * 0.18;
      const total = subtotal - discount + tax;

      const saleNumber = `V-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const sale = dataSource.getRepository(Sale).create({
        saleNumber,
        subtotal,
        discount,
        tax,
        total,
        profit,
        paymentMethod: saleData.paymentMethod,
        status: SaleStatus.COMPLETED,
        userId: user2Cashier.id,
        clientId: saleData.client?.id,
        companyId: company2.id,
      });

      const savedSale = await dataSource.getRepository(Sale).save(sale);

      for (const item of saleData.items) {
        const saleDetail = dataSource.getRepository(SaleDetail).create({
          saleId: savedSale.id,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.salePrice,
          purchasePrice: item.product.purchasePrice,
          subtotal: item.product.salePrice * item.quantity,
        });

        await dataSource.getRepository(SaleDetail).save(saleDetail);

        // Actualizar stock
        item.product.stock -= item.quantity;
        await dataSource.getRepository(Product).save(item.product);
      }
    }
    console.log('✅ 3 ventas creadas para Ferretería El Martillo');

    // ====================================
    // EMPRESA 3: Farmacia San Lucas
    // ====================================
    const company3 = dataSource.getRepository(Company).create({
      name: 'Farmacia San Lucas',
      businessId: '20111222333',
      email: 'info@farmaciasanlucas.com',
      phone: '+51955444333',
      address: 'Jr. Salud 123, Lima',
      industry: 'Salud - Farmacia',
      isActive: true,
    });
    await dataSource.getRepository(Company).save(company3);
    console.log('✅ Empresa 3 creada: Farmacia San Lucas');

    // Usuario Farmacia San Lucas
    const hashedPassword3 = await bcrypt.hash('Farmacia123!', 10);
    const user3Admin = dataSource.getRepository(User).create({
      email: 'admin@farmaciasanlucas.com',
      password: hashedPassword3,
      fullName: 'Dr. Lucas Herrera',
      roleId: adminRole.id,
      companyId: company3.id,
      isActive: true,
    });
    await dataSource.getRepository(User).save(user3Admin);
    console.log('✅ 1 usuario creado para Farmacia San Lucas');

    // Productos Farmacia San Lucas
    const productsCompany3 = [
      {
        name: 'Paracetamol 500mg x24',
        description: 'Paracetamol tabletas 500mg caja x24',
        sku: 'PARA500',
        barcode: '7810100000011',
        purchasePrice: 3.0,
        salePrice: 5.5,
        stock: 150,
        minStock: 30,
        category: 'Analgésicos',
        unit: 'Caja',
      },
      {
        name: 'Ibuprofeno 400mg x20',
        description: 'Ibuprofeno tabletas 400mg caja x20',
        sku: 'IBU400',
        barcode: '7810200000012',
        purchasePrice: 4.5,
        salePrice: 8.0,
        stock: 120,
        minStock: 25,
        category: 'Analgésicos',
        unit: 'Caja',
      },
      {
        name: 'Vitamina C 1000mg x30',
        description: 'Vitamina C efervescente 1000mg x30 tabletas',
        sku: 'VITC1000',
        barcode: '7810300000013',
        purchasePrice: 12.0,
        salePrice: 18.0,
        stock: 80,
        minStock: 15,
        category: 'Vitaminas',
        unit: 'Frasco',
      },
      {
        name: 'Alcohol en gel 250ml',
        description: 'Alcohol en gel antibacterial 250ml',
        sku: 'ALCGEL250',
        barcode: '7810400000014',
        purchasePrice: 5.0,
        salePrice: 9.0,
        stock: 100,
        minStock: 20,
        category: 'Higiene',
        unit: 'Frasco',
      },
      {
        name: 'Mascarillas KN95 x10',
        description: 'Mascarillas KN95 caja x10 unidades',
        sku: 'MASK10',
        barcode: '7810500000015',
        purchasePrice: 15.0,
        salePrice: 25.0,
        stock: 60,
        minStock: 12,
        category: 'Protección',
        unit: 'Caja',
      },
    ];

    for (const prod of productsCompany3) {
      const product = dataSource.getRepository(Product).create({
        ...prod,
        companyId: company3.id,
        isActive: true,
      });
      await dataSource.getRepository(Product).save(product);
    }
    console.log('✅ 5 productos creados para Farmacia San Lucas');

    console.log('\n🎉 ¡SEED COMPLETADO EXITOSAMENTE!');
    console.log('\n📊 RESUMEN:');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ 3 Empresas creadas');
    console.log('✅ 6 Usuarios creados (diferentes roles)');
    console.log('✅ 23 Productos creados');
    console.log('✅ 8 Clientes creados');
    console.log('✅ 8 Ventas registradas');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('🔑 CREDENCIALES DE ACCESO:');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📦 BODEGA DON JOSÉ:');
    console.log('   Admin:   admin@bodegadonjose.com / Admin123!');
    console.log('   Manager: gerente@bodegadonjose.com / Admin123!');
    console.log('   Cashier: cajero@bodegadonjose.com / Admin123!');
    
    console.log('\n🔨 FERRETERÍA EL MARTILLO:');
    console.log('   Admin:   admin@ferreteriaelmartillo.com / Martillo123!');
    console.log('   Cashier: vendedor@ferreteriaelmartillo.com / Martillo123!');
    
    console.log('\n💊 FARMACIA SAN LUCAS:');
    console.log('   Admin:   admin@farmaciasanlucas.com / Farmacia123!');
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('✅ Conexión cerrada');
  }
}

// Ejecutar seed
seed()
  .then(() => {
    console.log('✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
