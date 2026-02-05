# NegocioYA - Sistema Multi-Tenant

## 🏢 Arquitectura Multi-Tenant

NegocioYA es una plataforma SaaS diseñada para múltiples empresas. Cada empresa tiene sus propios datos completamente aislados:

- Productos
- Clientes
- Empleados/Usuarios
- Ventas
- Estadísticas

### Estrategia de Multi-Tenancy

Se utiliza **base de datos compartida con discriminador `companyId`**:
- Todas las tablas principales tienen una columna `companyId` (UUID)
- Cada query filtra automáticamente por `companyId`
- El `companyId` se obtiene del token JWT del usuario autenticado

## 🔐 Autenticación y Aislamiento

### 1. Registro de Nueva Empresa

**Endpoint:** `POST /auth/register`

```json
{
  "companyName": "Mi Negocio S.A.",
  "businessId": "20123456789",
  "companyEmail": "empresa@example.com",
  "companyPhone": "+51987654321",
  "companyAddress": "Av. Principal 123",
  "industry": "Retail",
  "userEmail": "admin@example.com",
  "password": "Admin123!",
  "fullName": "Juan Pérez"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "company": {
    "id": "uuid-company",
    "name": "Mi Negocio S.A.",
    "businessId": "20123456789",
    "email": "empresa@example.com"
  },
  "user": {
    "id": "uuid-user",
    "email": "admin@example.com",
    "fullName": "Juan Pérez",
    "role": "ADMIN",
    "companyId": "uuid-company"
  }
}
```

### 2. Login

**Endpoint:** `POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-user",
    "email": "admin@example.com",
    "fullName": "Juan Pérez",
    "role": "ADMIN",
    "companyId": "uuid-company"
  }
}
```

### 3. JWT Payload

El token JWT contiene:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "ADMIN",
  "companyId": "company-id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 🎯 Flujo de Datos

1. **Usuario hace login** → Recibe JWT con su `companyId`
2. **Usuario hace request** → JWT se valida y extrae `companyId`
3. **Controller recibe request** → `@Request() req` contiene `req.user.companyId`
4. **Controller llama Service** → Pasa `companyId` como parámetro
5. **Service filtra datos** → Solo retorna datos de esa empresa

### Ejemplo de Flujo Completo

```typescript
// 1. Usuario autenticado hace request
GET /products

// 2. Controller extrae companyId del JWT
@Get()
findAll(@Request() req) {
  return this.productsService.findAll(req.user.companyId);
}

// 3. Service filtra por companyId
async findAll(companyId: string) {
  const query = this.repository
    .createQueryBuilder('product')
    .where('product.companyId = :companyId', { companyId });
  return query.getMany();
}
```

## 📊 Entidades con Multi-Tenancy

### Company (Empresa)
```typescript
{
  id: string;          // UUID principal
  name: string;        // Nombre de la empresa
  businessId: string;  // RUC/NIT (único)
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  industry?: string;
  isActive: boolean;
  subscriptionEndsAt?: Date;
}
```

### User (Usuario)
```typescript
{
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER';
  companyId: string;   // ← Pertenece a una empresa
  isActive: boolean;
}
```

### Product (Producto)
```typescript
{
  id: string;
  name: string;
  sku: string;         // Único dentro de la empresa
  barcode: string;     // Único dentro de la empresa
  companyId: string;   // ← Pertenece a una empresa
}
```

### Client (Cliente)
```typescript
{
  id: string;
  fullName: string;
  documentNumber: string;
  companyId: string;   // ← Pertenece a una empresa
}
```

### Sale (Venta)
```typescript
{
  id: string;
  saleNumber: string;
  total: number;
  userId: string;      // Usuario que registró la venta
  clientId?: string;
  companyId: string;   // ← Pertenece a una empresa
}
```

## 🔒 Validaciones de Seguridad

### 1. Unicidad por Empresa
SKU y códigos de barras son únicos **dentro de cada empresa**, no globalmente:

```typescript
// ✅ Permitido: Dos empresas pueden tener el mismo SKU
Empresa A → Producto con SKU "PROD001"
Empresa B → Producto con SKU "PROD001"

// ❌ No permitido: Misma empresa no puede duplicar SKU
Empresa A → Producto 1 con SKU "PROD001"
Empresa A → Producto 2 con SKU "PROD001" // Error!
```

### 2. Validación de Productos en Ventas
Al crear una venta, se valida que todos los productos pertenezcan a la misma empresa:

```typescript
// ✅ Permitido
Usuario de Empresa A → Vende productos de Empresa A

// ❌ No permitido
Usuario de Empresa A → Intenta vender productos de Empresa B
```

### 3. Acceso a Recursos
Todos los endpoints validan el `companyId`:

```typescript
GET /products/:id
// Solo retorna el producto si product.companyId === req.user.companyId

PATCH /clients/:id
// Solo actualiza si client.companyId === req.user.companyId
```

