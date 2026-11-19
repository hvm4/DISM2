CREATE DATABASE IF NOT EXISTS dism;
USE dism;

CREATE TABLE IF NOT EXISTS Usuarios (
  IdUsuario INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(100) NOT NULL,
  Usuario VARCHAR(50),
  Clave VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Trabajos (
  IdTrabajo INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS Fichajes (
  IdFichaje INT PRIMARY KEY AUTO_INCREMENT,
  FechaHoraEntrada DATETIME,
  FechaHoraSalida DATETIME NULL,
  HorasTrabajadas INT,
  IdTrabajo INT,
  IdUsuario INT,
  GeolocalizacionLatitud FLOAT,
  GeolocalizacionLongitud FLOAT,
  FOREIGN KEY (IdTrabajo) REFERENCES Trabajos(IdTrabajo),
  FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

CREATE TABLE IF NOT EXISTS ApiKey (
  idKey INT PRIMARY KEY AUTO_INCREMENT,
  `Key` VARCHAR(50) NOT NULL
);

INSERT INTO ApiKey (`Key`) VALUES ('clave-dism-2026');

-- Usuario de MySQL dedicado para la aplicación nodejs
-- (evita los problemas del usuario root en Ubuntu)
CREATE USER IF NOT EXISTS 'dism'@'localhost' IDENTIFIED BY 'Dism2026!';
GRANT ALL PRIVILEGES ON dism.* TO 'dism'@'localhost';
FLUSH PRIVILEGES;
