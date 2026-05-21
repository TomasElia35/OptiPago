class TarjetaUsuario {
  constructor({ id, usuarioId, bancoBilleteraId, nombreTarjeta, tipo, ultimos4, activa, bancoNombre, bancoLogoUrl }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.bancoBilleteraId = bancoBilleteraId;
    this.nombreTarjeta = nombreTarjeta;
    this.tipo = tipo; // 'credito' | 'debito' | 'prepaga'
    this.ultimos4 = ultimos4;
    this.activa = activa;
    
    // Aggregates for convenience
    this.bancoNombre = bancoNombre;
    this.bancoLogoUrl = bancoLogoUrl;
  }
}
module.exports = TarjetaUsuario;
