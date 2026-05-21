const express = require('express');
const SqlTarjetaUsuarioRepository = require('../../infrastructure/repositories/SqlTarjetaUsuarioRepository');
const SqlPromocionRepository = require('../../infrastructure/repositories/SqlPromocionRepository');
const OptimizadorService = require('../../application/services/OptimizadorService');

const router = express.Router();

const tarjetaRepo = new SqlTarjetaUsuarioRepository();
const promocionRepo = new SqlPromocionRepository();
const optimizadorService = new OptimizadorService(tarjetaRepo, promocionRepo);

router.post('/optimizar', async (req, res) => {
  try {
    let { monto, rubro, usuarioId, tasaInflacionMensual } = req.body;
    
    if (!monto || !rubro || !usuarioId) {
      return res.status(400).json({ error: 'Faltan campos requeridos: monto, rubro, usuarioId' });
    }

    if (usuarioId === 'DEMO') {
      const { getPool } = require('../../infrastructure/database/mssqlClient');
      const pool = await getPool();
      const userRes = await pool.request().query('SELECT TOP 1 id FROM usuarios');
      if (userRes.recordset.length > 0) {
        usuarioId = userRes.recordset[0].id;
      } else {
        return res.status(400).json({ error: 'No hay usuarios en la base de datos' });
      }
    }

    const response = await optimizadorService.optimizarCompra({
      monto,
      rubro,
      usuarioId,
      tasaInflacionMensual
    });

    res.json(response);
  } catch (err) {
    console.error('Error optimizando compra:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
