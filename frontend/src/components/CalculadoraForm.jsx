import React, { useState } from 'react';

const CalculadoraForm = ({ onOptimizar, isLoading }) => {
  const [monto, setMonto] = useState('');
  const [rubro, setRubro] = useState('supermercados');
  const [inflacion, setInflacion] = useState('5.0'); // 5% por defecto

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!monto || isNaN(monto)) return;
    
    onOptimizar({
      monto: parseFloat(monto),
      rubro,
      tasaInflacionMensual: parseFloat(inflacion)
    });
  };

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Monto a Pagar ($)</label>
        <input 
          type="number" 
          className="form-input" 
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Ej: 50000"
          required
          min="1"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Rubro</label>
        <select 
          className="form-select" 
          value={rubro} 
          onChange={(e) => setRubro(e.target.value)}
        >
          <option value="supermercados">Supermercados</option>
          <option value="restaurantes">Restaurantes</option>
          <option value="combustible">Combustible</option>
          <option value="indumentaria">Indumentaria</option>
          <option value="tecnologia">Tecnología</option>
          <option value="otros">Otros</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Inflación Mensual Estimada (%)</label>
        <input 
          type="number" 
          className="form-input" 
          value={inflacion}
          onChange={(e) => setInflacion(e.target.value)}
          placeholder="Ej: 5.0"
          step="0.1"
          min="0"
        />
      </div>

      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? (
          <><span className="spinner"></span> Optimizando...</>
        ) : (
          'Optimizar Pago'
        )}
      </button>
    </form>
  );
};

export default CalculadoraForm;
