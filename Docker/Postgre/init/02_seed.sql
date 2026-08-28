-- =====================================================================
-- CookSmart - Semilla de datos para control de calidad
-- Cubre los tres frentes del plan de pruebas del dossier:
--   - PSeg (seguridad):     usuario fijo con credenciales conocidas
--   - PR   (rendimiento):   volumen suficiente para pruebas de carga
--   - PI   (disponibilidad): ítems en distintos estados de vencimiento
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Catálogos base
-- ---------------------------------------------------------------------
INSERT INTO categoria_ingrediente (nombre_categoria) VALUES
    ('Lácteos'), ('Verduras'), ('Frutas'), ('Carnes'), ('Granos y cereales'), ('Condimentos');

INSERT INTO ingrediente (id_categoria_ing, nombre_ingrediente, unidad_base) VALUES
    (1, 'Leche', 'ml'), (1, 'Queso campesino', 'g'), (1, 'Yogur natural', 'ml'),
    (2, 'Tomate', 'unidad'), (2, 'Cebolla', 'unidad'), (2, 'Pimentón', 'unidad'), (2, 'Espinaca', 'g'),
    (3, 'Banano', 'unidad'), (3, 'Manzana', 'unidad'), (3, 'Limón', 'unidad'),
    (4, 'Pechuga de pollo', 'g'), (4, 'Carne molida', 'g'), (4, 'Huevo', 'unidad'),
    (5, 'Arroz', 'g'), (5, 'Pasta', 'g'), (5, 'Avena', 'g'),
    (6, 'Sal', 'g'), (6, 'Aceite de oliva', 'ml');

INSERT INTO categoria_receta (nombre_categoria) VALUES
    ('Rápido'), ('Vegetariano'), ('Desayuno'), ('Almuerzo'), ('Cena');

INSERT INTO tipo_cocina (nombre_tipo) VALUES
    ('Colombiana'), ('Italiana'), ('Mexicana'), ('Asiática'), ('Mediterránea');

-- ---------------------------------------------------------------------
-- 2. Recetas y sus ingredientes
-- ---------------------------------------------------------------------
INSERT INTO receta (id_categoria_rec, id_tipo_cocina, nombre_receta, descripcion, instrucciones, tiempo_prep_min) VALUES
    (1, 2, 'Pasta al tomate rápida', 'Pasta sencilla con salsa de tomate casera',
        'Hervir la pasta. Sofreír tomate y cebolla. Mezclar y servir.', 15),
    (2, 1, 'Arroz con espinaca', 'Plato vegetariano ligero',
        'Cocinar el arroz. Saltear la espinaca con aceite. Mezclar.', 20),
    (3, 1, 'Huevos revueltos con queso', 'Desayuno rápido y proteico',
        'Batir los huevos, agregar queso, cocinar a fuego medio.', 10),
    (4, 1, 'Pechuga a la plancha con arroz', 'Almuerzo balanceado',
        'Sazonar y asar la pechuga. Servir con arroz.', 25),
    (5, 3, 'Carne molida con pimentón', 'Cena rápida al estilo tex-mex',
        'Saltear cebolla y pimentón, agregar carne molida y cocinar.', 20);

INSERT INTO receta_ingrediente (id_receta, id_ingrediente, cantidad, unidad) VALUES
    (1, 4, 2, 'unidad'), (1, 5, 1, 'unidad'), (1, 15, 200, 'g'),
    (2, 14, 200, 'g'), (2, 7, 100, 'g'),
    (3, 13, 3, 'unidad'), (3, 2, 50, 'g'),
    (4, 11, 250, 'g'), (4, 14, 200, 'g'),
    (5, 12, 300, 'g'), (5, 6, 1, 'unidad'), (5, 5, 1, 'unidad');

-- ---------------------------------------------------------------------
-- 3. Usuarios
--    - usuario 1: cuenta fija de QA para pruebas de seguridad (PSeg)
--      Contraseña real de prueba: CookSmart2026!
--      (el hash de abajo fue generado con bcrypt, costo 12, mediante
--      generar_hash.py — NO es un valor inventado a mano)
--    - usuarios 2-6: cuentas funcionales para pruebas de disponibilidad (PI)
--    - usuarios 7-206: volumen para pruebas de carga (PR)
-- ---------------------------------------------------------------------
INSERT INTO usuario (nombre, correo, contrasena_hash, fecha_registro) VALUES
    ('QA Seguridad', 'qa.seguridad@cooksmart.test', '$2b$12$3Wtnb7I6jqFok4rE0pd2PeYlDy9xVfJFWoVCfUkUkZSgJ94l75cAq', now()),
    ('Ana Torres', 'ana.torres@cooksmart.test', '$2b$12$3Wtnb7I6jqFok4rE0pd2PeYlDy9xVfJFWoVCfUkUkZSgJ94l75cAq', now()),
    ('Carlos Ruiz', 'carlos.ruiz@cooksmart.test', '$2b$12$3Wtnb7I6jqFok4rE0pd2PeYlDy9xVfJFWoVCfUkUkZSgJ94l75cAq', now()),
    ('Diana Pérez', 'diana.perez@cooksmart.test', '$2b$12$3Wtnb7I6jqFok4rE0pd2PeYlDy9xVfJFWoVCfUkUkZSgJ94l75cAq', now()),
    ('Elena Gómez', 'elena.gomez@cooksmart.test', '$2b$12$3Wtnb7I6jqFok4rE0pd2PeYlDy9xVfJFWoVCfUkUkZSgJ94l75cAq', now()),
    ('Felipe Rojas', 'felipe.rojas@cooksmart.test', '$2b$12$3Wtnb7I6jqFok4rE0pd2PeYlDy9xVfJFWoVCfUkUkZSgJ94l75cAq', now());

