const express = require('express');
const router = express.Router();

const LLMGateway = require('../../infrastructure/gateways/LLMGateway');
const SqlBancoBilleteraRepository = require('../../infrastructure/repositories/SqlBancoBilleteraRepository');
const SqlPromocionRepository = require('../../infrastructure/repositories/SqlPromocionRepository');
const IngestorService = require('../../application/services/IngestorService');

const llmGateway = new LLMGateway();
const bancoRepo = new SqlBancoBilleteraRepository();
const promocionRepo = new SqlPromocionRepository();
const ingestorService = new IngestorService(llmGateway, bancoRepo, promocionRepo);

router.post('/procesar', async (req, res) => {
  try {
    const { textoCrudo } = req.body;
    
    if (!textoCrudo || typeof textoCrudo !== 'string') {
      return res.status(400).json({ error: 'Debes enviar el textoCrudo' });
    }

    const resultado = await ingestorService.procesarTexto(textoCrudo);
    res.json(resultado);
  } catch (err) {
    console.error('Error en ingestor:', err);
    res.status(500).json({ error: err.message || 'Error interno del servidor al procesar con IA' });
  }
});

module.exports = router;
