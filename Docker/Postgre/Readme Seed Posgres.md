# Documentación de `Docker/Postgre/init/` (esquema + semilla)

## Qué es y por qué existe

`01_schema.sql` y `02_seed.sql` son los dos scripts que Postgres ejecuta automáticamente, en ese orden, la **primera vez** que se crea el volumen `cooksmart_pgdata` (mecanismo estándar de la imagen oficial de Postgres: todo archivo `.sql` en `/docker-entrypoint-initdb.d/` se corre una sola vez, en orden alfabético, solo si el directorio de datos está vacío).

La semilla (`02_seed.sql`) cuenta con cada bloque de datos que fue diseñado para servir a un tipo específico de prueba del plan de QA del dossier (`PSeg`, `PR`, `PI`).

## Qué contiene, sección por sección

| Sección | Qué siembra | Para qué prueba sirve |
|---|---|---|
| 1. Catálogos base | 6 categorías de ingrediente, 18 ingredientes, 5 categorías de receta, 5 tipos de cocina | Datos de referencia que todo lo demás necesita (llaves foráneas) |
| 2. Recetas y sus ingredientes | 5 recetas completas con imagen, dificultad, porciones, e ingredientes vinculados | Prueba funcional básica de `GET /api/recetas` y `/api/recetas/:id` |
| 3. Usuarios | 1 cuenta fija de QA (`qa.seguridad@cooksmart.test`) + 5 cuentas funcionales + **200 cuentas sintéticas generadas con `generate_series`** | La cuenta fija con contraseña conocida sirve para **PSeg07 (fuerza bruta en login)** — necesitas un login real y repetible para atacarlo. Las 200 cuentas sintéticas existen únicamente para dar volumen a las **pruebas de rendimiento (PR01-PR07)** — no se puede medir throughput con una sola fila. |
| 4. Inventario de usuario (nevera) | Ítems con fechas de vencimiento deliberadamente variadas: ya vencidos, por vencer en 1-3 días, y vigentes; más 1000 filas sintéticas de inventario | Cubre los estados que necesita cualquier prueba de disponibilidad/gestión de nevera (**PI**) que filtre por estado de vencimiento, y da volumen para **PR**. |
| 5. Historial de recetas preparadas | Un puñado de registros de ejemplo | Prueba funcional de `GET /api/usuarios/:id/historial` |
| 6. Favoritos | 4 registros de ejemplo | Prueba funcional de `GET/POST/DELETE /api/.../favoritos`, incluyendo el caso de IDOR (PSeg03) |

## Por qué el volumen (200 usuarios, 1000 filas de inventario) y no solo 5-10 filas

Si la semilla solo tuviera un puñado de filas "bonitas", cualquier prueba de rendimiento (EXP-002, por ejemplo) estaría midiendo un caso irrealmente fácil — Postgres puede resolver una tabla de 10 filas sin usar índices siquiera. El volumen sintético existe para que las mediciones de latencia/throughput tengan algo de sustancia real que atravesar, y para poder decir con evidencia (no solo con la intención) que los índices creados en `01_schema.sql` (`idx_receta_categoria`, `idx_inventario_usuario`, etc.) están cumpliendo una función.

## Cómo se generan los 200 usuarios y 1000 filas de inventario

```sql
INSERT INTO usuario (nombre, correo, contrasena_hash, fecha_registro)
SELECT
    'Usuario Carga ' || g,
    'carga.usuario' || g || '@cooksmart.test',
    '$2b$12$...',
    now() - (random() * interval '180 days')
FROM generate_series(1, 200) AS g;
```

`generate_series(1, 200)` es la función nativa de Postgres para generar una secuencia numérica — se usa aquí en vez de escribir 200 líneas de `INSERT` a mano. Lo mismo se repite para las 1000 filas de inventario, con fechas de vencimiento aleatorias (`random()`) que a propósito incluyen algunas ya vencidas.

## Reiniciar la semilla desde cero

Como el script solo corre la primera vez que se crea el volumen, si ya levantaste el contenedor antes y quieres recargar la semilla (por ejemplo, después de editar `02_seed.sql`), hay que borrar el volumen explícitamente:

```bash
docker compose down -v   # -v borrando también el volumen cooksmart_pgdata
docker compose up -d --build
```