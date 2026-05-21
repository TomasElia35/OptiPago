class OptimizadorService {
  constructor(tarjetaRepo, promocionRepo) {
    this.tarjetaRepo = tarjetaRepo;
    this.promocionRepo = promocionRepo;
  }

  async optimizarCompra(request) {
    const { monto, rubro, usuarioId, tasaInflacionMensual = 0 } = request;
    const montoFloat = parseFloat(monto);
    const tasaInflacion = parseFloat(tasaInflacionMensual);

    const tarjetas = await this.tarjetaRepo.findActivasByUsuarioId(usuarioId);
    
    if (!tarjetas || tarjetas.length === 0) {
      return { montoOriginal: montoFloat, recomendacion: null, alternativas: [] };
    }

    const opciones = [];

    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaActual = dias[new Date().getDay()];

    for (const tarjeta of tarjetas) {
      const promociones = await this.promocionRepo.findVigentesByBanco(tarjeta.bancoBilleteraId);
      
      let mejorReglaParaTarjeta = null;
      let mejorAhorroParaTarjeta = 0;
      let promoAsociada = null;
      
      for (const promo of promociones) {
        const reglasAplicables = promo.reglas.filter(r => 
          (r.rubro === null || r.rubro.toLowerCase() === rubro.toLowerCase()) &&
          r.aplicaEnDia(diaActual)
        );

        for (const regla of reglasAplicables) {
          const reintegroBase = montoFloat * (regla.porcentajeReintegro / 100);
          const reintegroEfectivo = Math.min(reintegroBase, regla.topeReintegro);
          
          if (reintegroEfectivo > mejorAhorroParaTarjeta) {
            mejorAhorroParaTarjeta = reintegroEfectivo;
            mejorReglaParaTarjeta = regla;
            promoAsociada = promo;
          }
        }
      }

      const mesesDiferimiento = tarjeta.tipo === 'credito' ? 1 : 0;
      
      const costoSinDiferir = montoFloat - mejorAhorroParaTarjeta;
      const factorInflacion = Math.pow(1 + (tasaInflacion / 100), mesesDiferimiento);
      const costoDiferido = costoSinDiferir / factorInflacion;
      
      const ahorroFinanciero = costoSinDiferir - costoDiferido;
      const ahorroTotal = mejorAhorroParaTarjeta + ahorroFinanciero;
      const precioFinal = montoFloat - ahorroTotal;

      opciones.push({
        tarjetaId: tarjeta.id,
        nombreTarjeta: tarjeta.nombreTarjeta,
        banco: tarjeta.bancoNombre,
        logoUrl: tarjeta.bancoLogoUrl,
        tipo: tarjeta.tipo,
        ultimos4: tarjeta.ultimos4,
        ahorroEfectivo: mejorAhorroParaTarjeta,
        ahorroFinanciero: ahorroFinanciero,
        ahorroTotal: ahorroTotal,
        porcentajeReintegro: mejorReglaParaTarjeta ? mejorReglaParaTarjeta.porcentajeReintegro : 0,
        cuotasSinInteres: mejorReglaParaTarjeta ? mejorReglaParaTarjeta.cuotasSinInteres : 1,
        precioFinal: precioFinal,
        nombrePromocion: promoAsociada ? promoAsociada.nombre : null
      });
    }

    opciones.sort((a, b) => b.ahorroTotal - a.ahorroTotal);

    const recomendacion = opciones.length > 0 ? opciones[0] : null;
    const alternativas = opciones.length > 1 ? opciones.slice(1) : [];

    return {
      montoOriginal: montoFloat,
      recomendacion,
      alternativas
    };
  }
}

module.exports = OptimizadorService;
