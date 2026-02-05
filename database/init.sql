-- ================================================
-- Script de inicialización - NegocioYA Database
-- ================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS negocioya_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE negocioya_db;

-- ================================================
-- NOTA: Las tablas se crearán automáticamente
-- con TypeORM synchronize en modo desarrollo
-- ================================================

-- Este script contiene datos de ejemplo iniciales
-- Ejecutar DESPUÉS de iniciar la aplicación por primera vez

-- Usuario administrador por defecto
-- Email: admin@negocioya.com
-- Password: Admin123!
-- (Se debe crear desde la aplicación o usando el endpoint de registro)

-- ================================================
-- Datos de ejemplo para productos
-- ================================================

INSERT INTO products (id, name, description, sku, barcode, purchasePrice, salePrice, stock, minStock, category, unit, isActive, createdAt, updatedAt) VALUES
(UUID(), 'Coca Cola 2L', 'Bebida gaseosa 2 litros', 'BEB-001', '7501055309788', 15.00, 25.00, 50, 10, 'Bebidas', 'unidad', 1, NOW(), NOW()),
(UUID(), 'Arroz Blanco 1kg', 'Arroz blanco premium', 'ALI-001', '7501234567890', 12.00, 18.00, 100, 20, 'Alimentos', 'kg', 1, NOW(), NOW()),
(UUID(), 'Aceite de Cocina 1L', 'Aceite vegetal 1 litro', 'ALI-002', '7502345678901', 25.00, 35.00, 30, 5, 'Alimentos', 'litro', 1, NOW(), NOW()),
(UUID(), 'Pan de Molde', 'Pan de molde integral', 'PAN-001', '7503456789012', 8.00, 15.00, 25, 10, 'Panadería', 'unidad', 1, NOW(), NOW()),
(UUID(), 'Leche Entera 1L', 'Leche entera pasteurizada', 'LAC-001', '7504567890123', 10.00, 16.00, 40, 15, 'Lácteos', 'litro', 1, NOW(), NOW()),
(UUID(), 'Jabón Líquido 500ml', 'Jabón líquido antibacterial', 'LIM-001', '7505678901234', 18.00, 28.00, 20, 5, 'Limpieza', 'unidad', 1, NOW(), NOW()),
(UUID(), 'Papel Higiénico x4', 'Papel higiénico doble hoja', 'HIG-001', '7506789012345', 12.00, 20.00, 60, 15, 'Higiene', 'paquete', 1, NOW(), NOW()),
(UUID(), 'Azúcar Blanca 1kg', 'Azúcar refinada', 'ALI-003', '7507890123456', 10.00, 15.00, 80, 20, 'Alimentos', 'kg', 1, NOW(), NOW()),
(UUID(), 'Café Soluble 200g', 'Café instantáneo premium', 'BEB-002', '7508901234567', 35.00, 50.00, 25, 8, 'Bebidas', 'unidad', 1, NOW(), NOW()),
(UUID(), 'Detergente 1kg', 'Detergente en polvo', 'LIM-002', '7509012345678', 22.00, 32.00, 35, 10, 'Limpieza', 'kg', 1, NOW(), NOW());

-- ================================================
-- Datos de ejemplo para clientes
-- ================================================

INSERT INTO clients (id, fullName, documentNumber, email, phone, address, isActive, createdAt, updatedAt) VALUES
(UUID(), 'Cliente Genérico', NULL, NULL, NULL, NULL, 1, NOW(), NOW()),
(UUID(), 'María García López', '12345678', 'maria.garcia@email.com', '555-0101', 'Calle Principal 123', 1, NOW(), NOW()),
(UUID(), 'Juan Pérez Rodríguez', '87654321', 'juan.perez@email.com', '555-0102', 'Avenida Central 456', 1, NOW(), NOW()),
(UUID(), 'Ana Martínez Silva', '11223344', 'ana.martinez@email.com', '555-0103', 'Calle Secundaria 789', 1, NOW(), NOW()),
(UUID(), 'Carlos Gómez Torres', '44332211', 'carlos.gomez@email.com', '555-0104', 'Boulevard Norte 321', 1, NOW(), NOW());

-- ================================================
-- Instrucciones de uso
-- ================================================

/*
1. Ejecutar este script DESPUÉS de iniciar la aplicación por primera vez
2. La aplicación creará las tablas automáticamente con TypeORM
3. Crear el primer usuario administrador usando el endpoint POST /api/v1/users
   {
     "email": "admin@negocioya.com",
     "fullName": "Administrador",
     "password": "Admin123!",
     "role": "admin"
   }
4. Usar ese usuario para hacer login y obtener el token JWT
5. Con el token, podrás acceder a todos los endpoints protegidos

IMPORTANTE:
- Cambiar las contraseñas en producción
- Configurar variables de entorno correctamente
- NO usar synchronize: true en producción
*/

-- ================================================
-- Consultas útiles para verificación
-- ================================================

-- Ver todos los productos
-- SELECT * FROM products WHERE isActive = 1;

-- Ver productos con stock bajo
-- SELECT name, stock, minStock FROM products WHERE stock <= minStock AND isActive = 1;

-- Ver todos los clientes
-- SELECT * FROM clients WHERE isActive = 1;

-- Ver ventas del día
-- SELECT * FROM sales WHERE DATE(createdAt) = CURDATE();

-- Ver total de ventas del día
-- SELECT COUNT(*) as cantidad, SUM(total) as total FROM sales WHERE DATE(createdAt) = CURDATE() AND status = 'completed';
