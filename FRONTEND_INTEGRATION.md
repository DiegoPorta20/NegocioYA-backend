# 🚀 Guía de Integración Frontend - NegocioYA

## 📋 Configuración del Backend

### URL Base de la API
```
http://localhost:3000/api/v1
```

### CORS Configurado
El backend acepta peticiones desde:
- `http://localhost:3000` (Next.js)
- `http://localhost:5173` (Vite/React)
- `http://localhost:4200` (Angular)

## 🔐 Autenticación

### 1. Registro de Nueva Empresa

**Endpoint:** `POST /auth/register`

```typescript
// Request
const response = await fetch('http://localhost:3000/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    companyName: 'Mi Negocio S.A.',
    businessId: '20123456789',
    companyEmail: 'empresa@example.com',
    companyPhone: '+51987654321',
    companyAddress: 'Av. Principal 123',
    industry: 'Retail',
    userEmail: 'admin@example.com',
    password: 'Admin123!',
    fullName: 'Juan Pérez'
  })
});

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

```typescript
// Request
const response = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@bodegadonjose.com',
    password: 'Admin123!'
  })
});

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@bodegadonjose.com",
    "fullName": "José Ramírez",
    "role": "ADMIN",
    "companyId": "uuid-company"
  }
}
```

### 3. Obtener Perfil

**Endpoint:** `GET /auth/profile`

```typescript
const response = await fetch('http://localhost:3000/api/v1/auth/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});
```

## 📊 Endpoints Principales

### Productos

```typescript
// Listar productos (filtrado automáticamente por empresa)
GET /products
GET /products?search=coca
GET /products?category=Bebidas
GET /products?lowStock=true

// Obtener producto por ID
GET /products/:id

// Buscar por código de barras
GET /products/barcode/:barcode

// Crear producto
POST /products
{
  "name": "Producto Nuevo",
  "sku": "PROD001",
  "barcode": "1234567890",
  "purchasePrice": 10.0,
  "salePrice": 15.0,
  "stock": 100,
  "minStock": 10,
  "category": "Categoría",
  "unit": "Unidad"
}

// Actualizar producto
PATCH /products/:id

// Eliminar producto (desactivar)
DELETE /products/:id

// Categorías
GET /products/categories

// Productos con stock bajo
GET /products/low-stock
```

### Clientes

```typescript
// Listar clientes
GET /clients
GET /clients?search=maria

// Obtener cliente
GET /clients/:id

// Crear cliente
POST /clients
{
  "fullName": "María González",
  "documentNumber": "12345678",
  "email": "maria@email.com",
  "phone": "+51987654321",
  "address": "Av. Principal 123"
}

// Actualizar cliente
PATCH /clients/:id

// Eliminar cliente
DELETE /clients/:id
```

### Ventas

```typescript
// Listar ventas
GET /sales
GET /sales?startDate=2024-01-01&endDate=2024-12-31
GET /sales?userId=uuid
GET /sales?clientId=uuid

// Obtener venta
GET /sales/:id

// Crear venta
POST /sales
{
  "clientId": "uuid-opcional",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 15.0
    }
  ],
  "paymentMethod": "CASH", // CASH | CARD | TRANSFER | OTHER
  "notes": "Nota opcional"
}

// Cancelar venta
PATCH /sales/:id/cancel
```

### Dashboard

```typescript
// Estadísticas generales
GET /dashboard/stats

Response:
{
  "todaySales": 5,
  "todayRevenue": 250.00,
  "todayProfit": 80.50,
  "lowStockProducts": 8,
  "totalProducts": 150,
  "totalClients": 320
}

// Reporte de ventas
GET /dashboard/reports/sales?startDate=2024-01-01&endDate=2024-12-31

Response:
{
  "totalSales": 125,
  "totalRevenue": 15380.50,
  "totalProfit": 4250.20,
  "salesByDay": [
    { "date": "2024-01-01", "sales": 5, "revenue": 250.00 }
  ],
  "topProducts": [
    { "productName": "Coca Cola 500ml", "quantity": 150, "revenue": 375.00 }
  ]
}
```

### Usuarios

```typescript
// Listar usuarios de tu empresa
GET /users

// Obtener usuario
GET /users/:id

// Crear usuario
POST /users
{
  "email": "nuevo@empresa.com",
  "password": "Password123!",
  "fullName": "Nuevo Usuario",
  "role": "CASHIER", // ADMIN | MANAGER | CASHIER
  "companyId": "uuid-tu-empresa"
}

