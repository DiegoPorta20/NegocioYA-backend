# 🎨 NegocioYA Backend - Sistema de Gestión Empresarial

Backend profesional desarrollado con NestJS, TypeScript y MySQL para el sistema de gestión empresarial **NegocioYA**.

## 🎯 Características Principales

- ✅ **Arquitectura Limpia**: Código organizado siguiendo las mejores prácticas de NestJS
- ✅ **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad
- ✅ **MySQL + TypeORM**: Base de datos relacional con ORM robusto
- ✅ **Autenticación JWT**: Sistema seguro de autenticación y autorización
- ✅ **Validación**: DTOs con class-validator para validación robusta
- ✅ **Documentación Swagger**: API completamente documentada
- ✅ **Manejo de Errores**: Filtros globales para respuestas consistentes
- ✅ **Logging**: Sistema de logs para debugging y monitoreo
- ✅ **CORS**: Configurado para integración con frontend Angular

## 🎨 Identidad Visual

- **Azul Oscuro**: `#10375C` - Confianza y estructura
- **Turquesa**: `#2AB7B7` - Acción y dinamismo
- **Tipografía**: Inter (profesional y moderna)

## 📦 Módulos Implementados

### 🔐 Autenticación
- Login con JWT
- Protección de rutas
- Control de roles (Admin, Manager, Cashier)

### 👥 Usuarios
- CRUD completo
- Roles y permisos
- Gestión de estado activo/inactivo

### 📦 Productos
- Gestión de inventario
- Códigos de barras y SKU
- Alertas de stock bajo
- Categorías
- Precios de compra y venta

### 👤 Clientes
- Registro de clientes
- Búsqueda y filtros
- Historial de compras

### 💰 Ventas
- Proceso de venta rápido
- Múltiples métodos de pago
- Control de stock automático
- Cálculo de ganancias
- Cancelación de ventas

### 📊 Dashboard
- Estadísticas en tiempo real
- Ventas del día
- Productos con stock bajo
- Reportes de ventas por período
- Productos más vendidos

## 🚀 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- MySQL (v8 o superior)
- npm o yarn

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

3. **Crear base de datos MySQL**
```sql
CREATE DATABASE negocioya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📚 Documentación API

Una vez iniciado el servidor, accede a:
```
http://localhost:3000/api/docs
```

## 🗄️ Estructura del Proyecto

```
src/
├── auth/                   # Módulo de autenticación
│   ├── decorators/        # Decoradores personalizados
│   ├── dto/               # DTOs de autenticación
│   ├── guards/            # Guards de JWT y Roles
│   └── strategies/        # Estrategias de Passport
├── users/                 # Módulo de usuarios
├── products/              # Módulo de productos
├── clients/               # Módulo de clientes
├── sales/                 # Módulo de ventas
├── dashboard/             # Módulo de dashboard y reportes
├── config/                # Configuraciones globales
├── common/                # Recursos compartidos
│   ├── filters/          # Filtros de excepciones
│   └── interceptors/     # Interceptores globales
└── main.ts               # Punto de entrada
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Modo watch
npm run start:debug        # Modo debug

# Producción
npm run build              # Compilar
npm run start:prod         # Ejecutar compilado

# Testing
npm run test               # Tests unitarios
npm run test:e2e           # Tests e2e
npm run test:cov           # Coverage

# Linting
npm run lint               # Linter
npm run format             # Formatear código
```

## 🔐 Roles y Permisos

### Admin
- Acceso total al sistema
- Gestión de usuarios
- Configuraciones globales

### Manager
- Gestión de productos
- Gestión de clientes
- Reportes completos

### Cashier
- Registro de ventas
- Consulta de productos
- Consulta de clientes

## 🌐 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/profile` - Obtener perfil

### Productos
- `GET /api/v1/products` - Listar productos
- `POST /api/v1/products` - Crear producto
- `GET /api/v1/products/barcode/:barcode` - Buscar por código
- `GET /api/v1/products/low-stock` - Productos con stock bajo

### Ventas
- `POST /api/v1/sales` - Registrar venta
- `GET /api/v1/sales` - Listar ventas
- `PATCH /api/v1/sales/:id/cancel` - Cancelar venta

### Dashboard
- `GET /api/v1/dashboard/stats` - Estadísticas
- `GET /api/v1/dashboard/reports/sales` - Reporte de ventas

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT con expiración configurable
- Validación de datos en todas las entradas
- CORS configurado
- Guards para protección de rutas
- Rate limiting (recomendado para producción)

## 📈 Próximas Funcionalidades

- [ ] Reportes en PDF
- [ ] Notificaciones push
- [ ] Integración con sistemas de pago
- [ ] Multi-empresa
- [ ] Facturación electrónica
- [ ] Backup automático

## 🤝 Contribución

Este es un proyecto profesional. Para contribuir:

1. Mantén el código limpio y documentado
2. Sigue las convenciones de NestJS
3. Escribe tests para nuevas funcionalidades
4. Actualiza la documentación

## 📝 Licencia

UNLICENSED - Propiedad privada de NegocioYA

## 👨‍💻 Desarrollado por

**NegocioYA Team** - Sistema profesional de gestión empresarial

---

**Tech Stack**: NestJS · TypeScript · MySQL · TypeORM · JWT · Swagger · Class Validator

🚀 **NegocioYA** - Software profesional, no app improvisada.
