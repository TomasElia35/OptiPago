import React, { useState } from 'react';
import { procesarTextoIA } from '../api/optipago';

const AdminPanel = () => {
  const [textoCrudo, setTextoCrudo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleProcesar = async () => {
    if (!textoCrudo.trim()) return;
    setIsProcessing(true);
    setError(null);
    setResultado(null);
    try {
      const response = await procesarTextoIA(textoCrudo);
      setResultado(response);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al procesar el texto');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '800px' }}>
      <header className="header">
        <h1>Módulo de Ingesta IA</h1>
        <p>Pega los Términos y Condiciones para crear promociones automáticas</p>
      </header>

      <div className="glass-card">
        <div className="form-group">
          <label className="form-label">Texto Crudo (TyC de la promoción)</label>
          <textarea
            className="form-input"
            rows="8"
            placeholder="Ej: 20% de descuento en supermercados pagando con Galicia los miércoles, tope $5000..."
            value={textoCrudo}
            onChange={(e) => setTextoCrudo(e.target.value)}
          ></textarea>
        </div>
        
        <button 
          className="btn" 
          onClick={handleProcesar} 
          disabled={isProcessing || !textoCrudo.trim()}
        >
          {isProcessing ? <><span className="spinner"></span> Analizando con Gemini...</> : 'Procesar con IA y Guardar'}
        </button>
      </div>

      {error && (
        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ color: '#ef4444' }}>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {resultado && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
          <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>✅ {resultado.mensaje}</h3>
          <pre style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '1rem', 
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '0.9rem'
          }}>
            {JSON.stringify(resultado.datosExtraidos, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
