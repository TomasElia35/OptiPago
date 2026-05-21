const { getPool, sql } = require('../database/mssqlClient');
const TarjetaUsuario = require('../../domain/entities/TarjetaUsuario');

class SqlTarjetaUsuarioRepository {
  async findActivasByUsuarioId(usuarioId) {
    const pool = await getPool();
    const result = await pool.request()
      .input('usuarioId', sql.UniqueIdentifier, usuarioId)
      .query(`
        SELECT 
          t.id, t.usuario_id as usuarioId, t.banco_billetera_id as bancoBilleteraId,
          t.nombre_tarjeta as nombreTarjeta, t.tipo, t.ultimos_4 as ultimos4, t.activa,
          b.nombre as bancoNombre, b.logo_url as bancoLogoUrl
        FROM tarjetas_usuario t
        JOIN bancos_billeteras b ON t.banco_billetera_id = b.id
        WHERE t.usuario_id = @usuarioId AND t.activa = 1 AND b.activo = 1
      `);

    return result.recordset.map(row => new TarjetaUsuario(row));
  }
}

module.exports = SqlTarjetaUsuarioRepository;
