/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Valida usuario y clave contra la tabla Usuarios
*
* loginRequest LoginRequest 
* returns LoginResponse
* */
const login = ({ loginRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        loginRequest,
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
  login,
};
