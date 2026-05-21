const { GoogleGenAI } = require('@google/genai');

class LLMGateway {
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async extraerPromocion(textoCrudo) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("La API Key de Gemini no está configurada en el servidor (.env).");
    }

    const prompt = `Extrae la información de la siguiente promoción bancaria y devuélvela estrictamente en el formato JSON especificado. 
Asegúrate de que los valores numéricos sean números (no strings). 
Para las fechas, asume el año actual si no se especifica. El formato de fecha debe ser YYYY-MM-DD. Si no hay fecha exacta de inicio o fin, infiere la vigencia para el mes en curso.
Si no se menciona cuotas, asume 1. Si no hay tope, asume null.
Texto de la promoción: "${textoCrudo}"`;

    const schema = {
      type: 'OBJECT',
      properties: {
        bancoNombre: { type: 'STRING', description: 'Nombre del banco o billetera (ej: Galicia, Santander, Mercado Pago)' },
        descripcion: { type: 'STRING', description: 'Descripción breve de la promo' },
        fechaInicio: { type: 'STRING', description: 'Fecha de inicio (YYYY-MM-DD)' },
        fechaFin: { type: 'STRING', description: 'Fecha de fin (YYYY-MM-DD)' },
        reglas: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              rubro: { type: 'STRING', description: 'Rubro aplicable (ej: supermercados, restaurantes, combustible)' },
              porcentajeReintegro: { type: 'NUMBER', description: 'Porcentaje de reintegro (ej: 20)' },
              topeReintegro: { type: 'NUMBER', description: 'Tope de reintegro en pesos. Null si no hay tope.' },
              cuotasSinInteres: { type: 'INTEGER', description: 'Cantidad de cuotas sin interes. 1 si es pago único.' },
              diasSemana: { type: 'STRING', description: 'Días de la semana que aplica separados por coma (ej: lunes,miércoles). Null si son todos los días.' }
            },
            required: ['rubro', 'porcentajeReintegro', 'cuotasSinInteres']
          }
        }
      },
      required: ['bancoNombre', 'descripcion', 'fechaInicio', 'fechaFin', 'reglas']
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.1, 
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Error en LLMGateway:", error);
      throw new Error("Falló el procesamiento con Inteligencia Artificial.");
    }
  }
}

module.exports = LLMGateway;
