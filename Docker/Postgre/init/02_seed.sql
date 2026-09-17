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
-- =====================================================================
-- EXPANSIÓN: catálogo de restricciones/etiquetas corregido al vocabulario
-- real de la app, + 15 recetas nuevas con pasos, información nutricional,
-- etiquetas y restricciones (algunas con foto real de TheMealDB).
-- =====================================================================

-- Corregir catálogo de restricciones y etiquetas al vocabulario real
DELETE FROM receta_restriccion;
DELETE FROM restriccion;
INSERT INTO restriccion (nombre_restriccion) VALUES
    ('sin-cerdo'),('sin-frutos-secos'),('sin-gluten'),('sin-huevo'),('sin-lactosa'),('sin-mariscos');

DELETE FROM receta_etiqueta;
DELETE FROM etiqueta;
INSERT INTO etiqueta (nombre_etiqueta) VALUES
    ('colombiana'),('italiana'),('mexicana'),('asiatica'),('mediterranea'),
    ('rapida'),('saludable'),('postres'),('mariscos'),('parrilla'),('sopas'),
    ('vegetariana'),('vegana');

-- ===================================================================
-- 15 recetas nuevas (ids 6-20), en español, con pasos, información
-- nutricional, etiquetas y restricciones alineadas al vocabulario real
-- de la app (perfil.html/registro.html). 6 usan fotos reales de
-- TheMealDB (dishes con equivalente internacional); las de cocina
-- colombiana usan fotos de Unsplash porque TheMealDB no tiene esa
-- área en su catálogo.
-- ===================================================================

INSERT INTO receta (id_categoria_rec, id_tipo_cocina, nombre_receta, descripcion, instrucciones, pasos, tiempo_prep_min, imagen_url, dificultad, porciones, calorias, proteina_g, carbos_g, grasa_g) VALUES

-- 6. Ajiaco Santafereño
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Almuerzo'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Colombiana'),
 'Ajiaco Santafereño', 'Sopa bogotana de pollo con tres tipos de papa y guascas',
 'Cocinar el pollo con las papas y las guascas hasta que espesen la sopa; servir con crema de leche, alcaparras y aguacate.',
 ARRAY['Poner a cocinar la pechuga de pollo en agua con cebolla y ajo durante 25 minutos.',
       'Agregar las tres variedades de papa picada y las guascas.',
       'Cocinar a fuego medio hasta que la papa se deshaga y espese la sopa (30-40 min).',
       'Desmechar el pollo y devolverlo a la olla.',
       'Servir caliente con crema de leche, alcaparras, aguacate y una mazorca aparte.'],
 60, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80', 'Media', 4, 380, 28, 42, 10),

-- 7. Bandeja Paisa
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Almuerzo'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Colombiana'),
 'Bandeja Paisa', 'El plato típico antioqueño: frijoles, arroz, carne, chicharrón, huevo y plátano',
 'Preparar cada componente por separado (frijoles, arroz, carne molida, huevo frito, plátano maduro) y servir todo junto en una bandeja grande.',
 ARRAY['Cocinar los fríjoles con un trozo de tocineta hasta ablandar (1.5 h en olla normal).',
       'Preparar el arroz blanco por separado.',
       'Sofreír la carne molida con cebolla, tomate y ajo.',
       'Freír el huevo y el plátano maduro en tajadas.',
       'Servir todo en una bandeja grande: fríjoles, arroz, carne, huevo, plátano y aguacate.'],
 90, 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=400&q=80', 'Difícil', 4, 720, 38, 65, 32),

-- 8. Arepas rellenas de queso
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Desayuno'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Colombiana'),
 'Arepas rellenas de queso', 'Arepas de maíz asadas, rellenas de queso derretido',
 'Amasar la harina de maíz con agua y sal, formar las arepas, asarlas y rellenarlas con queso antes de servir.',
 ARRAY['Mezclar el maíz (harina precocida) con agua tibia y sal hasta formar una masa suave.',
       'Formar bolas y aplanarlas en forma de disco.',
       'Asar en un tostador o sartén a fuego medio, 6-8 minutos por lado.',
       'Abrir la arepa caliente por un lado y rellenar con queso campesino en tajadas.',
       'Volver a la parrilla unos segundos hasta que el queso se derrita.'],
 25, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&q=80', 'Fácil', 2, 310, 12, 38, 12),

