-- Esquema inicial para Hernandezlab
CREATE DATABASE IF NOT EXISTS hernandezlab_db CHARACTER SET utf8mb4;
USE hernandezlab_db;


CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'rrhh', 'inventario') NOT NULL DEFAULT 'rrhh',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30),
  position VARCHAR(100),
  department VARCHAR(100),
  hire_date DATE,
  status ENUM('activo', 'vacaciones', 'inactivo') NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category ENUM('insumo', 'reactivo') NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(30) NOT NULL DEFAULT 'unidad',
  min_stock INT NOT NULL DEFAULT 0,
  expiration_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
