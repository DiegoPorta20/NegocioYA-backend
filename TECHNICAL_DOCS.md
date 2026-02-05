# 📖 Documentación Técnica - NegocioYA Backend

## 📋 Resumen del Proyecto

**NegocioYA Backend** es un sistema backend profesional completo desarrollado con las mejores prácticas de NestJS, diseñado para gestionar operaciones comerciales de pequeñas y medianas empresas.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.7
- **Base de Datos**: MySQL 8.x
- **ORM**: TypeORM 0.3.x
- **Autenticación**: JWT (Passport)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest

### Patrón de Arquitectura
- **Arquitectura en Capas** (Layered Architecture)
- **Separación de Responsabilidades** (Controllers → Services → Repositories)
- **Inyección de Dependencias** (Dependency Injection)
- **DTOs para validación** (Data Transfer Objects)

## 📁 Estructura de Archivos

```
negocio-ya_backend/
├── src/
│   ├── auth/                       # Módulo de Autenticación
│   │   ├── decorators/            # Decoradores personalizados (@Roles)
│   │   ├── dto/                   # DTOs de login
│   │   ├── guards/                # Guards JWT y Roles
│   │   ├── strategies/            # Estrategia JWT de Passport
│   │   ├── auth.controller.ts     # Controlador de auth
│   │   ├── auth.service.ts        # Lógica de autenticación
│   │   └── auth.module.ts         # Módulo
│   │
│   ├── users/                     # Módulo de Usuarios
│   │   ├── dto/                   # DTOs de usuarios
│   │   ├── entities/              # Entidad User
│   │   ├── users.controller.ts    # Controlador CRUD
│   │   ├── users.service.ts       # Lógica de negocio
│   │   └── users.module.ts        # Módulo
│   │
│   ├── products/                  # Módulo de Productos
│   │   ├── dto/                   # DTOs de productos
│   │   ├── entities/              # Entidad Product
│   │   ├── products.controller.ts # Controlador CRUD
│   │   ├── products.service.ts    # Lógica de inventario
│   │   └── products.module.ts     # Módulo
│   │
│   ├── clients/                   # Módulo de Clientes
│   │   ├── dto/                   # DTOs de clientes
│   │   ├── entities/              # Entidad Client
│   │   ├── clients.controller.ts  # Controlador CRUD
│   │   ├── clients.service.ts     # Lógica de clientes
│   │   └── clients.module.ts      # Módulo
│   │
│   ├── sales/                     # Módulo de Ventas
│   │   ├── dto/                   # DTOs de ventas
│   │   ├── entities/              # Entidades Sale y SaleDetail
│   │   ├── sales.controller.ts    # Controlador de ventas
│   │   ├── sales.service.ts       # Lógica de ventas y stock
│   │   └── sales.module.ts        # Módulo
│   │
│   ├── dashboard/                 # Módulo de Dashboard/Reportes
│   │   ├── dashboard.controller.ts # Controlador de estadísticas
│   │   ├── dashboard.service.ts   # Cálculos y reportes
│   │   └── dashboard.module.ts    # Módulo
│   │
│   ├── config/                    # Configuraciones
│   │   ├── database.config.ts     # Config TypeORM
│   │   └── jwt.config.ts          # Config JWT
│   │
│   ├── common/                    # Recursos Compartidos
│   │   ├── filters/               # Filtros de excepciones
│   │   └── interceptors/          # Interceptores (logging, transform)
│   │
│   ├── app.module.ts              # Módulo raíz
│   └── main.ts                    # Bootstrap de la aplicación
│
├── database/                      # Scripts SQL
│   └── init.sql                   # Datos iniciales
│
├── test/                          # Tests E2E
├── .env                           # Variables de entorno
├── .env.example                   # Ejemplo de .env
├── package.json                   # Dependencias
├── tsconfig.json                  # Config TypeScript
├── nest-cli.json                  # Config NestJS CLI
├── README.md                      # Documentación principal
└── QUICK_START.md                 # Guía rápida
```

## 🗄️ Modelo de Datos

### Entidades Principales

