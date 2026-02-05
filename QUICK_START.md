# 🚀 Guía Rápida - NegocioYA Backend

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Crear Usuario Administrador](#crear-usuario-administrador)
3. [Autenticación](#autenticación)
4. [Flujos de Uso Comunes](#flujos-de-uso-comunes)
5. [Ejemplos de Requests](#ejemplos-de-requests)

---

## ⚙️ Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Editar el archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=negocioya_db

JWT_SECRET=tu-clave-secreta-aqui
JWT_EXPIRATION=7d

PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

### 3. Crear la base de datos
```sql
CREATE DATABASE negocioya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Iniciar la aplicación
```bash
npm run start:dev
```

La aplicación estará disponible en:
- **API**: http://localhost:3000/api/v1
- **Documentación**: http://localhost:3000/api/docs

---

## 👤 Crear Usuario Administrador

### Opción 1: Usando Swagger
1. Ir a http://localhost:3000/api/docs
2. Buscar el endpoint `POST /api/v1/users`
3. Usar el siguiente JSON:

```json
{
  "email": "admin@negocioya.com",
  "fullName": "Administrador Principal",
  "password": "Admin123!",
  "role": "admin"
}
```

### Opción 2: Usando cURL o Postman
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@negocioya.com",
    "fullName": "Administrador Principal",
    "password": "Admin123!",
    "role": "admin"
  }'
```

---

## 🔐 Autenticación

### 1. Hacer Login
```bash
POST /api/v1/auth/login
```

**Body:**
```json
{
  "email": "admin@negocioya.com",
  "password": "Admin123!"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-del-usuario",
      "email": "admin@negocioya.com",
      "fullName": "Administrador Principal",
      "role": "admin"
    }
  },
  "timestamp": "2026-02-05T..."
}
```

### 2. Usar el Token
Agregar el header en todas las requests protegidas:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Flujos de Uso Comunes

### Flujo 1: Registrar un Producto
1. Obtener token (login)
2. Crear producto:

```bash
POST /api/v1/products
Authorization: Bearer {token}
```

```json
{
  "name": "Coca Cola 2L",
  "description": "Bebida gaseosa 2 litros",
  "sku": "BEB-001",
  "barcode": "7501055309788",
  "purchasePrice": 15.00,
  "salePrice": 25.00,
  "stock": 50,
  "minStock": 10,
  "category": "Bebidas",
  "unit": "unidad"
}
```

### Flujo 2: Registrar una Venta
1. Buscar productos disponibles
2. Crear la venta:

```bash
POST /api/v1/sales
Authorization: Bearer {token}
```

```json
{
  "details": [
    {
      "productId": "uuid-del-producto",
      "quantity": 2,
      "unitPrice": 25.00
    }
  ],
  "discount": 0,
  "tax": 0,
  "paymentMethod": "cash",
  "notes": "Venta al contado"
}
```

### Flujo 3: Ver Dashboard
```bash
GET /api/v1/dashboard/stats
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "todaySales": 15,
    "todayRevenue": 1250.50,
    "todayProfit": 450.00,
    "lowStockProducts": 3,
    "totalProducts": 48,
    "totalClients": 25
  }
}
```

---

## 📊 Ejemplos de Requests

### Productos

#### Listar todos los productos
```bash
GET /api/v1/products
```

#### Buscar productos
```bash
GET /api/v1/products?search=coca&category=Bebidas&lowStock=true
```

#### Buscar por código de barras
```bash
GET /api/v1/products/barcode/7501055309788
```

#### Productos con stock bajo
```bash
GET /api/v1/products/low-stock
```

#### Actualizar producto
```bash
PATCH /api/v1/products/{id}
```

```json
{
  "stock": 100,
  "salePrice": 26.00
}
```

### Clientes

#### Crear cliente
```bash
POST /api/v1/clients
```

```json
{
  "fullName": "María García López",
  "documentNumber": "12345678",
  "email": "maria@email.com",
  "phone": "555-0101",
  "address": "Calle Principal 123"
}
```

#### Buscar clientes
```bash
GET /api/v1/clients?search=maria
```

### Ventas

#### Listar ventas
```bash
GET /api/v1/sales
```

#### Filtrar ventas por fecha
```bash
GET /api/v1/sales?startDate=2026-02-01&endDate=2026-02-05
```

#### Ver detalle de una venta
```bash
GET /api/v1/sales/{id}
```

#### Cancelar venta (devuelve stock)
```bash
PATCH /api/v1/sales/{id}/cancel
```

### Reportes

#### Reporte de ventas
```bash
GET /api/v1/dashboard/reports/sales?startDate=2026-02-01&endDate=2026-02-05
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalSales": 45,
    "totalRevenue": 3250.50,
    "totalProfit": 1150.00,
    "salesByDay": [
      {
        "date": "2026-02-01",
        "sales": 10,
        "revenue": 750.00
      }
    ],
    "topProducts": [
      {
        "productName": "Coca Cola 2L",
        "quantity": 25,
        "revenue": 625.00
      }
    ]
  }
}
```

---

## 🔑 Roles y Permisos

### Admin
- Puede crear/editar/eliminar usuarios
- Acceso a todas las funcionalidades

### Manager
- Gestión completa de productos, clientes y ventas
- Acceso a reportes

### Cashier
- Registro de ventas
- Consulta de productos y clientes
- Sin acceso a reportes avanzados

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MySQL"
- Verificar que MySQL esté corriendo
- Verificar credenciales en .env
- Verificar que la base de datos exista

### Error: "JWT secret not configured"
- Verificar que JWT_SECRET esté en .env

### Error: "Port 3000 already in use"
- Cambiar el puerto en .env
- O cerrar la aplicación que usa el puerto 3000

### Error: "Insufficient stock"
- Verificar el stock del producto
- Actualizar el stock antes de vender

---

## 📞 Soporte

Para más información, consultar:
- **Documentación completa**: http://localhost:3000/api/docs
- **README principal**: [README.md](README.md)
- **Código fuente**: Revisar los controladores y servicios

---

## 🎨 Colores de la Marca

Usar estos colores en tu frontend:
- **Azul Oscuro**: `#10375C`
- **Turquesa**: `#2AB7B7`
- **Gris Carbón**: `#4A4A4A`
- **Blanco**: `#FFFFFF`

**Tipografía**: Inter (Google Fonts)

---

**¡Listo para vender! 🚀 NegocioYA - Software profesional, no app improvisada.**
