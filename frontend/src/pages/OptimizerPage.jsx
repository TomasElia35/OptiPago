import React, { useState } from 'react';
import CalculadoraForm from '../components/CalculadoraForm';
import TarjetaGanadora from '../components/TarjetaGanadora';
import ListaResultados from '../components/ListaResultados';
import { optimizarCompra } from '../api/optipago';

const OptimizerPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleOptimizar = async (data) => {
    setIsLoading(true);
    setResultado(null);
    try {
      // Usamos 'DEMO' para que el backend lo intercepte y asigne el primer usuario
      const response = await optimizarCompra({ ...data, usuarioId: 'DEMO' });
      setResultado(response);
    } catch (error) {
      console.error('Error al optimizar', error);
      alert('Hubo un error al optimizar. Asegurate de que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>OptiPago</h1>
        <p>Optimizador inteligente de consumos</p>
      </header>

      <CalculadoraForm onOptimizar={handleOptimizar} isLoading={isLoading} />
      
      {resultado && resultado.recomendacion && (
        <TarjetaGanadora recomendacion={resultado.recomendacion} />
      )}
      
      {resultado && resultado.alternativas && (
        <ListaResultados alternativas={resultado.alternativas} />
      )}
    </div>
  );
};

export default OptimizerPage;
