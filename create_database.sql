-- Script para crear la base de datos NegocioYA
-- Ejecuta este script en MySQL Workbench, phpMyAdmin, o tu cliente MySQL favorito

CREATE DATABASE IF NOT EXISTS negocio_ya 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE negocio_ya;

-- Verificar que la base de datos fue creada
SELECT 'Base de datos negocio_ya creada exitosamente!' AS resultado;