-- 9. Sancocho de gallina
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Almuerzo'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Colombiana'),
 'Sancocho de gallina', 'Sopa espesa de gallina con yuca, plátano y mazorca',
 'Cocinar la gallina con las verduras hasta lograr un caldo espeso y aromático; servir con arroz aparte.',
 ARRAY['Cocinar la gallina en agua con cebolla, ajo y cilantro durante 40 minutos.',
       'Agregar la yuca y el plátano picados en trozos grandes.',
       'Cocinar 20 minutos más hasta que la yuca esté blanda.',
       'Ajustar sal y comino al gusto.',
       'Servir caliente con arroz blanco y aguacate aparte.'],
 75, 'https://images.unsplash.com/photo-1607330289024-1535c5b6f8bd?w=400&q=80', 'Media', 6, 340, 24, 35, 12),

-- 10. Empanadas colombianas
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Rápido'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Colombiana'),
 'Empanadas colombianas', 'Empanadas de maíz fritas, rellenas de carne y papa',
 'Preparar el relleno de carne con papa, armar las empanadas de masa de maíz y freírlas hasta dorar.',
 ARRAY['Sofreír la carne molida con cebolla, ajo y comino.',
       'Agregar papa picada en cubos pequeños y cocinar hasta ablandar.',
       'Formar discos de masa de maíz, rellenar y cerrar en forma de media luna.',
       'Freír en aceite caliente hasta dorar por ambos lados (3-4 min).',
       'Servir calientes con ají picante.'],
 40, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', 'Media', 4, 290, 14, 28, 15),

-- 11. Espagueti a la carbonara (imagen real de TheMealDB)
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Cena'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Italiana'),
 'Espagueti a la carbonara', 'Pasta italiana clásica con tocineta, huevo y queso parmesano',
 'Cocinar la pasta al dente, sofreír la tocineta, y mezclar todo con huevo batido y queso fuera del fuego para lograr una salsa cremosa sin cuajar el huevo.',
 ARRAY['Poner a hervir agua con sal y cocinar el espagueti hasta que esté al dente.',
       'Picar y freír la tocineta hasta que quede dorada y crocante.',
       'Batir los huevos con el queso parmesano rallado y pimienta negra.',
       'Escurrir la pasta y mezclarla de inmediato con la tocineta, fuera del fuego.',
       'Agregar la mezcla de huevo y queso, revolviendo rápido para que espese sin cuajar.',
       'Servir enseguida con más queso rallado por encima.'],
 25, 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg', 'Media', 4, 520, 22, 58, 20),

-- 12. Pizza margarita casera (imagen real de TheMealDB)
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Cena'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Italiana'),
 'Pizza margarita casera', 'Pizza napolitana clásica con tomate, mozzarella y albahaca fresca',
 'Preparar una masa simple, dejarla reposar, y hornear con salsa de tomate, mozzarella y albahaca.',
 ARRAY['Mezclar la harina con agua tibia, sal y levadura; amasar 10 minutos.',
       'Dejar reposar la masa 30-40 minutos hasta que doble su tamaño.',
       'Estirar la masa en forma de disco sobre una bandeja engrasada.',
       'Cubrir con salsa de tomate y tajadas de mozzarella.',
       'Hornear a 230°C durante 10-12 minutos hasta que el queso dore.',
       'Retirar del horno y decorar con hojas de albahaca fresca.'],
 45, 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg', 'Media', 4, 610, 24, 72, 22),

-- 13. Tacos de pollo
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Rápido'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Mexicana'),
 'Tacos de pollo', 'Tacos rápidos con pollo desmechado, cilantro y limón',
 'Cocinar y desmechar el pollo, calentar las tortillas y armar los tacos con los aderezos frescos.',
 ARRAY['Cocinar la pechuga de pollo con sal y comino hasta que esté bien cocida.',
       'Desmechar el pollo con dos tenedores.',
       'Calentar las tortillas de maíz en un comal o sartén.',
       'Rellenar cada tortilla con pollo, cebolla picada y cilantro.',
       'Servir con limón al lado para exprimir encima.'],
 20, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80', 'Fácil', 3, 340, 26, 30, 12),

