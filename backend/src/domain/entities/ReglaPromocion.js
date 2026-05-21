class ReglaPromocion {
  constructor({ id, promocionId, rubro, porcentajeReintegro, topeReintegro, cuotasSinInteres, diasSemana }) {
    this.id = id;
    this.promocionId = promocionId;
    this.rubro = rubro;
    this.porcentajeReintegro = parseFloat(porcentajeReintegro);
    this.topeReintegro = parseFloat(topeReintegro);
    this.cuotasSinInteres = parseInt(cuotasSinInteres, 10);
    this.diasSemana = diasSemana; // string "lunes,martes"
  }

  aplicaEnDia(diaSemanaActual) { // diaSemanaActual: e.g., "lunes"
    if (!this.diasSemana) return true; // Aplica todos los días
    const dias = this.diasSemana.toLowerCase().split(',').map(d => d.trim());
    return dias.includes(diaSemanaActual.toLowerCase());
  }
}
module.exports = ReglaPromocion;
