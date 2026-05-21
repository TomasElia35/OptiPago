import React from 'react';

const TarjetaGanadora = ({ recomendacion }) => {
  if (!recomendacion) return null;

  const formatoMoneda = (valor) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor);

  return (
    <div className="glass-card ganadora-card">
      <div className="ganadora-badge">🔥 Mejor Opción</div>
      
      <div className="tarjeta-header">
        {recomendacion.logoUrl && <img src={recomendacion.logoUrl} alt={recomendacion.banco} className="tarjeta-logo" />}
        <div className="tarjeta-info">
          <h3>{recomendacion.nombreTarjeta}</h3>
          <p>{recomendacion.banco} • {recomendacion.tipo.toUpperCase()} • Terminada en {recomendacion.ultimos4}</p>
        </div>
      </div>

      {recomendacion.nombrePromocion && (
        <div style={{ color: 'var(--accent-color)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          ✨ Promoción Aplicada: {recomendacion.nombrePromocion}
        </div>
      )}

      <div className="ahorro-stats">
        <div className="stat-item">
          <div className="stat-label">Ahorro Reintegro</div>
          <div className="stat-value">{formatoMoneda(recomendacion.ahorroEfectivo)}</div>
        </div>
        
        {recomendacion.ahorroFinanciero > 0 && (
          <div className="stat-item">
            <div className="stat-label">Ahorro Inflación</div>
            <div className="stat-value">+{formatoMoneda(recomendacion.ahorroFinanciero)}</div>
          </div>
        )}
      </div>

      <div className="precio-final">
        {formatoMoneda(recomendacion.precioFinal)}
        <span className="precio-final-label">Precio Final Real</span>
      </div>
    </div>
  );
};

export default TarjetaGanadora;
