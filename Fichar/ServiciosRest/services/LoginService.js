/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('./db');
const { rechazar } = require('./helpers');

/**
* Valida usuario y clave contra la tabla Usuarios
*
* loginRequest LoginRequest
* returns LoginResponse
* */
const login = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query(
        'SELECT IdUsuario, Nombre FROM Usuarios WHERE Usuario = ? AND Clave = ?',
        [body.Usuario, body.Clave],
      );
      if (rows.length === 0) {
        const e = new Error('Usuario o clave incorrectos');
        e.status = 401;
        throw e;
      }
      resolve(Service.successResponse(rows[0]));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

module.exports = {
  login,
};