// Actualizar usuario
PATCH /users/:id

// Eliminar usuario
DELETE /users/:id
```

### Empresas

```typescript
// Listar empresas (solo super admin)
GET /companies

// Obtener empresa
GET /companies/:id

// Actualizar empresa
PATCH /companies/:id

// Estadísticas de empresa
GET /companies/:id/stats
```

## 🎨 Identidad Visual

### Colores
```css
--color-primary: #10375C;    /* Azul Oscuro */
--color-secondary: #2AB7B7;  /* Turquesa */
--color-accent: #F4A261;     /* Naranja suave */
--color-success: #2AB7B7;
--color-error: #E63946;
--color-warning: #F4A261;
```

### Tipografía
```css
font-family: 'Inter', sans-serif;
```

## 🔑 Manejo de JWT

### Guardar Token
```typescript
// LocalStorage
localStorage.setItem('token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));

// O usar Context/Estado global
const [auth, setAuth] = useState({
  token: null,
  user: null
});
```

### Incluir Token en Requests
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

### Interceptor de Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 📝 Ejemplo de Uso en React

### Context de Autenticación
```typescript
// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  companyId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    
    setToken(access_token);
    setUser(user);
    
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        isAuthenticated: !!token 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Componente de Login
```typescript
// LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default LoginPage;
```

### Hook Personalizado para Productos
```typescript
// useProducts.ts
import { useState, useEffect } from 'react';
import api from './api';

interface Product {
  id: string;
  name: string;
  sku: string;
  salePrice: number;
  stock: number;
  category: string;
}

export const useProducts = (search?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = search ? `/products?search=${search}` : '/products';
        const response = await api.get(url);
        setProducts(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search]);

  return { products, loading, error };
};
```

## 🧪 Datos de Prueba

### Ejecutar Seed
```bash
npm run seed
```

### Credenciales de Prueba

**Bodega Don José:**
- Admin: `admin@bodegadonjose.com` / `Admin123!`
- Manager: `gerente@bodegadonjose.com` / `Admin123!`
- Cashier: `cajero@bodegadonjose.com` / `Admin123!`

**Ferretería El Martillo:**
- Admin: `admin@ferreteriaelmartillo.com` / `Martillo123!`
- Cashier: `vendedor@ferreteriaelmartillo.com` / `Martillo123!`

**Farmacia San Lucas:**
- Admin: `admin@farmaciasanlucas.com` / `Farmacia123!`

### Datos Incluidos en el Seed
- ✅ 3 empresas completas
- ✅ 6 usuarios con diferentes roles
- ✅ 23 productos variados
- ✅ 8 clientes
- ✅ 8 ventas registradas

## 🚀 Pasos para Iniciar

### 1. Configurar Backend
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=negocio_ya
JWT_SECRET=tu_secret_super_seguro
JWT_EXPIRES_IN=24h

# Ejecutar migraciones (crear tablas)
npm run typeorm migration:run

# Ejecutar seed (datos de prueba)
npm run seed

# Iniciar servidor
npm run start:dev
```

### 2. Verificar Backend
```bash
# API disponible en:
http://localhost:3000/api/v1

# Documentación Swagger:
http://localhost:3000/api/docs
```

### 3. Conectar Frontend
```typescript
// Configurar URL base
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Probar login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@bodegadonjose.com',
    password: 'Admin123!'
  })
});

const data = await response.json();
console.log('Token:', data.access_token);
```

## 📄 Swagger Documentation

**URL:** `http://localhost:3000/api/docs`

Swagger proporciona:
- 📋 Lista completa de endpoints
- 📝 Documentación de cada endpoint
- ✨ Pruebas interactivas
- 📊 Schemas de DTOs

## ⚠️ Consideraciones Importantes

1. **Multi-Tenancy**: Todos los datos están aislados por empresa (companyId en JWT)
2. **Roles**: 
   - `ADMIN`: Acceso total
   - `MANAGER`: Gestión de productos y ventas
   - `CASHIER`: Solo registro de ventas
3. **Validaciones**: Todos los DTOs tienen validación automática
4. **Errores**: Formato estándar en todas las respuestas de error
5. **CORS**: Ya configurado para localhost

## 🔗 Recursos Adicionales

- [Guía Multi-Tenant](./MULTI_TENANT_GUIDE.md) - Arquitectura detallada
- [Swagger Docs](http://localhost:3000/api/docs) - Documentación interactiva
- [README Principal](./README.md) - Información general del proyecto

---

**¡Tu frontend está listo para conectarse al backend! 🎉**
