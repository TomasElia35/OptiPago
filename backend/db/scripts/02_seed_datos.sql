-- Seed de prueba
DECLARE @userId UNIQUEIDENTIFIER = NEWID();
INSERT INTO usuarios (id, nombre, email) VALUES (@userId, 'Usuario Demo', 'demo@optipago.com');

-- Bancos
DECLARE @bancoSantander UNIQUEIDENTIFIER = NEWID();
DECLARE @bancoGalicia UNIQUEIDENTIFIER = NEWID();
DECLARE @billeteraMP UNIQUEIDENTIFIER = NEWID();

INSERT INTO bancos_billeteras (id, nombre, tipo, logo_url) VALUES 
(@bancoSantander, 'Santander', 'banco', 'https://logo.clearbit.com/santander.com.ar'),
(@bancoGalicia, 'Galicia', 'banco', 'https://logo.clearbit.com/bancogalicia.com.ar'),
(@billeteraMP, 'Mercado Pago', 'billetera', 'https://logo.clearbit.com/mercadopago.com.ar');

-- Tarjetas del usuario
INSERT INTO tarjetas_usuario (usuario_id, banco_billetera_id, nombre_tarjeta, tipo, ultimos_4) VALUES
(@userId, @bancoSantander, 'Visa Platinum', 'credito', '1234'),
(@userId, @bancoGalicia, 'Mastercard Black', 'credito', '5678'),
(@userId, @billeteraMP, 'Mercado Pago Prepaga', 'prepaga', '9012'),
(@userId, @bancoSantander, 'Visa Débito', 'debito', '3456');

-- Promociones
DECLARE @promoSuper UNIQUEIDENTIFIER = NEWID();
DECLARE @promoCombus UNIQUEIDENTIFIER = NEWID();
DECLARE @promoResto UNIQUEIDENTIFIER = NEWID();

INSERT INTO promociones (id, banco_billetera_id, nombre, descripcion, fecha_inicio, fecha_fin) VALUES
(@promoSuper, @bancoSantander, 'Especial Supermercados', '20% de ahorro en supermercados adheridos', '2026-01-01', '2026-12-31'),
(@promoCombus, @billeteraMP, 'Cargá y Ahorrá', '15% off en combustible pagando con QR o tarjeta MP', '2026-01-01', '2026-12-31'),
(@promoResto, @bancoGalicia, 'Sabores Galicia', '30% en restaurantes los jueves y viernes', '2026-01-01', '2026-12-31');

-- Reglas
INSERT INTO reglas_promocion (promocion_id, rubro, porcentaje_reintegro, tope_reintegro, dias_semana) VALUES
(@promoSuper, 'supermercados', 20.00, 5000.00, 'miércoles'),
(@promoCombus, 'combustible', 15.00, 3000.00, NULL),
(@promoResto, 'restaurantes', 30.00, 10000.00, 'jueves,viernes');

-- Print user id para que lo podamos usar en el frontend
SELECT @userId AS DemoUserId;
