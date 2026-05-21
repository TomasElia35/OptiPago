class IngestorService {
  constructor(llmGateway, bancoBilleteraRepo, promocionRepo) {
    this.llmGateway = llmGateway;
    this.bancoBilleteraRepo = bancoBilleteraRepo;
    this.promocionRepo = promocionRepo;
  }

  async procesarTexto(textoCrudo) {
    // 1. Extraer datos con LLM
    const jsonExtraido = await this.llmGateway.extraerPromocion(textoCrudo);
    
    if (!jsonExtraido || !jsonExtraido.bancoNombre) {
        throw new Error("El LLM no devolvió una estructura JSON válida con bancoNombre.");
    }

    // 2. Buscar Banco
    const bancoId = await this.bancoBilleteraRepo.findIdByName(jsonExtraido.bancoNombre);
    if (!bancoId) {
      throw new Error(`No se encontró el banco o billetera: "${jsonExtraido.bancoNombre}" en la base de datos.`);
    }

    // 3. Preparar Entidades DTO (simplificadas)
    const promocion = {
      bancoBilleteraId: bancoId,
      nombre: `Promo IA ${jsonExtraido.bancoNombre} - ${jsonExtraido.reglas[0]?.rubro || 'Varios'}`,
      descripcion: jsonExtraido.descripcion,
      fechaInicio: jsonExtraido.fechaInicio,
      fechaFin: jsonExtraido.fechaFin
    };

    const reglas = jsonExtraido.reglas.map(r => ({
      rubro: r.rubro,
      porcentajeReintegro: r.porcentajeReintegro,
      topeReintegro: r.topeReintegro || null,
      cuotasSinInteres: r.cuotasSinInteres || 1,
      diasSemana: r.diasSemana || null
    }));

    // 4. Insertar Transaccionalmente
    const nuevaPromoId = await this.promocionRepo.insertPromocionConReglas(promocion, reglas);
    
    return {
      exito: true,
      mensaje: "Promoción extraída y guardada exitosamente.",
      promocionId: nuevaPromoId,
      datosExtraidos: jsonExtraido
    };
  }
}

module.exports = IngestorService;
