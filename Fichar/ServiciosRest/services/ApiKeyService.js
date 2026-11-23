/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('./db');
const { noEncontrado, rechazar } = require('./helpers');

const addApiKey = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const [result] = await db.query(
        'INSERT INTO ApiKey (`Key`) VALUES (?)',
        [body.Key],
      );
      resolve(Service.successResponse({ idKey: result.insertId, Key: body.Key }, 201));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

const deleteApiKey = ({ idKey }) => new Promise(
  async (resolve, reject) => {
    try {
      const [result] = await db.query('DELETE FROM ApiKey WHERE idKey = ?', [idKey]);
      if (result.affectedRows === 0) throw noEncontrado('La clave no existe');
      resolve(Service.successResponse({ message: 'Clave borrada' }));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

const getApiKeyById = ({ idKey }) => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query('SELECT idKey, `Key` FROM ApiKey WHERE idKey = ?', [idKey]);
      if (rows.length === 0) throw noEncontrado('La clave no existe');
      resolve(Service.successResponse(rows[0]));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

const getApiKeys = () => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query('SELECT idKey, `Key` FROM ApiKey ORDER BY idKey');
      resolve(Service.successResponse(rows));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

const updateApiKey = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const [result] = await db.query(
        'UPDATE ApiKey SET `Key` = ? WHERE idKey = ?',
        [body.Key, body.idKey],
      );
      if (result.affectedRows === 0) throw noEncontrado('La clave no existe');
      resolve(Service.successResponse({ idKey: body.idKey, Key: body.Key }));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

module.exports = {
  addApiKey,
  deleteApiKey,
  getApiKeyById,
  getApiKeys,
  updateApiKey,
};