-- 14. Guacamole con totopos
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Rápido'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Mexicana'),
 'Guacamole con totopos', 'Aguacate machacado con limón, cilantro y cebolla, con totopos de maíz',
 'Machacar el aguacate con limón y mezclar con los demás ingredientes picados finamente.',
 ARRAY['Partir los aguacates por la mitad y retirar la pulpa.',
       'Machacar la pulpa con un tenedor dejando algunos trozos.',
       'Agregar cebolla, cilantro y ají picados finamente.',
       'Añadir jugo de limón y sal al gusto, mezclar bien.',
       'Servir de inmediato acompañado de totopos de maíz (tortilla frita).'],
 15, 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400&q=80', 'Fácil', 4, 180, 3, 14, 15),

-- 15. Pad Thai de camarón (imagen real de TheMealDB)
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Cena'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Asiática'),
 'Pad Thai de camarón', 'Fideos de arroz salteados con camarón, maní y salsa agridulce',
 'Remojar los fideos, saltear el camarón, y mezclar todo con la salsa de limón y salsa de pescado.',
 ARRAY['Remojar los fideos de arroz en agua caliente durante 4 minutos y escurrir.',
       'Mezclar jugo de limón, azúcar y salsa de pescado en un bowl.',
       'Saltear el camarón en aceite caliente hasta que tome color.',
       'Agregar los fideos y la mezcla de salsa, revolviendo bien.',
       'Servir con maní picado y cilantro por encima.'],
 30, 'https://www.themealdb.com/images/media/meals/rg9ze01763479093.jpg', 'Media', 2, 420, 22, 55, 12),

-- 16. Pollo al curry panang
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Almuerzo'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Asiática'),
 'Pollo al curry panang', 'Curry tailandés cremoso de pollo con leche de coco',
 'Sofreír la pasta de curry en leche de coco, agregar el pollo y cocinar hasta que la salsa espese.',
 ARRAY['Calentar la parte espesa de la leche de coco en una olla.',
       'Agregar curry en polvo y sofreír 1 minuto hasta que suelte aroma.',
       'Añadir el pollo en trozos y cocinar 4 minutos hasta dorar.',
       'Verter el resto de la leche de coco y cocinar a fuego medio 10 minutos.',
       'Ajustar sal y servir con arroz al vapor.'],
 35, 'https://www.themealdb.com/images/media/meals/0dhtwr1763371444.jpg', 'Media', 3, 480, 28, 20, 32),

-- 17. Ensalada griega con pollo (imagen real de TheMealDB)
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Rápido'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Mediterránea'),
 'Ensalada griega con pollo', 'Ensalada fresca con pepino, tomate, aceitunas y queso feta',
 'Mezclar las verduras picadas con el queso feta y las aceitunas, aderezar con aceite de oliva y limón.',
 ARRAY['Picar el tomate, el pepino y la cebolla en trozos medianos.',
       'Asar o cocinar la pechuga de pollo y cortarla en tiras.',
       'Mezclar las verduras en un bowl grande con las aceitunas negras.',
       'Agregar el queso feta desmenuzado y el pollo.',
       'Aderezar con aceite de oliva, limón, sal y orégano.'],
 20, 'https://www.themealdb.com/images/media/meals/k29viq1585565980.jpg', 'Fácil', 2, 380, 30, 12, 24),

-- 18. Hummus con pan pita
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Rápido'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Mediterránea'),
 'Hummus con pan pita', 'Puré de garbanzo con tahini, limón y aceite de oliva',
 'Licuar los garbanzos cocidos con tahini, limón, ajo y aceite de oliva hasta lograr una crema suave.',
 ARRAY['Cocinar los garbanzos hasta que estén muy blandos (o usar garbanzo ya cocido).',
       'Licuar los garbanzos con tahini, ajo, limón y un poco de agua.',
       'Agregar aceite de oliva poco a poco hasta lograr una textura cremosa.',
       'Ajustar sal y limón al gusto.',
       'Servir con un chorro de aceite de oliva y pan pita caliente.'],
 15, 'https://images.unsplash.com/photo-1571197119282-7c4e2b2d4b3e?w=400&q=80', 'Fácil', 4, 220, 8, 24, 11),

