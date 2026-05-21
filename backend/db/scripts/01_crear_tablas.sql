-- Usuarios
CREATE TABLE usuarios (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);

-- Bancos / Billeteras digitales
CREATE TABLE bancos_billeteras (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  nombre VARCHAR(100) NOT NULL,          -- "Santander", "Mercado Pago"
  tipo VARCHAR(20) NOT NULL,             -- 'banco' | 'billetera'
  logo_url VARCHAR(255),
  activo BIT DEFAULT 1
);

-- Tarjetas por usuario
CREATE TABLE tarjetas_usuario (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  usuario_id UNIQUEIDENTIFIER REFERENCES usuarios(id) ON DELETE CASCADE,
  banco_billetera_id UNIQUEIDENTIFIER REFERENCES bancos_billeteras(id),
  nombre_tarjeta VARCHAR(100),           -- "Visa Oro", "Mastercard Black"
  tipo VARCHAR(20) NOT NULL,             -- 'credito' | 'debito' | 'prepaga'
  ultimos_4 VARCHAR(4),
  activa BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);

-- Promociones vigentes
CREATE TABLE promociones (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  banco_billetera_id UNIQUEIDENTIFIER REFERENCES bancos_billeteras(id),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  activa BIT DEFAULT 1
);

-- Reglas dentro de una promoción (una promo puede tener N reglas)
CREATE TABLE reglas_promocion (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  promocion_id UNIQUEIDENTIFIER REFERENCES promociones(id) ON DELETE CASCADE,
  rubro VARCHAR(100),                    -- NULL = aplica a todo
  porcentaje_reintegro DECIMAL(5,2),     -- 15.00 = 15%
  tope_reintegro DECIMAL(12,2),          -- 500.00 ARS máximo
  cuotas_sin_interes INTEGER DEFAULT 1,
  monto_minimo DECIMAL(12,2) DEFAULT 0,
  dias_semana VARCHAR(50),               -- "lunes,miércoles" NULL=todos
  activa BIT DEFAULT 1
);
