# 🔄 Refactorización: Sistema de Roles y Permisos

## 📋 Resumen de Cambios

Se ha refactorizado completamente el sistema de roles del backend, migrando de un sistema basado en **ENUM** a un sistema de **Base de Datos con Tablas Separadas** y soporte completo para **RBAC (Role-Based Access Control)** con permisos granulares.

---

## 🎯 Objetivo de la Refactorización

**Antes:** Los roles (ADMIN, MANAGER, CASHIER) estaban hardcodeados en el código como un enum, lo que limitaba la flexibilidad y escalabilidad del sistema.

**Ahora:** Los roles y permisos están en la base de datos, permitiendo:
- ✅ Crear roles personalizados dinámicamente
- ✅ Asignar permisos granulares por módulo y acción
- ✅ Escalar el sistema sin modificar código
- ✅ Gestionar acceso a nivel de interfaz de usuario

---

## 🏗️ Arquitectura del Sistema RBAC

### Entidades Principales

#### 1. **Role** (`roles` table)
```typescript
{
  id: UUID
  name: string           // 'ADMIN', 'MANAGER', 'CASHIER', 'VENDEDOR', etc.
  displayName: string    // 'Administrador', 'Gerente', 'Cajero'
  description: string
  isSystem: boolean      // true para roles predefinidos (no se pueden eliminar)
  permissions: Permission[]  // Relación many-to-many
}
```

#### 2. **Permission** (`permissions` table)
```typescript
{
  id: UUID
  name: string          // 'products:create', 'sales:read', etc.
  displayName: string   // 'Crear Productos', 'Ver Ventas'
  description: string
  module: PermissionModule   // users, products, clients, sales, dashboard, etc.
  action: PermissionAction   // create, read, update, delete, manage
}
```

#### 3. **User** (modificado)
```typescript
{
  ...usuarios existentes
  roleId: UUID          // Foreign key a tabla roles (NUEVO)
  role: Role           // Relación eager con Role (NUEVO)
}
```

### Relaciones

```
roles ←→ permissions (many-to-many via role_permissions)
roles → users (one-to-many)
```

---

## 📝 Módulos y Acciones Disponibles

### Módulos del Sistema
- `users` - Gestión de usuarios
- `products` - Gestión de productos
- `clients` - Gestión de clientes
- `sales` - Gestión de ventas
- `dashboard` - Visualización de estadísticas
- `reports` - Generación de reportes
- `companies` - Gestión de empresas
- `settings` - Configuración del sistema

### Acciones Disponibles
- `create` - Crear nuevos registros
- `read` - Leer/Consultar registros
- `update` - Actualizar registros existentes
- `delete` - Eliminar registros
- `manage` - Acceso completo al módulo

### Formato de Permisos
```
"module:action"

Ejemplos:
- "products:create"   → Crear productos
- "sales:read"        → Ver ventas
- "users:manage"      → Gestión completa de usuarios
- "dashboard:read"    → Acceder al dashboard
```

---

## 👥 Roles del Sistema Predefinidos

### 🔴 ADMIN (Administrador)
- **Permisos:** TODOS (24 permisos)
- **Descripción:** Acceso total al sistema
- **Uso:** Dueño de la empresa, super usuario
- **isSystem:** true (no se puede eliminar)

### 🟡 MANAGER (Gerente)
- **Permisos:**
  - `products:manage` - Gestión completa de productos
  - `clients:manage` - Gestión completa de clientes
  - `sales:manage` - Gestión completa de ventas
  - `dashboard:read` - Ver estadísticas
  - `reports:read` - Ver reportes
  - `users:read` - Consultar usuarios
- **Descripción:** Gestión de operaciones diarias
- **Uso:** Gerente, encargado de tienda
- **isSystem:** true

### 🟢 CASHIER (Cajero)
- **Permisos:**
  - `products:read` - Consultar productos
  - `clients:read` - Consultar clientes
  - `clients:create` - Crear clientes nuevos
  - `sales:create` - Registrar ventas
  - `sales:read` - Consultar ventas
- **Descripción:** Registro de ventas y consulta básica
- **Uso:** Cajero, vendedor
- **isSystem:** true

