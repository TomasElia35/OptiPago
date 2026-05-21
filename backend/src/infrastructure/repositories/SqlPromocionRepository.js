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

  async insertPromocionConReglas(promocion, reglas) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      
      const request = new sql.Request(transaction);
      
      const resultPromo = await request
        .input('bancoId', sql.UniqueIdentifier, promocion.bancoBilleteraId)
        .input('nombre', sql.VarChar, promocion.nombre)
        .input('descripcion', sql.Text, promocion.descripcion)
        .input('fechaInicio', sql.Date, promocion.fechaInicio)
        .input('fechaFin', sql.Date, promocion.fechaFin)
        .query(`
          INSERT INTO promociones (banco_billetera_id, nombre, descripcion, fecha_inicio, fecha_fin)
          OUTPUT INSERTED.id
          VALUES (@bancoId, @nombre, @descripcion, @fechaInicio, @fechaFin)
        `);
        
      const newPromoId = resultPromo.recordset[0].id;
      
      for (const regla of reglas) {
        const reqRegla = new sql.Request(transaction);
        await reqRegla
          .input('promoId', sql.UniqueIdentifier, newPromoId)
          .input('rubro', sql.VarChar, regla.rubro)
          .input('porcentaje', sql.Decimal(5, 2), regla.porcentajeReintegro)
          .input('tope', sql.Decimal(12, 2), regla.topeReintegro)
          .input('cuotas', sql.Int, regla.cuotasSinInteres || 1)
          .input('dias', sql.VarChar, regla.diasSemana)
          .query(`
            INSERT INTO reglas_promocion (promocion_id, rubro, porcentaje_reintegro, tope_reintegro, cuotas_sin_interes, dias_semana)
            VALUES (@promoId, @rubro, @porcentaje, @tope, @cuotas, @dias)
          `);
      }
      
      await transaction.commit();
      return newPromoId;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = SqlPromocionRepository;
