# 🎯 NegocioYA - Backend Listo para Producción

## ✅ Todo Está Configurado y Listo

Tu backend multi-tenant está **100% funcional** con:
- ✅ 3 empresas de prueba con datos reales
- ✅ 6 usuarios con diferentes roles
- ✅ 23 productos en diferentes categorías
- ✅ 8 clientes registrados
- ✅ 8 ventas de ejemplo
- ✅ CORS configurado para tu frontend
- ✅ Autenticación JWT completa
- ✅ Sistema multi-empresa aislado

---

## 🚀 Inicio Rápido (3 comandos)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env (copia y edita el archivo)
copy .env.example .env
# Edita .env: DB_PASSWORD=tu_password

# 3. Cargar datos de prueba y arrancar
npm run seed
npm run start:dev
```

**¡Listo!** API corriendo en `http://localhost:3000/api/v1` 🎉

---

## 🔑 Credenciales de Prueba

### 🏪 Bodega Don José
```
Email: admin@bodegadonjose.com
Password: Admin123!
Roles: Admin, Manager, Cashier disponibles
```

### 🔨 Ferretería El Martillo
```
Email: admin@ferreteriaelmartillo.com
Password: Martillo123!
```

### 💊 Farmacia San Lucas
```
Email: admin@farmaciasanlucas.com
Password: Farmacia123!
```

---

## 🌐 Conectar con tu Frontend

### Ejemplo Rápido (Fetch)
```javascript
// Login
const response = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@bodegadonjose.com',
    password: 'Admin123!'
  })
});

const { access_token, user } = await response.json();

// Usar token en siguientes requests
const products = await fetch('http://localhost:3000/api/v1/products', {
  headers: { 
    'Authorization': `Bearer ${access_token}` 
  }
});
```

### Ejemplo con Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1'
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'admin@bodegadonjose.com',
  password: 'Admin123!'
});

// Configurar token
api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

// Hacer requests
const products = await api.get('/products');
const sales = await api.get('/sales');
const stats = await api.get('/dashboard/stats');
```

---

## 📊 Endpoints Principales

### 🔐 Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar nueva empresa
- `GET /auth/profile` - Ver perfil

### 📦 Productos
- `GET /products` - Listar productos (con filtros)
- `POST /products` - Crear producto
- `GET /products/:id` - Ver detalle
- `PATCH /products/:id` - Actualizar
- `GET /products/barcode/:code` - Buscar por código
- `GET /products/low-stock` - Productos con stock bajo

### 👥 Clientes
- `GET /clients` - Listar clientes
- `POST /clients` - Crear cliente
- `GET /clients/:id` - Ver detalle
- `PATCH /clients/:id` - Actualizar

### 🛒 Ventas
- `GET /sales` - Listar ventas
- `POST /sales` - Registrar venta
- `GET /sales/:id` - Ver detalle
- `PATCH /sales/:id/cancel` - Cancelar venta

### 📈 Dashboard
- `GET /dashboard/stats` - Estadísticas del día
- `GET /dashboard/reports/sales` - Reporte de ventas (con fechas)

### 🏢 Empresas
- `GET /companies` - Listar empresas
- `GET /companies/:id` - Ver empresa
- `PATCH /companies/:id` - Actualizar empresa

---

## 📚 Documentación Completa

### 🌐 Swagger API Docs
Abre en tu navegador: `http://localhost:3000/api/docs`

**Incluye:**
- 📋 Todos los endpoints documentados
- 🧪 Pruebas interactivas
- 📊 Schemas de datos
- ✅ Ejemplos de request/response

### 📖 Guías Disponibles
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** ← **EMPIEZA AQUÍ**
  - Ejemplos completos de integración
  - Context de React con autenticación
  - Hooks personalizados
  - Manejo de errores
  
- **[MULTI_TENANT_GUIDE.md](./MULTI_TENANT_GUIDE.md)**
  - Arquitectura multi-empresa explicada
  - Flujo de datos completo
  - Validaciones de seguridad
  - Escenarios de uso

---

## 🎨 Identidad Visual

```css
/* Colores principales */
--color-primary: #10375C;    /* Azul Oscuro */
--color-secondary: #2AB7B7;  /* Turquesa */

/* Tipografía */
font-family: 'Inter', sans-serif;
```

---

## 🧪 Datos de Prueba Incluidos

### Bodega Don José (Retail - Abarrotes)
- 10 productos (Coca Cola, Arroz, Leche, etc.)
- 5 clientes registrados
- 5 ventas completadas
- 3 usuarios (Admin, Manager, Cashier)

### Ferretería El Martillo (Ferretería)
- 8 productos (Martillo, Cemento, Pintura, etc.)
- 3 clientes (incluye constructora)
- 3 ventas completadas
- 2 usuarios (Admin, Cashier)

### Farmacia San Lucas (Salud)
- 5 productos (Paracetamol, Vitaminas, etc.)
- 1 usuario (Admin)

**Total:** 23 productos, 8 clientes, 8 ventas, 6 usuarios

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run start:dev        # Iniciar con hot-reload
npm run build            # Compilar para producción
npm run start:prod       # Iniciar en producción

# Base de datos
npm run seed            # Cargar datos de prueba (IMPORTANTE)
npm run typeorm migration:run    # Ejecutar migraciones

# Calidad
npm run lint            # Verificar código
npm run format          # Formatear código
npm run test            # Ejecutar tests
```

---

## 🔧 Configuración del .env

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password_mysql
DB_DATABASE=negocio_ya

# JWT
JWT_SECRET=cambia_esto_por_algo_seguro
JWT_EXPIRES_IN=24h

# CORS (tu frontend)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:4200

# Puerto
PORT=3000
```

---

## 🎯 Características del Sistema

### Multi-Tenancy (Multi-Empresa)
- Cada empresa tiene sus datos completamente aislados
- Un usuario solo ve datos de su empresa
- SKU y códigos de barras únicos por empresa
- JWT incluye `companyId` para filtrado automático

### Roles y Permisos
- **ADMIN**: Control total de su empresa
- **MANAGER**: Gestión de productos y ventas
- **CASHIER**: Solo registro de ventas

### Seguridad
- JWT con expiración
- Contraseñas hasheadas con bcrypt
- Validación automática de DTOs
- CORS configurado
- Filtrado automático por empresa

---

## 📱 Probando desde tu Frontend

### 1. Verificar que el backend esté corriendo
```bash
curl http://localhost:3000/api/v1
```

### 2. Hacer login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bodegadonjose.com","password":"Admin123!"}'
```

### 3. Obtener productos (usa el token del paso anterior)
```bash
curl http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## ⚡ Solución Rápida de Problemas

### "Cannot connect to database"
```bash
# Verifica que MySQL esté corriendo
# Verifica las credenciales en .env
# Asegúrate de que la base de datos existe:
mysql -u root -p
CREATE DATABASE negocio_ya;
```

### "Port 3000 already in use"
```bash
# Cambia el puerto en .env
PORT=3001
```

### "No data in database"
```bash
# Ejecuta el seed
npm run seed
```

---

## 🚀 ¡Todo Listo!

Tu backend está **100% funcional** y listo para conectar con cualquier frontend:
- ✅ React / Next.js
- ✅ Vue / Nuxt
- ✅ Angular
- ✅ Svelte
- ✅ Mobile (React Native, Flutter)

**Próximo paso:** Lee [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) para ver ejemplos completos de integración.

---

**¿Preguntas? Revisa la documentación de Swagger en `http://localhost:3000/api/docs` 📚**
