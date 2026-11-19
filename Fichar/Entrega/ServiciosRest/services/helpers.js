const Service = require('./Service');

// Crea un error con código HTTP 404 para lanzarlo con throw.
const noEncontrado = (mensaje = 'El recurso no existe') => {
  const e = new Error(mensaje);
  e.status = 404;
  return e;
};

// Convierte cualquier excepción en la respuesta de error del stub,
// con el formato { message } que declaramos en el schema Mensaje.
const rechazar = (e) => {
  console.error('Error en servicio:', e.message);

  // Intentar borrar algo que otra tabla está usando (clave foránea)
  if (e.code === 'ER_ROW_IS_REFERENCED_2') {
    return Service.rejectResponse({ message: 'No se puede borrar: el registro está en uso' }, 409);
  }

  return Service.rejectResponse(
    { message: e.message || 'Error interno del servidor' },
    e.status || 500,
  );
};

module.exports = { noEncontrado, rechazar };
