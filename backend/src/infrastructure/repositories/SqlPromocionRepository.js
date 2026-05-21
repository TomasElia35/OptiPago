const { getPool, sql } = require('../database/mssqlClient');
const Promocion = require('../../domain/entities/Promocion');
const ReglaPromocion = require('../../domain/entities/ReglaPromocion');

class SqlPromocionRepository {
  async findVigentesByBanco(bancoBilleteraId) {
    const pool = await getPool();
    
    const promoResult = await pool.request()
      .input('bancoId', sql.UniqueIdentifier, bancoBilleteraId)
      .query(`
        SELECT id, banco_billetera_id as bancoBilleteraId, nombre, descripcion
        FROM promociones
        WHERE banco_billetera_id = @bancoId 
          AND activa = 1 
          AND CAST(fecha_inicio AS DATE) <= CAST(GETDATE() AS DATE) 
          AND CAST(fecha_fin AS DATE) >= CAST(GETDATE() AS DATE)
      `);

    const promociones = promoResult.recordset.map(row => new Promocion(row));
    
    if (promociones.length === 0) return [];

    const promoIds = promociones.map(p => p.id);
    
    if (promoIds.length > 0) {
      const request = pool.request();
      const inClause = promoIds.map((id, index) => {
        request.input(`id${index}`, sql.UniqueIdentifier, id);
        return `@id${index}`;
      }).join(',');

      const reglasResult = await request.query(`
        SELECT id, promocion_id as promocionId, rubro, porcentaje_reintegro as porcentajeReintegro,
               tope_reintegro as topeReintegro, cuotas_sin_interes as cuotasSinInteres, dias_semana as diasSemana
        FROM reglas_promocion
        WHERE promocion_id IN (${inClause}) AND activa = 1
      `);

      const reglas = reglasResult.recordset.map(row => new ReglaPromocion(row));

      promociones.forEach(p => {
        p.reglas = reglas.filter(r => r.promocionId === p.id);
      });
    }

    return promociones;
  }
}

module.exports = SqlPromocionRepository;