-- 19. Camarones al ajillo
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Cena'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Mediterránea'),
 'Camarones al ajillo', 'Camarones salteados en aceite de oliva y abundante ajo',
 'Saltear los camarones con ajo picado en aceite de oliva caliente hasta que estén cocidos.',
 ARRAY['Pelar y limpiar los camarones.',
       'Picar el ajo finamente.',
       'Calentar aceite de oliva y sofreír el ajo hasta que dore ligeramente.',
       'Agregar los camarones y cocinar 2-3 minutos por lado hasta que estén rosados.',
       'Servir de inmediato con perejil o cilantro picado por encima.'],
 15, 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&q=80', 'Fácil', 2, 260, 24, 4, 16),

-- 20. Panqueques con frutos rojos (imagen real de TheMealDB)
((SELECT id_categoria_rec FROM categoria_receta WHERE nombre_categoria='Desayuno'),
 (SELECT id_tipo_cocina FROM tipo_cocina WHERE nombre_tipo='Mediterránea'),
 'Panqueques con frutos rojos', 'Panqueques esponjosos servidos con fresas frescas',
 'Preparar una mezcla líquida con harina, huevo y leche, cocinar en sartén y servir con fresas.',
 ARRAY['Mezclar la harina, los huevos, la leche y una pizca de sal hasta lograr una mezcla suave.',
       'Dejar reposar la mezcla 10-15 minutos.',
       'Calentar una sartén antiadherente con un poco de aceite.',
       'Verter porciones de la mezcla y cocinar 1 minuto por cada lado hasta dorar.',
       'Servir apilados con fresas picadas por encima.'],
 20, 'https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg', 'Fácil', 2, 310, 10, 45, 9);


INSERT INTO categoria_ingrediente (nombre_categoria) VALUES ('Mariscos') ON CONFLICT DO NOTHING;

INSERT INTO ingrediente (id_categoria_ing, nombre_ingrediente, unidad_base)
SELECT c.id_categoria_ing, v.nombre, v.unidad FROM (VALUES
    ('Verduras','Papa','g'), ('Verduras','Maíz','g'), ('Verduras','Plátano','unidad'),
    ('Verduras','Yuca','g'), ('Verduras','Zanahoria','g'), ('Verduras','Apio','g'),
    ('Verduras','Pepino','g'), ('Verduras','Aguacate','unidad'),
    ('Condimentos','Cilantro','g'), ('Condimentos','Ajo','g'), ('Condimentos','Albahaca','g'),
    ('Condimentos','Orégano','g'), ('Condimentos','Comino','g'), ('Condimentos','Curry en polvo','g'),
    ('Condimentos','Aceituna negra','g'), ('Condimentos','Tahini','g'), ('Condimentos','Ají','g'),
    ('Condimentos','Maní','g'), ('Condimentos','Azúcar','g'),
    ('Granos y cereales','Fríjol','g'), ('Granos y cereales','Garbanzo','g'),
    ('Granos y cereales','Harina de trigo','g'), ('Granos y cereales','Pan pita','unidad'),
    ('Granos y cereales','Tortilla de maíz','unidad'), ('Granos y cereales','Fideos de arroz','g'),
    ('Lácteos','Queso mozzarella','g'), ('Lácteos','Leche de coco','ml'),
    ('Lácteos','Queso feta','g'), ('Lácteos','Queso parmesano','g'),
    ('Carnes','Tocineta','g'), ('Carnes','Gallina','g'),
    ('Frutas','Fresas','g'),
    ('Mariscos','Camarón','g')
) AS v(cat, nombre, unidad)
JOIN categoria_ingrediente c ON c.nombre_categoria = v.cat
ON CONFLICT (nombre_ingrediente) DO NOTHING;