#### 1. User (Usuarios)
```typescript
{
  id: UUID (PK)
  email: string (unique)
  fullName: string
  password: string (hashed)
  role: enum (admin, manager, cashier)
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 2. Product (Productos)
```typescript
{
  id: UUID (PK)
  name: string
  description: text
  sku: string (unique)
  barcode: string (unique)
  purchasePrice: decimal(10,2)
  salePrice: decimal(10,2)
  stock: int
  minStock: int
  category: string
  unit: string
  imageUrl: string
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3. Client (Clientes)
```typescript
{
  id: UUID (PK)
  fullName: string
  documentNumber: string (unique)
  email: string
  phone: string
  address: text
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 4. Sale (Ventas)
```typescript
{
  id: UUID (PK)
  saleNumber: string (unique, auto-generated)
  subtotal: decimal(10,2)
  discount: decimal(10,2)
  tax: decimal(10,2)
  total: decimal(10,2)
  paymentMethod: enum (cash, card, transfer, credit)
  status: enum (completed, pending, cancelled)
  notes: text
  userId: UUID (FK → users)
  clientId: UUID (FK → clients, nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 5. SaleDetail (Detalles de Venta)
```typescript
{
  id: UUID (PK)
  quantity: int
  unitPrice: decimal(10,2)
  purchasePrice: decimal(10,2)
  subtotal: decimal(10,2)
  saleId: UUID (FK → sales)
  productId: UUID (FK → products)
  productName: string (snapshot)
}
```

### Relaciones
- **User → Sale**: One-to-Many (un usuario registra muchas ventas)
- **Client → Sale**: One-to-Many (un cliente tiene muchas ventas)
- **Sale → SaleDetail**: One-to-Many (una venta tiene muchos detalles)
- **Product → SaleDetail**: One-to-Many (un producto está en muchos detalles)

## 🔐 Sistema de Autenticación y Autorización

### Flujo de Autenticación
1. Usuario envía credenciales a `POST /api/v1/auth/login`
2. El sistema valida email y contraseña (bcrypt)
3. Si es válido, genera JWT con payload: `{ sub, email, role }`
4. Cliente almacena el token
5. Cliente envía token en header: `Authorization: Bearer {token}`
6. JwtGuard valida el token en cada request protegido

### Roles y Permisos

| Rol      | Permisos                                    |
|----------|---------------------------------------------|
| Admin    | Acceso total, gestión de usuarios          |
| Manager  | Productos, clientes, ventas, reportes      |
| Cashier  | Solo ventas, consulta productos/clientes   |

### Guards Implementados
- **JwtAuthGuard**: Valida JWT en rutas protegidas
- **RolesGuard**: Verifica roles específicos con `@Roles()` decorator

## 🎯 Funcionalidades Principales

### 1. Gestión de Productos
- ✅ CRUD completo
- ✅ Control de stock automático
- ✅ Alertas de stock bajo
- ✅ Búsqueda por código de barras
- ✅ Categorización
- ✅ Cálculo de ganancias

### 2. Proceso de Ventas
- ✅ Venta rápida (3 pasos máximo)
- ✅ Múltiples productos por venta
- ✅ Descuentos e impuestos
- ✅ Métodos de pago flexibles
- ✅ Actualización automática de stock
- ✅ Generación de número de venta único
- ✅ Cancelación de ventas (reversa de stock)
- ✅ Cálculo de ganancias por venta

### 3. Dashboard y Reportes
- ✅ Estadísticas del día
- ✅ Total de ventas e ingresos
- ✅ Productos con stock bajo
- ✅ Reportes por rango de fechas
- ✅ Productos más vendidos
- ✅ Gráficas de ventas por día

### 4. Gestión de Clientes
- ✅ Registro de clientes
- ✅ Historial de compras
- ✅ Búsqueda rápida

## 🔧 Configuración y Variables de Entorno

### Variables Requeridas (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=negocioya_db

# Application
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:4200

# API
API_PREFIX=api
API_VERSION=v1
```

## 🚀 Despliegue

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
# 1. Compilar
npm run build

# 2. Configurar .env para producción
NODE_ENV=production
DB_HOST=production-host
# ... otras variables

# 3. Ejecutar
npm run start:prod
```

### Recomendaciones para Producción
- ❌ Deshabilitar `synchronize: true` en TypeORM
- ✅ Usar migraciones de TypeORM
- ✅ Configurar HTTPS
- ✅ Implementar rate limiting
- ✅ Configurar logs persistentes
- ✅ Usar variables de entorno seguras
- ✅ Implementar backup de base de datos
- ✅ Monitoreo con PM2 o Docker

## 📊 Endpoints API

### Autenticación
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Perfil actual

### Usuarios (requiere rol admin)
- `GET /api/v1/users` - Listar
- `POST /api/v1/users` - Crear
- `GET /api/v1/users/:id` - Ver uno
- `PATCH /api/v1/users/:id` - Actualizar
- `DELETE /api/v1/users/:id` - Eliminar

### Productos
- `GET /api/v1/products` - Listar
- `POST /api/v1/products` - Crear
- `GET /api/v1/products/:id` - Ver uno
- `GET /api/v1/products/barcode/:barcode` - Buscar por código
- `GET /api/v1/products/low-stock` - Stock bajo
- `GET /api/v1/products/categories` - Categorías
- `PATCH /api/v1/products/:id` - Actualizar
- `DELETE /api/v1/products/:id` - Desactivar

### Clientes
- `GET /api/v1/clients` - Listar
- `POST /api/v1/clients` - Crear
- `GET /api/v1/clients/:id` - Ver uno
- `PATCH /api/v1/clients/:id` - Actualizar
- `DELETE /api/v1/clients/:id` - Desactivar

### Ventas
- `GET /api/v1/sales` - Listar
- `POST /api/v1/sales` - Crear venta
- `GET /api/v1/sales/:id` - Ver detalle
- `PATCH /api/v1/sales/:id/cancel` - Cancelar

### Dashboard
- `GET /api/v1/dashboard/stats` - Estadísticas
- `GET /api/v1/dashboard/reports/sales` - Reporte de ventas

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Convenciones de Código

### Naming
- **Clases**: PascalCase (`UserService`, `ProductController`)
- **Archivos**: kebab-case (`user.service.ts`, `product.controller.ts`)
- **Variables/Funciones**: camelCase (`findAll`, `createUser`)
- **Constantes**: UPPER_SNAKE_CASE (`JWT_SECRET`, `DB_HOST`)

### Estructura de Archivos
```
module/
├── dto/
│   ├── create-entity.dto.ts
│   └── update-entity.dto.ts
├── entities/
│   └── entity.entity.ts
├── entity.controller.ts
├── entity.service.ts
└── entity.module.ts
```

## 🐛 Debugging

### Logs
El sistema tiene logging integrado que muestra:
- Todas las requests HTTP con duración
- Errores con stack trace
- Operaciones de base de datos (en desarrollo)

### Herramientas
- **Swagger**: http://localhost:3000/api/docs
- **Postman**: Importar colección desde Swagger
- **MySQL Workbench**: Para inspeccionar base de datos
- **VSCode Debugger**: Usar `npm run start:debug`

## 🔒 Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT con expiración configurable
- ✅ Validación de DTOs con class-validator
- ✅ Sanitización de inputs
- ✅ CORS configurado
- ✅ Guards para protección de rutas
- ✅ Roles y permisos
- ✅ Manejo de excepciones global

## 📈 Mejoras Futuras Sugeridas

1. **Reportes Avanzados**
   - Exportar a PDF/Excel
   - Gráficas interactivas
   - Análisis predictivo

2. **Notificaciones**
   - Email para stock bajo
   - Alertas push
   - Recordatorios de pagos

3. **Multi-empresa**
   - Soporte para múltiples negocios
   - Roles por empresa
   - Datos aislados

4. **Integraciones**
   - Pasarelas de pago (Stripe, PayPal)
   - Facturación electrónica
   - Sistemas contables

5. **Performance**
   - Cache con Redis
   - Paginación optimizada
   - Índices de base de datos

## 🎨 Branding NegocioYA

### Colores Oficiales
- **Primario**: #10375C (Azul Oscuro) - Confianza
- **Secundario**: #2AB7B7 (Turquesa) - Acción
- **Neutro**: #4A4A4A (Gris Carbón) - Estabilidad

### Tipografía
- **Principal**: Inter (Google Fonts)
- **Uso**: SemiBold/Bold para títulos, Regular para texto

### Mensaje
"Software profesional, no app improvisada"

---

## 📞 Contacto y Soporte

**Desarrollado por**: NegocioYA Team  
**Versión**: 1.0.0  
**Licencia**: UNLICENSED (Propiedad privada)

Para soporte técnico o consultas, revisar la documentación en Swagger.

---

**© 2026 NegocioYA - Todos los derechos reservados**