---

## 🚀 Comandos de Seed

### 1. Seed de Roles y Permisos (OBLIGATORIO - ejecutar primero)
```bash
npm run seed:roles
```

**Crea:**
- 3 roles del sistema (ADMIN, MANAGER, CASHIER)
- 24 permisos predefinidos
- Relaciones role-permissions

**Output esperado:**
```
✅ 24 permisos creados o verificados
✅ Rol ADMIN creado con todos los permisos
✅ Rol MANAGER creado
✅ Rol CASHIER creado
```

### 2. Seed de Datos de Prueba
```bash
npm run seed
```

**Crea:**
- 3 empresas de prueba
- 6 usuarios (con roleId asociado)
- 23 productos
- 8 clientes
- 8 ventas

**Requiere:** Ejecutar `seed:roles` primero

---

## 🔐 Credenciales de Prueba

### 📦 Bodega Don José
```
Admin:   admin@bodegadonjose.com / Admin123!
Manager: gerente@bodegadonjose.com / Admin123!
Cashier: cajero@bodegadonjose.com / Admin123!
```

### 🔨 Ferretería El Martillo
```
Admin:   admin@ferreteriaelmartillo.com / Martillo123!
Cashier: vendedor@ferreteriaelmartillo.com / Martillo123!
```

### 💊 Farmacia San Lucas
```
Admin:   admin@farmaciasanlucas.com / Farmacia123!
```

---

## 🛠️ Nuevos Endpoints de API

### Gestión de Roles

#### Listar todos los roles
```http
GET /roles
Authorization: Bearer {token}
```

#### Obtener un rol específico
```http
GET /roles/:id
Authorization: Bearer {token}
```

#### Crear un rol personalizado
```http
POST /roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "VENDEDOR",
  "displayName": "Vendedor de Piso",
  "description": "Vendedor con acceso limitado",
  "permissionIds": [
    "uuid-permission-products-read",
    "uuid-permission-clients-read",
    "uuid-permission-sales-create"
  ]
}
```

#### Actualizar permisos de un rol
```http
PATCH /roles/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "Vendedor Senior",
  "permissionIds": [
    "uuid-permission-products-read",
    "uuid-permission-products-create",
    "uuid-permission-clients-manage",
    "uuid-permission-sales-manage"
  ]
}
```

#### Eliminar un rol
```http
DELETE /roles/:id
Authorization: Bearer {token}
```

**Nota:** Los roles con `isSystem: true` no se pueden eliminar.

#### Listar todos los permisos disponibles
```http
GET /roles/permissions
Authorization: Bearer {token}
```

#### Verificar permiso de un rol
```http
GET /roles/:id/has-permission?permission=products:create
Authorization: Bearer {token}
```

---

## 🔒 Uso de Guards

### En Controladores