-- Vincula cada receta nueva con sus ingredientes del catálogo (por nombre, no por ID)
INSERT INTO receta_ingrediente (id_receta, id_ingrediente, cantidad, unidad)
SELECT r.id_receta, i.id_ingrediente, x.cantidad, x.unidad
FROM (VALUES
    ('Ajiaco Santafereño','Pechuga de pollo',400,'g'),
    ('Ajiaco Santafereño','Papa',500,'g'),
    ('Ajiaco Santafereño','Cebolla',1,'unidad'),
    ('Ajiaco Santafereño','Maíz',2,'unidad'),

    ('Bandeja Paisa','Fríjol',300,'g'),
    ('Bandeja Paisa','Arroz',200,'g'),
    ('Bandeja Paisa','Carne molida',300,'g'),
    ('Bandeja Paisa','Huevo',2,'unidad'),
    ('Bandeja Paisa','Plátano',1,'unidad'),
    ('Bandeja Paisa','Tocineta',100,'g'),
    ('Bandeja Paisa','Aguacate',1,'unidad'),

    ('Arepas rellenas de queso','Maíz',300,'g'),
    ('Arepas rellenas de queso','Queso campesino',150,'g'),
    ('Arepas rellenas de queso','Sal',5,'g'),

    ('Sancocho de gallina','Gallina',600,'g'),
    ('Sancocho de gallina','Yuca',300,'g'),
    ('Sancocho de gallina','Plátano',1,'unidad'),
    ('Sancocho de gallina','Cebolla',1,'unidad'),
    ('Sancocho de gallina','Ajo',2,'g'),
    ('Sancocho de gallina','Cilantro',10,'g'),

    ('Empanadas colombianas','Carne molida',250,'g'),
    ('Empanadas colombianas','Papa',150,'g'),
    ('Empanadas colombianas','Cebolla',1,'unidad'),
    ('Empanadas colombianas','Ajo',2,'g'),
    ('Empanadas colombianas','Comino',2,'g'),
    ('Empanadas colombianas','Maíz',300,'g'),

    ('Espagueti a la carbonara','Pasta',350,'g'),
    ('Espagueti a la carbonara','Huevo',3,'unidad'),
    ('Espagueti a la carbonara','Tocineta',150,'g'),
    ('Espagueti a la carbonara','Queso parmesano',50,'g'),

    ('Pizza margarita casera','Harina de trigo',300,'g'),
    ('Pizza margarita casera','Queso mozzarella',150,'g'),
    ('Pizza margarita casera','Tomate',2,'unidad'),
    ('Pizza margarita casera','Albahaca',10,'g'),

    ('Tacos de pollo','Pechuga de pollo',300,'g'),
    ('Tacos de pollo','Tortilla de maíz',6,'unidad'),
    ('Tacos de pollo','Cebolla',1,'unidad'),
    ('Tacos de pollo','Cilantro',10,'g'),
    ('Tacos de pollo','Limón',1,'unidad'),

    ('Guacamole con totopos','Aguacate',3,'unidad'),
    ('Guacamole con totopos','Cebolla',1,'unidad'),
    ('Guacamole con totopos','Cilantro',10,'g'),
    ('Guacamole con totopos','Limón',1,'unidad'),
    ('Guacamole con totopos','Ají',1,'unidad'),
    ('Guacamole con totopos','Tortilla de maíz',6,'unidad'),

    ('Pad Thai de camarón','Camarón',250,'g'),
    ('Pad Thai de camarón','Fideos de arroz',150,'g'),
    ('Pad Thai de camarón','Maní',30,'g'),
    ('Pad Thai de camarón','Azúcar',15,'g'),
    ('Pad Thai de camarón','Limón',1,'unidad'),

    ('Pollo al curry panang','Pechuga de pollo',400,'g'),
    ('Pollo al curry panang','Leche de coco',400,'ml'),
    ('Pollo al curry panang','Curry en polvo',15,'g'),
    ('Pollo al curry panang','Ajo',2,'g'),

    ('Ensalada griega con pollo','Pechuga de pollo',200,'g'),
    ('Ensalada griega con pollo','Tomate',2,'unidad'),
    ('Ensalada griega con pollo','Pepino',1,'unidad'),
    ('Ensalada griega con pollo','Cebolla',1,'unidad'),
    ('Ensalada griega con pollo','Aceituna negra',30,'g'),
    ('Ensalada griega con pollo','Queso feta',100,'g'),

    ('Hummus con pan pita','Garbanzo',250,'g'),
    ('Hummus con pan pita','Tahini',30,'g'),
    ('Hummus con pan pita','Limón',1,'unidad'),
    ('Hummus con pan pita','Ajo',2,'g'),
    ('Hummus con pan pita','Aceite de oliva',30,'ml'),
    ('Hummus con pan pita','Pan pita',2,'unidad'),

    ('Camarones al ajillo','Camarón',300,'g'),
    ('Camarones al ajillo','Ajo',4,'g'),
    ('Camarones al ajillo','Aceite de oliva',40,'ml'),

    ('Panqueques con frutos rojos','Harina de trigo',150,'g'),
    ('Panqueques con frutos rojos','Huevo',2,'unidad'),
    ('Panqueques con frutos rojos','Leche',250,'ml'),
    ('Panqueques con frutos rojos','Fresas',100,'g')
) AS x(nombre_receta, nombre_ingrediente, cantidad, unidad)
JOIN receta r ON r.nombre_receta = x.nombre_receta
JOIN ingrediente i ON i.nombre_ingrediente = x.nombre_ingrediente;

