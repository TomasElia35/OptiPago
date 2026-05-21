const { getPool, sql } = require('../database/mssqlClient');

class SqlBancoBilleteraRepository {
  async findIdByName(nombre) {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre', sql.VarChar, `%${nombre}%`)
      .query(`
        SELECT TOP 1 id 
        FROM bancos_billeteras 
        WHERE nombre LIKE @nombre AND activo = 1
      `);
      
    if (result.recordset.length > 0) {
      return result.recordset[0].id;
    }
    return null;
  }
}

module.exports = SqlBancoBilleteraRepository;
