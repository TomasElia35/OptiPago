class Promocion {
  constructor({ id, bancoBilleteraId, nombre, descripcion, reglas = [] }) {
    this.id = id;
    this.bancoBilleteraId = bancoBilleteraId;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.reglas = reglas; // Array of ReglaPromocion
  }
}
module.exports = Promocion;