-- Volumen adicional de usuarios para pruebas de rendimiento (PR01-PR07)
INSERT INTO usuario (nombre, correo, contrasena_hash, fecha_registro)
SELECT
    'Usuario Carga ' || g,
    'carga.usuario' || g || '@cooksmart.test',
    '$2b$12$3Wtnb7I6jqFok4rE0pd2PeYlDy9xVfJFWoVCfUkUkZSgJ94l75cAq',
    now() - (random() * interval '180 days')
FROM generate_series(1, 200) AS g;

-- ---------------------------------------------------------------------
-- 4. Inventario de usuario (nevera)
--    Se cubren deliberadamente los tres estados de vencimiento que
--    necesitan las pruebas de disponibilidad y gestión de nevera (RF04):
--      - vencido (fecha_vencimiento en el pasado)
--      - por vencer en 1-3 días
--      - vigente (fecha de vencimiento lejana)
-- ---------------------------------------------------------------------
INSERT INTO inventario_usuario (id_usuario, id_ingrediente, cantidad, unidad, fecha_compra, fecha_vencimiento, activo) VALUES
    -- QA Seguridad (usuario 1): item vencido, para validar el filtrado por estado en la nevera
    (1, 1, 1000, 'ml', CURRENT_DATE - 10, CURRENT_DATE - 2, TRUE),
    -- Ana Torres (usuario 2): por vencer mañana
    (2, 4, 4, 'unidad', CURRENT_DATE - 3, CURRENT_DATE + 1, TRUE),
    (2, 11, 300, 'g', CURRENT_DATE - 1, CURRENT_DATE + 5, TRUE),
    -- Carlos Ruiz (usuario 3): vence en 2 días
    (3, 7, 150, 'g', CURRENT_DATE - 2, CURRENT_DATE + 2, TRUE),
    (3, 14, 500, 'g', CURRENT_DATE - 15, CURRENT_DATE + 90, TRUE),
    -- Diana Pérez (usuario 4): vigente, sin urgencia
    (4, 9, 6, 'unidad', CURRENT_DATE, CURRENT_DATE + 14, TRUE),
    -- Elena Gómez (usuario 5): ya vencido y desactivado (simula "consumido/eliminado")
    (5, 13, 2, 'unidad', CURRENT_DATE - 20, CURRENT_DATE - 5, FALSE),
    -- Felipe Rojas (usuario 6): mezcla de estados
    (6, 5, 3, 'unidad', CURRENT_DATE - 4, CURRENT_DATE + 3, TRUE),
    (6, 12, 400, 'g', CURRENT_DATE - 1, CURRENT_DATE + 6, TRUE);

-- Volumen adicional de inventario para pruebas de carga/estrés (PR),
-- distribuido entre los usuarios de carga generados arriba
INSERT INTO inventario_usuario (id_usuario, id_ingrediente, cantidad, unidad, fecha_compra, fecha_vencimiento, activo)
SELECT
    6 + ((g % 200) + 1),                                   -- usuarios de carga (id 7-206)
    ((g % 18) + 1),                                        -- ingrediente aleatorio del catálogo
    (random() * 500 + 1)::decimal(8,2),
    'g',
    CURRENT_DATE - (random() * 20)::int,
    CURRENT_DATE + (random() * 20 - 5)::int,               -- incluye algunos ya vencidos
    TRUE
FROM generate_series(1, 1000) AS g;

-- ---------------------------------------------------------------------
-- 5. Historial de recetas preparadas
-- ---------------------------------------------------------------------
INSERT INTO historial_receta (id_usuario, id_receta, fecha_preparacion) VALUES
    (2, 1, now() - interval '2 days'),
    (3, 4, now() - interval '1 day'),
    (4, 2, now() - interval '5 days'),
    (6, 5, now() - interval '3 hours');