-- Etiquetas (gustos): colombiana, italiana, mexicana, asiatica, mediterranea,
-- rapida, saludable, postres, mariscos, parrilla, sopas, vegetariana, vegana
INSERT INTO receta_etiqueta (id_receta, id_etiqueta)
SELECT r.id_receta, e.id_etiqueta
FROM (VALUES
    ('Ajiaco Santafereño','colombiana'), ('Ajiaco Santafereño','sopas'), ('Ajiaco Santafereño','saludable'),
    ('Bandeja Paisa','colombiana'),
    ('Arepas rellenas de queso','colombiana'), ('Arepas rellenas de queso','vegetariana'), ('Arepas rellenas de queso','rapida'),
    ('Sancocho de gallina','colombiana'), ('Sancocho de gallina','sopas'), ('Sancocho de gallina','saludable'),
    ('Empanadas colombianas','colombiana'), ('Empanadas colombianas','rapida'),
    ('Espagueti a la carbonara','italiana'),
    ('Pizza margarita casera','italiana'), ('Pizza margarita casera','vegetariana'),
    ('Tacos de pollo','mexicana'), ('Tacos de pollo','rapida'),
    ('Guacamole con totopos','mexicana'), ('Guacamole con totopos','vegana'), ('Guacamole con totopos','rapida'), ('Guacamole con totopos','saludable'),
    ('Pad Thai de camarón','asiatica'), ('Pad Thai de camarón','mariscos'),
    ('Pollo al curry panang','asiatica'),
    ('Ensalada griega con pollo','mediterranea'), ('Ensalada griega con pollo','saludable'), ('Ensalada griega con pollo','rapida'),
    ('Hummus con pan pita','mediterranea'), ('Hummus con pan pita','vegana'), ('Hummus con pan pita','saludable'), ('Hummus con pan pita','rapida'),
    ('Camarones al ajillo','mariscos'), ('Camarones al ajillo','mediterranea'),
    ('Panqueques con frutos rojos','postres')
) AS x(nombre_receta, nombre_etiqueta)
JOIN receta r ON r.nombre_receta = x.nombre_receta
JOIN etiqueta e ON e.nombre_etiqueta = x.nombre_etiqueta;

