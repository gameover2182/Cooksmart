-- =====================================================================
-- CookSmart - Esquema de base de datos (PostgreSQL)
--
-- CAMBIO CLAVE respecto al diagrama original:
-- La tabla "ingrediente" original mezclaba dos conceptos distintos:
--   (a) un CATÁLOGO genérico de ingredientes (ej. "Tomate", "Huevo")
--   (b) una INSTANCIA específica en la nevera de un usuario, con
--       fecha_compra, fecha_vencimiento y dueño (id_usuario)
-- Esto rompía la normalización: una receta ("Pasta con tomate") no
-- puede depender de la nevera de un usuario específico ni de una
-- fecha de compra puntual. Por eso se separó en dos tablas:
--   - ingrediente            (catálogo genérico, sin dueño ni fechas)
--   - inventario_usuario     (instancia real en la nevera de un usuario)
--
-- NOTA DE ALCANCE: el módulo de notificaciones de vencimiento y el
-- módulo de motor de IA descritos en el documento inicial NO están
-- implementados en el proyecto actual (solo búsqueda/gestión de
-- recetas, nevera y perfil). Por eso este esquema no incluye una
-- tabla de notificaciones ni componentes de IA; inventario_usuario
-- conserva fecha_vencimiento porque sigue siendo un dato propio de
-- la gestión de la nevera (RF04), independiente de si existe o no
-- un mecanismo de notificación sobre ese campo.
--
-- CAMBIO DE ARQUITECTURA (decisión del equipo, en curso): Firebase se
-- mantiene ÚNICAMENTE como proveedor de autenticación (login/registro).
-- Todo lo demás -- recetas, favoritos, inventario, historial -- vive en
-- Postgres. Por eso "usuario" tiene firebase_uid (identidad real,
-- verificada por el backend contra Firebase en cada request) y
-- contrasena_hash pasa a ser opcional: solo lo usan las cuentas de
-- prueba de QA que se autentican directo contra el backend (bcrypt+JWT),
-- sin pasar por Firebase -- conviven dos mecanismos de auth a propósito.
-- =====================================================================

CREATE TABLE usuario (
    id_usuario        SERIAL PRIMARY KEY,
    firebase_uid      VARCHAR(128) UNIQUE,
    nombre            VARCHAR(100) NOT NULL,
    correo            VARCHAR(150) NOT NULL UNIQUE,
    contrasena_hash   VARCHAR(255),
    fecha_registro    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE categoria_ingrediente (
    id_categoria_ing  SERIAL PRIMARY KEY,
    nombre_categoria  VARCHAR(80) NOT NULL UNIQUE
);

-- Catálogo genérico de ingredientes (sin dueño, sin fechas de compra/vencimiento)
CREATE TABLE ingrediente (
    id_ingrediente     SERIAL PRIMARY KEY,
    id_categoria_ing   INT NOT NULL REFERENCES categoria_ingrediente(id_categoria_ing),
    nombre_ingrediente VARCHAR(100) NOT NULL UNIQUE,
    unidad_base        VARCHAR(30)
);

-- Instancia real de un ingrediente en la nevera de un usuario
CREATE TABLE inventario_usuario (
    id_inventario      SERIAL PRIMARY KEY,
    id_usuario         INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_ingrediente     INT NOT NULL REFERENCES ingrediente(id_ingrediente),
    cantidad           DECIMAL(8,2) NOT NULL DEFAULT 1,
    unidad             VARCHAR(30) NOT NULL,
    fecha_compra       DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento  DATE,
    activo             BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE categoria_receta (
    id_categoria_rec  SERIAL PRIMARY KEY,
    nombre_categoria  VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE tipo_cocina (
    id_tipo_cocina  SERIAL PRIMARY KEY,
    nombre_tipo     VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE receta (
    id_receta        SERIAL PRIMARY KEY,
    id_categoria_rec INT NOT NULL REFERENCES categoria_receta(id_categoria_rec),
    id_tipo_cocina   INT NOT NULL REFERENCES tipo_cocina(id_tipo_cocina),
    nombre_receta    VARCHAR(150) NOT NULL,
    descripcion      TEXT,
    instrucciones    TEXT,
    tiempo_prep_min  INT NOT NULL CHECK (tiempo_prep_min > 0),
    imagen_url       VARCHAR(500),
    dificultad       VARCHAR(20) NOT NULL DEFAULT 'Fácil' CHECK (dificultad IN ('Fácil','Media','Difícil')),
    porciones        INT NOT NULL DEFAULT 2 CHECK (porciones > 0)
);

-- Ingredientes requeridos por una receta (referencia el catálogo, no la nevera)
CREATE TABLE receta_ingrediente (
    id_receta       INT NOT NULL REFERENCES receta(id_receta) ON DELETE CASCADE,
    id_ingrediente  INT NOT NULL REFERENCES ingrediente(id_ingrediente),
    cantidad        DECIMAL(8,2) NOT NULL,
    unidad          VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_receta, id_ingrediente)
);

CREATE TABLE historial_receta (
    id_historial       SERIAL PRIMARY KEY,
    id_usuario         INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_receta          INT NOT NULL REFERENCES receta(id_receta) ON DELETE CASCADE,
    fecha_preparacion  TIMESTAMP NOT NULL DEFAULT now()
);

-- Favoritos: reemplaza el sync que antes hacía firebase-sync.js contra
-- Firebase Realtime Database (usuarios/{uid}/favoritos).
CREATE TABLE favorito (
    id_usuario      INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_receta       INT NOT NULL REFERENCES receta(id_receta) ON DELETE CASCADE,
    fecha_agregado  TIMESTAMP NOT NULL DEFAULT now(),
    PRIMARY KEY (id_usuario, id_receta)
);

-- Etiquetas de receta (ej. "colombiana", "sopas") y restricciones
-- dietéticas (ej. "sin-gluten", "vegano"). 
CREATE TABLE etiqueta (
    id_etiqueta     SERIAL PRIMARY KEY,
    nombre_etiqueta VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE receta_etiqueta (
    id_receta    INT NOT NULL REFERENCES receta(id_receta) ON DELETE CASCADE,
    id_etiqueta  INT NOT NULL REFERENCES etiqueta(id_etiqueta) ON DELETE CASCADE,
    PRIMARY KEY (id_receta, id_etiqueta)
);

CREATE TABLE restriccion (
    id_restriccion     SERIAL PRIMARY KEY,
    nombre_restriccion VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE receta_restriccion (
    id_receta       INT NOT NULL REFERENCES receta(id_receta) ON DELETE CASCADE,
    id_restriccion  INT NOT NULL REFERENCES restriccion(id_restriccion) ON DELETE CASCADE,
    PRIMARY KEY (id_receta, id_restriccion)
);

-- Índices para las consultas más frecuentes del sistema
CREATE INDEX idx_inventario_usuario ON inventario_usuario(id_usuario);
CREATE INDEX idx_inventario_vencimiento ON inventario_usuario(fecha_vencimiento);
CREATE INDEX idx_historial_usuario ON historial_receta(id_usuario);
CREATE INDEX idx_favorito_usuario ON favorito(id_usuario);
CREATE INDEX idx_receta_categoria ON receta(id_categoria_rec);
CREATE INDEX idx_receta_tipo_cocina ON receta(id_tipo_cocina);