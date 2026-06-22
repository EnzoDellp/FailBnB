CREATE DATABASE IF NOT EXISTS failbnbdb;
USE failbnbdb;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL DEFAULT '',
  email VARCHAR(100) NOT NULL UNIQUE,
  pass VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  es_anfitrion BOOLEAN DEFAULT FALSE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS propiedades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  direccion VARCHAR(255),
  cant_habitaciones INT DEFAULT 1,
  cant_baños INT DEFAULT 1,
  capacidad_max INT NOT NULL,
  precio_noche DECIMAL(10,2) NOT NULL,
  fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  ubicacion VARCHAR(100) DEFAULT 'Desconocida',
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS imagenes_propiedad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_propiedad INT NOT NULL,
  url_imagen LONGTEXT NOT NULL,
  FOREIGN KEY (id_propiedad) REFERENCES propiedades(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_propiedad INT NOT NULL,
  fecha_ingreso DATE NOT NULL,
  fecha_egreso DATE NOT NULL,
  cantidad_viajeros INT NOT NULL,
  fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_propiedad) REFERENCES propiedades(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS disponibilidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_propiedad INT NOT NULL,
  fecha DATE NOT NULL,
  disponible BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_propiedad) REFERENCES propiedades(id) ON DELETE CASCADE,
  UNIQUE (id_propiedad, fecha)
);