-- Restricciones: solo se marca la que la receta SÍ cumple (verificado ingrediente por ingrediente)
INSERT INTO receta_restriccion (id_receta, id_restriccion)
SELECT r.id_receta, res.id_restriccion
FROM (VALUES
    ('Ajiaco Santafereño','sin-cerdo'), ('Ajiaco Santafereño','sin-gluten'), ('Ajiaco Santafereño','sin-huevo'),
    ('Ajiaco Santafereño','sin-frutos-secos'), ('Ajiaco Santafereño','sin-mariscos'),

    ('Bandeja Paisa','sin-mariscos'), ('Bandeja Paisa','sin-frutos-secos'), ('Bandeja Paisa','sin-gluten'), ('Bandeja Paisa','sin-lactosa'),

    ('Arepas rellenas de queso','sin-cerdo'), ('Arepas rellenas de queso','sin-huevo'), ('Arepas rellenas de queso','sin-mariscos'),
    ('Arepas rellenas de queso','sin-frutos-secos'), ('Arepas rellenas de queso','sin-gluten'),

    ('Sancocho de gallina','sin-cerdo'), ('Sancocho de gallina','sin-gluten'), ('Sancocho de gallina','sin-huevo'),
    ('Sancocho de gallina','sin-frutos-secos'), ('Sancocho de gallina','sin-mariscos'), ('Sancocho de gallina','sin-lactosa'),

    ('Empanadas colombianas','sin-cerdo'), ('Empanadas colombianas','sin-huevo'), ('Empanadas colombianas','sin-mariscos'),
    ('Empanadas colombianas','sin-frutos-secos'), ('Empanadas colombianas','sin-gluten'), ('Empanadas colombianas','sin-lactosa'),

    ('Espagueti a la carbonara','sin-mariscos'), ('Espagueti a la carbonara','sin-frutos-secos'),

    ('Pizza margarita casera','sin-cerdo'), ('Pizza margarita casera','sin-huevo'), ('Pizza margarita casera','sin-mariscos'),
    ('Pizza margarita casera','sin-frutos-secos'),

    ('Tacos de pollo','sin-cerdo'), ('Tacos de pollo','sin-huevo'), ('Tacos de pollo','sin-mariscos'),
    ('Tacos de pollo','sin-frutos-secos'), ('Tacos de pollo','sin-lactosa'), ('Tacos de pollo','sin-gluten'),

    ('Guacamole con totopos','sin-cerdo'), ('Guacamole con totopos','sin-huevo'), ('Guacamole con totopos','sin-mariscos'),
    ('Guacamole con totopos','sin-frutos-secos'), ('Guacamole con totopos','sin-lactosa'), ('Guacamole con totopos','sin-gluten'),

    ('Pad Thai de camarón','sin-cerdo'), ('Pad Thai de camarón','sin-huevo'), ('Pad Thai de camarón','sin-lactosa'), ('Pad Thai de camarón','sin-gluten'),

    ('Pollo al curry panang','sin-cerdo'), ('Pollo al curry panang','sin-huevo'), ('Pollo al curry panang','sin-mariscos'),
    ('Pollo al curry panang','sin-frutos-secos'), ('Pollo al curry panang','sin-gluten'), ('Pollo al curry panang','sin-lactosa'),

    ('Ensalada griega con pollo','sin-cerdo'), ('Ensalada griega con pollo','sin-huevo'), ('Ensalada griega con pollo','sin-mariscos'),
    ('Ensalada griega con pollo','sin-frutos-secos'), ('Ensalada griega con pollo','sin-gluten'),

    ('Hummus con pan pita','sin-cerdo'), ('Hummus con pan pita','sin-huevo'), ('Hummus con pan pita','sin-mariscos'), ('Hummus con pan pita','sin-lactosa'),

    ('Camarones al ajillo','sin-cerdo'), ('Camarones al ajillo','sin-huevo'), ('Camarones al ajillo','sin-gluten'),
    ('Camarones al ajillo','sin-lactosa'), ('Camarones al ajillo','sin-frutos-secos'),

    ('Panqueques con frutos rojos','sin-cerdo'), ('Panqueques con frutos rojos','sin-mariscos'), ('Panqueques con frutos rojos','sin-frutos-secos')
) AS x(nombre_receta, nombre_restriccion)
JOIN receta r ON r.nombre_receta = x.nombre_receta
JOIN restriccion res ON res.nombre_restriccion = x.nombre_restriccion;


UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1751151497799-8b4057a2638e?w=1200&q=80' WHERE nombre_receta = 'Pasta al tomate rápida';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1565006114230-83988e94d432?w=1200&q=80' WHERE nombre_receta = 'Arroz con espinaca';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1687630433865-f86f07be989a?w=1200&q=80' WHERE nombre_receta = 'Huevos revueltos con queso';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1781334266250-a7e72fdf539f?w=1200&q=80' WHERE nombre_receta = 'Pechuga a la plancha con arroz';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1787424220565-d8bd8df7bc78?w=1200&q=80' WHERE nombre_receta = 'Carne molida con pimentón';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1644753787064-9f2846d6c995?w=1200&q=80' WHERE nombre_receta = 'Ajiaco Santafereño';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1702827495434-629df15aa136?w=1200&q=80' WHERE nombre_receta = 'Bandeja Paisa';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1619683909099-03814b162136?w=1200&q=80' WHERE nombre_receta = 'Arepas rellenas de queso';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1702827496401-216be3f435d0?w=1200&q=80' WHERE nombre_receta = 'Sancocho de gallina';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1587603366933-aa6947174c65?w=1200&q=80' WHERE nombre_receta = 'Empanadas colombianas';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1776715139722-26b9f0b23b3f?w=1200&q=80' WHERE nombre_receta = 'Tacos de pollo';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1648437595584-62d15da353b7?w=1200&q=80' WHERE nombre_receta = 'Guacamole con totopos';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1697126248475-a537cc5cce28?w=1200&q=80' WHERE nombre_receta = 'Hummus con pan pita';
UPDATE receta SET imagen_url = 'https://images.unsplash.com/photo-1599655345131-6eb73b81d8d6?w=1200&q=80' WHERE nombre_receta = 'Camarones al ajillo';



UPDATE receta SET
    pasos = ARRAY[
        'Hervir agua con sal y cocinar la pasta hasta que esté al dente.',
        'Picar la cebolla y el tomate en cubos pequeños.',
        'Sofreír la cebolla en aceite de oliva hasta que esté transparente.',
        'Agregar el tomate y cocinar 5 minutos hasta formar una salsa.',
        'Escurrir la pasta y mezclar con la salsa. Servir caliente.'
    ],
    calorias = 420, proteina_g = 12, carbos_g = 68, grasa_g = 10
WHERE nombre_receta = 'Pasta al tomate rápida';

UPDATE receta SET
    pasos = ARRAY[
        'Cocinar el arroz en agua con sal hasta que esté en su punto.',
        'Lavar y picar la espinaca finamente.',
        'Saltear la espinaca en aceite de oliva 3-4 minutos.',
        'Mezclar el arroz cocido con la espinaca salteada.',
        'Servir caliente.'
    ],
    calorias = 310, proteina_g = 7, carbos_g = 58, grasa_g = 6
WHERE nombre_receta = 'Arroz con espinaca';

UPDATE receta SET
    pasos = ARRAY[
        'Batir los huevos en un bowl con una pizca de sal.',
        'Calentar mantequilla o aceite en una sartén a fuego medio.',
        'Verter los huevos batidos en la sartén.',
        'Revolver constantemente y agregar el queso en trozos.',
        'Retirar del fuego cuando estén cremosos pero cocidos.'
    ],
    calorias = 320, proteina_g = 20, carbos_g = 4, grasa_g = 24
WHERE nombre_receta = 'Huevos revueltos con queso';

UPDATE receta SET
    pasos = ARRAY[
        'Sazonar la pechuga de pollo con sal, pimienta y especias al gusto.',
        'Calentar una plancha o sartén con un poco de aceite.',
        'Asar la pechuga 6-7 minutos por cada lado hasta que esté bien cocida.',
        'Cocinar el arroz por separado en agua con sal.',
        'Servir la pechuga en tajadas junto con el arroz.'
    ],
    calorias = 450, proteina_g = 40, carbos_g = 45, grasa_g = 10
WHERE nombre_receta = 'Pechuga a la plancha con arroz';

UPDATE receta SET
    pasos = ARRAY[
        'Picar la cebolla y el pimentón en cubos pequeños.',
        'Sofreír la cebolla y el pimentón en aceite hasta ablandar.',
        'Agregar la carne molida y cocinar hasta que dore, desmenuzando con una cuchara.',
        'Sazonar con sal, pimienta y comino al gusto.',
        'Servir caliente, acompañado de arroz o tortillas.'
    ],
    calorias = 390, proteina_g = 28, carbos_g = 10, grasa_g = 26
WHERE nombre_receta = 'Carne molida con pimentón';
