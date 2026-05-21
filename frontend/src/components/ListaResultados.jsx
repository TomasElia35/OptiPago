import React from 'react';

const ListaResultados = ({ alternativas }) => {
  if (!alternativas || alternativas.length === 0) return null;

  const formatoMoneda = (valor) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor);

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '1rem' }}>Otras Opciones</h3>
      <div>
        {alternativas.map((alt, idx) => (
          <div key={idx} className="alternativa-item">
            <div>
              <div style={{ fontWeight: '600' }}>{alt.nombreTarjeta}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alt.banco}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="alt-precio">{formatoMoneda(alt.precioFinal)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                Ahorro total: {formatoMoneda(alt.ahorroTotal)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaResultados;
