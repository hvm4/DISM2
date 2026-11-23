const db = require('./db');

const comprobarApiKey = async (req) => {
  const clave = req.headers['x-api-key'];
  if (clave) {
    const [rows] = await db.query('SELECT idKey FROM ApiKey WHERE `Key` = ?', [clave]);
    if (rows.length > 0) return true;
  }
  const e = new Error('ApiKey no válida o ausente');
  e.status = 401;
  throw e;
};

module.exports = { comprobarApiKey };