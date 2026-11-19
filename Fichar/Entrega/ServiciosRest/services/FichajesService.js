/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('./db');
const { noEncontrado, rechazar } = require('./helpers');

// Consulta base: devuelve el fichaje con el nombre del usuario y del trabajo (JOIN).
const SELECT_FICHAJE = `
  SELECT f.IdFichaje, f.FechaHoraEntrada, f.FechaHoraSalida, f.HorasTrabajadas,
         f.IdTrabajo, f.IdUsuario, f.GeolocalizacionLatitud, f.GeolocalizacionLongitud,
         u.Nombre AS NombreUsuario, t.Nombre AS NombreTrabajo
  FROM Fichajes f
  LEFT JOIN Usuarios u ON u.IdUsuario = f.IdUsuario
  LEFT JOIN Trabajos t ON t.IdTrabajo = f.IdTrabajo`;

// Busca un fichaje por id; lanza 404 si no existe.
const buscarPorId = async (idFichaje) => {
  const [rows] = await db.query(`${SELECT_FICHAJE} WHERE f.IdFichaje = ?`, [idFichaje]);
  if (rows.length === 0) throw noEncontrado('El fichaje no existe');
  return rows[0];
};

// Si el usuario o el trabajo no existen (clave foránea), es un error del cliente: 400.
const rechazarFichaje = (e) => {
  if (e.code === 'ER_NO_REFERENCED_ROW_2') {
    return Service.rejectResponse({ message: 'El usuario o el trabajo indicado no existe' }, 400);
  }
  return rechazar(e);
};

/**
* Abre un fichaje (la entrada se pone con NOW() en el servidor)
*
* fichajeNuevo FichajeNuevo
* returns Fichaje
* */
const addFichaje = ({ body: fichaje }) => new Promise(
  async (resolve, reject) => {
    try {
      const [result] = await db.query(
        `INSERT INTO Fichajes
           (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud)
         VALUES (NOW(), ?, ?, ?, ?)`,
        [
          fichaje.IdTrabajo,
          fichaje.IdUsuario,
          fichaje.GeolocalizacionLatitud ?? null,
          fichaje.GeolocalizacionLongitud ?? null,
        ],
      );
      resolve(Service.successResponse(await buscarPorId(result.insertId), 201));
    } catch (e) {
      reject(rechazarFichaje(e));
    }
  },
);

/**
* Cierra un fichaje (salida = NOW() y cálculo de HorasTrabajadas)
*
* idFichaje Integer
* returns Fichaje
* */
const cerrarFichaje = ({ idFichaje }) => new Promise(
  async (resolve, reject) => {
    try {
      const actual = await buscarPorId(idFichaje);
      if (actual.FechaHoraSalida !== null) {
        const e = new Error('El fichaje ya está cerrado');
        e.status = 409;
        throw e;
      }
      // Las horas se redondean a la hora más cercana (la columna es integer).
      await db.query(
        `UPDATE Fichajes
            SET FechaHoraSalida = NOW(),
                HorasTrabajadas = ROUND(TIMESTAMPDIFF(SECOND, FechaHoraEntrada, NOW()) / 3600)
          WHERE IdFichaje = ?`,
        [idFichaje],
      );
      resolve(Service.successResponse(await buscarPorId(idFichaje)));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Borra un fichaje
*
* idFichaje Integer
* returns Mensaje
* */
const deleteFichaje = ({ idFichaje }) => new Promise(
  async (resolve, reject) => {
    try {
      const [result] = await db.query('DELETE FROM Fichajes WHERE IdFichaje = ?', [idFichaje]);
      if (result.affectedRows === 0) throw noEncontrado('El fichaje no existe');
      resolve(Service.successResponse({ message: 'Fichaje borrado' }));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Obtiene un fichaje por id
*
* idFichaje Integer
* returns Fichaje
* */
const getFichajeById = ({ idFichaje }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse(await buscarPorId(idFichaje)));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Lista fichajes con filtros opcionales
* Todos los filtros son opcionales y combinables.
*
* idUsuario Integer (optional)
* fechaDesde date (optional)  formato YYYY-MM-DD
* fechaHasta date (optional)  formato YYYY-MM-DD
* soloAbierto Boolean (optional)
* returns List
* */
const getFichajes = ({
  idUsuario, fechaDesde, fechaHasta, soloAbierto,
}) => new Promise(
  async (resolve, reject) => {
    try {
      const condiciones = [];
      const params = [];

      if (idUsuario !== undefined && idUsuario !== null && idUsuario !== '') {
        condiciones.push('f.IdUsuario = ?');
        params.push(idUsuario);
      }
      if (fechaDesde) {
        // Desde el inicio de ese día
        condiciones.push('f.FechaHoraEntrada >= ?');
        params.push(fechaDesde);
      }
      if (fechaHasta) {
        // Hasta el final de ese día (< día siguiente), así incluye todo el día "hasta"
        condiciones.push('f.FechaHoraEntrada < DATE_ADD(?, INTERVAL 1 DAY)');
        params.push(fechaHasta);
      }
      if (soloAbierto === true || soloAbierto === 'true') {
        condiciones.push('f.FechaHoraSalida IS NULL');
        condiciones.push('f.FechaHoraEntrada >= NOW() - INTERVAL 12 HOUR');
      }

      const where = condiciones.length > 0 ? ` WHERE ${condiciones.join(' AND ')}` : '';
      const [rows] = await db.query(
        `${SELECT_FICHAJE}${where} ORDER BY f.FechaHoraEntrada DESC`,
        params,
      );
      resolve(Service.successResponse(rows));
    } catch (e) {
      reject(rechazar(e));
    }
  },
);

/**
* Actualiza un fichaje completo (uso de administración)
*
* fichaje Fichaje
* returns Fichaje
* */
const updateFichaje = ({ body: fichaje }) => new Promise(
  async (resolve, reject) => {
    try {
      await db.query(
        `UPDATE Fichajes
            SET FechaHoraEntrada = ?, FechaHoraSalida = ?, HorasTrabajadas = ?,
                IdTrabajo = ?, IdUsuario = ?,
                GeolocalizacionLatitud = ?, GeolocalizacionLongitud = ?
          WHERE IdFichaje = ?`,
        [
          fichaje.FechaHoraEntrada,
          fichaje.FechaHoraSalida ?? null,
          fichaje.HorasTrabajadas ?? null,
          fichaje.IdTrabajo,
          fichaje.IdUsuario,
          fichaje.GeolocalizacionLatitud ?? null,
          fichaje.GeolocalizacionLongitud ?? null,
          fichaje.IdFichaje,
        ],
      );
      resolve(Service.successResponse(await buscarPorId(fichaje.IdFichaje)));
    } catch (e) {
      reject(rechazarFichaje(e));
    }
  },
);

module.exports = {
  addFichaje,
  cerrarFichaje,
  deleteFichaje,
  getFichajeById,
  getFichajes,
  updateFichaje,
};
