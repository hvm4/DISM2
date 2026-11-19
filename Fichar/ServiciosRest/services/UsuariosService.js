/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('./db');
const { noEncontrado, rechazar } = require('./helpers');

/**
* Crea un usuario
*
* usuario Usuario
* returns Usuario
* */
const addUsuario = ({ body: usuario }) => new Promise(
  async (resolve, reject) => {
    try {
      // ?? null: mysql2 rechaza los valores undefined, y Usuario/Clave son opcionales
      const [result] = await db.query(
        'INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)',
        [usuario.Nombre, usuario.Usuario ?? null, usuario.Clave ?? null],
      );
      resolve(Service.successResponse(
        {
          IdUsuario: result.insertId,
          Nombre: usuario.Nombre,
          Usuario: usuario.Usuario ?? null,
          Clave: usuario.Clave ?? null,
        },
        201,
      ));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Borra un usuario
*
* idUsuario Integer
* returns Mensaje
* */
const deleteUsuario = ({ idUsuario }) => new Promise(
  async (resolve, reject) => {
    try {
      const [result] = await db.query(
        'DELETE FROM Usuarios WHERE IdUsuario = ?',
        [idUsuario],
      );
      if (result.affectedRows === 0) throw noEncontrado('El usuario no existe');
      resolve(Service.successResponse({ message: 'Usuario borrado' }));
    } catch (e) {
      // Si tiene fichajes, helpers.js lo convierte en un 409 "en uso"
      reject(rechazar(e));
    }
  },
);

/**
* Obtiene un usuario por id
*
* idUsuario Integer
* returns Usuario
* */
const getUsuarioById = ({ idUsuario }) => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Usuarios WHERE IdUsuario = ?',
        [idUsuario],
      );
      if (rows.length === 0) throw noEncontrado('El usuario no existe');
      resolve(Service.successResponse(rows[0]));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Lista todos los usuarios
*
* returns List
* */
const getUsuarios = () => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query('SELECT * FROM Usuarios ORDER BY Nombre');
      resolve(Service.successResponse(rows));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Actualiza un usuario (el id va en el body)
*
* usuario Usuario
* returns Usuario
* */
const updateUsuario = ({ body: usuario }) => new Promise(
  async (resolve, reject) => {
    try {
      await db.query(
        'UPDATE Usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?',
        [usuario.Nombre, usuario.Usuario ?? null, usuario.Clave ?? null, usuario.IdUsuario],
      );
      const [rows] = await db.query(
        'SELECT * FROM Usuarios WHERE IdUsuario = ?',
        [usuario.IdUsuario],
      );
      if (rows.length === 0) throw noEncontrado('El usuario no existe');
      resolve(Service.successResponse(rows[0]));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

module.exports = {
  addUsuario,
  deleteUsuario,
  getUsuarioById,
  getUsuarios,
  updateUsuario,
};