## 🚀 Gestión de Empresas

### Crear Nueva Empresa
```bash
POST /auth/register
# Crea empresa + usuario admin automáticamente
```

### Listar Todas las Empresas (Super Admin)
```bash
GET /companies
# Solo disponible para usuarios sin companyId (Super Admin)
```

### Ver Detalles de Empresa
```bash
GET /companies/:id
```

### Actualizar Empresa
```bash
PATCH /companies/:id
```

### Obtener Estadísticas de Empresa
```bash
GET /companies/:id/stats
```

## 👥 Roles y Permisos

### ADMIN
- Acceso total a su empresa
- Puede crear usuarios
- Puede ver todas las ventas
- Puede modificar configuración

### MANAGER
- Puede crear/editar productos
- Puede registrar ventas
- Puede ver reportes
- No puede crear usuarios

### CASHIER
- Solo registra ventas
- Busca productos
- Busca clientes
- No puede editar productos ni ver reportes completos

## 📝 Ejemplos de Uso

### Escenario 1: Empresa Registra Productos
```bash
# 1. Empresa A se registra
POST /auth/register
{
  "companyName": "Tienda El Sol",
  "businessId": "20111111111",
  ...
}

# 2. Admin crea producto
POST /products
Authorization: Bearer <token-empresa-a>
{
  "name": "Coca Cola 500ml",
  "sku": "CC500",
  "price": 2.50,
  "stock": 100
}

# 3. Empresa B crea producto con mismo SKU (permitido)
POST /products
Authorization: Bearer <token-empresa-b>
{
  "name": "Inca Kola 500ml",
  "sku": "CC500",  // ← Mismo SKU pero diferente empresa
  "price": 2.50,
  "stock": 80
}
```

### Escenario 2: Aislamiento de Datos
```bash
# Usuario de Empresa A lista productos
GET /products
Authorization: Bearer <token-empresa-a>
# ✅ Solo ve productos de Empresa A

# Usuario de Empresa A intenta ver venta de Empresa B
GET /sales/uuid-venta-empresa-b
Authorization: Bearer <token-empresa-a>
# ❌ 404 Not Found (aunque existe, no tiene acceso)
```

### Escenario 3: Dashboard por Empresa
```bash
# Dashboard de Empresa A
GET /dashboard/stats
Authorization: Bearer <token-empresa-a>

Response:
{
  "todaySales": 5,
  "todayRevenue": 250.00,
  "totalProducts": 150,  // ← Solo productos de Empresa A
  "totalClients": 320,   // ← Solo clientes de Empresa A
  "lowStockProducts": 8
}

# Dashboard de Empresa B
GET /dashboard/stats
Authorization: Bearer <token-empresa-b>

Response:
{
  "todaySales": 12,
  "todayRevenue": 680.00,
  "totalProducts": 89,   // ← Solo productos de Empresa B
  "totalClients": 156,   // ← Solo clientes de Empresa B
  "lowStockProducts": 3
}
```

## 🎨 Identidad Visual

Cada empresa puede tener su propia identidad visual:

```typescript
{
  logo: "https://cdn.example.com/logo-empresa.png",
  primaryColor: "#10375C",    // Azul Oscuro
  secondaryColor: "#2AB7B7",  // Turquesa
  typography: "Inter"
}
```

## 🔄 Migración y Datos de Prueba

### 1. Crear primera empresa de prueba
```bash
POST /auth/register
{
  "companyName": "Bodega Don José",
  "businessId": "20123456789",
  "companyEmail": "contacto@bodegadonjose.com",
  "userEmail": "admin@bodegadonjose.com",
  "password": "Admin123!",
  "fullName": "José Ramírez"
}
```

### 2. Agregar productos
```bash
POST /products (con token de Bodega Don José)
POST /products (con token de Bodega Don José)
...
```

### 3. Crear segunda empresa
```bash
POST /auth/register
{
  "companyName": "Ferretería El Martillo",
  "businessId": "20987654321",
  ...
}
```

## 🛡️ Consideraciones de Seguridad

1. **JWT obligatorio**: Todos los endpoints requieren autenticación
2. **CompanyId en token**: El companyId no se puede manipular (está firmado)
3. **Validación de acceso**: Todos los services validan companyId
4. **Aislamiento de datos**: Imposible acceder a datos de otra empresa
5. **Índices en BD**: companyId debe estar indexado para performance

## 📈 Escalabilidad

- ✅ Soporte para cientos de empresas
- ✅ Índices en companyId para queries rápidos
- ✅ Posibilidad de sharding por companyId en el futuro
- ✅ Fácil agregar nueva empresa (solo POST /auth/register)

---

**¡Tu plataforma multi-tenant está lista! Cada empresa tiene su propio espacio aislado y seguro.** 🚀
