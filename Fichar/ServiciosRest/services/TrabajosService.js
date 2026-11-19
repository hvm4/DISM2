/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('./db');
const { noEncontrado, rechazar } = require('./helpers');

/**
* Crea un trabajo
*
* trabajo Trabajo
* returns Trabajo
* */
const addTrabajo = ({ body: trabajo }) => new Promise(
  async (resolve, reject) => {
    try {
      const [result] = await db.query(
        'INSERT INTO Trabajos (Nombre) VALUES (?)',
        [trabajo.Nombre],
      );
      resolve(Service.successResponse(
        { IdTrabajo: result.insertId, Nombre: trabajo.Nombre },
        201,
      ));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Borra un trabajo
*
* idTrabajo Integer
* returns Mensaje
* */
const deleteTrabajo = ({ idTrabajo }) => new Promise(
  async (resolve, reject) => {
    try {
      const [result] = await db.query(
        'DELETE FROM Trabajos WHERE IdTrabajo = ?',
        [idTrabajo],
      );
      if (result.affectedRows === 0) throw noEncontrado('El trabajo no existe');
      resolve(Service.successResponse({ message: 'Trabajo borrado' }));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Obtiene un trabajo por id
*
* idTrabajo Integer
* returns Trabajo
* */
const getTrabajoById = ({ idTrabajo }) => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Trabajos WHERE IdTrabajo = ?',
        [idTrabajo],
      );
      if (rows.length === 0) throw noEncontrado('El trabajo no existe');
      resolve(Service.successResponse(rows[0]));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Lista todos los trabajos
*
* returns List
* */
const getTrabajos = () => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query('SELECT * FROM Trabajos ORDER BY Nombre');
      resolve(Service.successResponse(rows));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Actualiza un trabajo (el id va en el body)
*
* trabajo Trabajo
* returns Trabajo
* */
const updateTrabajo = ({ body: trabajo }) => new Promise(
  async (resolve, reject) => {
    try {
      await db.query(
        'UPDATE Trabajos SET Nombre = ? WHERE IdTrabajo = ?',
        [trabajo.Nombre, trabajo.IdTrabajo],
      );
      // Se vuelve a leer: así distinguimos "no existe" de "no ha cambiado nada"
      const [rows] = await db.query(
        'SELECT * FROM Trabajos WHERE IdTrabajo = ?',
        [trabajo.IdTrabajo],
      );
      if (rows.length === 0) throw noEncontrado('El trabajo no existe');
      resolve(Service.successResponse(rows[0]));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

module.exports = {
  addTrabajo,
  deleteTrabajo,
  getTrabajoById,
  getTrabajos,
  updateTrabajo,
};