**Antes:**
```typescript
import { UserRole } from '../users/entities/user.entity';

@Roles(UserRole.ADMIN)
@Delete(':id')
remove(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

**Ahora:**
```typescript
@Roles('ADMIN')  // String en lugar de enum
@Delete(':id')
remove(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

### Múltiples Roles
```typescript
@Roles('ADMIN', 'MANAGER')
@Get('statistics')
getStatistics() {
  return this.service.getStatistics();
}
```

---

## 🔍 Verificación de Permisos en Servicios

Si necesitas verificar permisos programáticamente:

```typescript
constructor(private readonly rolesService: RolesService) {}

async someMethod(userId: string) {
  const user = await this.usersRepository.findOne({
    where: { id: userId },
    relations: ['role', 'role.permissions']
  });

  const hasPermission = await this.rolesService.hasPermission(
    user.role.id,
    'products:create'
  );

  if (!hasPermission) {
    throw new ForbiddenException('No tienes permiso para crear productos');
  }

  // ... continuar con la lógica
}
```

---

## 📊 Beneficios de la Refactorización

### ✅ Escalabilidad
- Agregar nuevos roles sin modificar código
- Crear roles personalizados por empresa
- Ajustar permisos dinámicamente

### ✅ Seguridad Mejorada
- Control granular de acceso
- Permisos a nivel de acción
- Auditoría de cambios en roles

### ✅ Mantenibilidad
- Roles y permisos en base de datos
- No requiere despliegue para cambios de permisos
- Gestión desde interfaz de usuario

### ✅ Flexibilidad
- Roles personalizados por industria
- Permisos específicos por módulo
- Extensible a futuros módulos

---

## 🧪 Testing

### Verificar que el servidor inicia correctamente
```bash
npm run start:dev
```

### Probar login con nuevos roles
```bash
# Probar login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bodegadonjose.com",
    "password": "Admin123!"
  }'

# Respuesta esperada: JWT con payload que incluye roleId y role.name
```

### Compilar el proyecto
```bash
npm run build
```

---

## 📚 Archivos Modificados

### Nuevas Entidades
- ✅ `src/roles/entities/role.entity.ts`
- ✅ `src/roles/entities/permission.entity.ts`

### Nuevos DTOs
- ✅ `src/roles/dto/create-role.dto.ts`
- ✅ `src/roles/dto/update-role.dto.ts`

### Nuevos Servicios
- ✅ `src/roles/roles.service.ts`
- ✅ `src/roles/roles.controller.ts`
- ✅ `src/roles/roles.module.ts`

### Archivos Modificados
- 🔄 `src/users/entities/user.entity.ts` (eliminado enum, agregado roleId)
- 🔄 `src/users/dto/create-user.dto.ts` (roleId en lugar de role enum)
- 🔄 `src/auth/auth.service.ts` (usa RolesService)
- 🔄 `src/auth/guards/roles.guard.ts` (compara role.name)
- 🔄 `src/auth/decorators/roles.decorator.ts` (acepta strings)
- 🔄 `src/users/users.controller.ts` (@Roles con strings)
- 🔄 `src/companies/companies.controller.ts` (@Roles con strings)

### Nuevos Scripts de Seed
- ✅ `src/database/seed-roles.ts` (seed de roles y permisos)
- 🔄 `src/database/seed.ts` (actualizado para usar roleId)

---

## 🎨 Integración con Frontend

### Obtener permisos del usuario actual
```typescript
// Al hacer login, el JWT incluye:
{
  sub: "user-uuid",
  email: "admin@bodegadonjose.com",
  companyId: "company-uuid",
  role: "ADMIN"  // Nombre del rol
}

// Luego puedes obtener los permisos detallados:
GET /roles/:roleId/permissions
```

### Mostrar/ocultar elementos de UI
```typescript
// Ejemplo en React/Angular
const hasPermission = (permission: string) => {
  return userPermissions.some(p => p.name === permission);
};

// Uso en componentes
{hasPermission('products:create') && (
  <Button onClick={createProduct}>Crear Producto</Button>
)}
```

---

## 🚨 Notas Importantes

1. **Ejecutar seeds en orden:**
   ```bash
   npm run seed:roles    # PRIMERO
   npm run seed          # SEGUNDO
   ```

2. **Los roles del sistema no se pueden eliminar** (`isSystem: true`)

3. **La relación Role → User es eager**, por lo que el rol se carga automáticamente al obtener un usuario

4. **Los JWT incluyen el nombre del rol** para verificación rápida en guards

5. **Backward compatibility:** El enum UserRole se eliminó completamente, ahora se usan strings

---

## 📧 Contacto y Soporte

Para dudas o problemas con el sistema de roles:
- Revisar logs del servidor
- Verificar que los seeds se ejecutaron correctamente
- Comprobar permisos en la base de datos
- Validar que el JWT contiene el roleId correcto

---

## ✨ Próximos Pasos Sugeridos

1. **Crear interfaz de gestión de roles** en el frontend
2. **Implementar auditoría** de cambios en roles y permisos
3. **Agregar permisos por recursos específicos** (ej: editar solo mis ventas)
4. **Crear roles por empresa** (multi-tenant a nivel de roles)
5. **Implementar cache de permisos** para optimizar consultas

---

**Última actualización:** 06 de Febrero, 2026
**Versión del Sistema:** 2.0.0 (Sistema RBAC Completo)
