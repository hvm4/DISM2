/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Crea una clave de API
*
* apiKey ApiKey 
* returns ApiKey
* */
const addApiKey = ({ apiKey }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiKey,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Borra una clave de API
*
* idKey Integer 
* returns Mensaje
* */
const deleteApiKey = ({ idKey }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        idKey,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtiene una clave por id
*
* idKey Integer 
* returns ApiKey
* */
const getApiKeyById = ({ idKey }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        idKey,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Lista las claves de API
*
* returns List
* */
const getApiKeys = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Actualiza una clave de API (el id va en el body)
*
* apiKey ApiKey 
* returns ApiKey
* */
const updateApiKey = ({ apiKey }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiKey,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
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
