# Spike 1 — Condiciones de ejecución

> Registrado antes de medir. Los valores marcados *(se completa al ejecutar)* se llenan en el commit de resultados.

## 1. Entorno

| Elemento | Valor |
|---|---|
| Sistema operativo | Windows 11 Home Single Language 10.0.26300 |
| CPU | Intel Core 5 210H — 8 núcleos / 12 hilos |
| RAM | 15,6 GB |
| Docker | Docker Desktop, Engine 29.7.2 (12 CPU y ≈ 7,6 GB asignados a la VM) |
| PostgreSQL | 16.15 (`postgres:16-alpine`), contenedor `cooksmart` |
| API | Node.js (imagen construida desde `Docker/Postgre/backend/Dockerfile`), contenedor `cooksmart-api`, puerto 3000 |
| Generador de carga | k6 v2.2.0 (windows/amd64), ejecutado en el **mismo** equipo que los contenedores |
| Red | `localhost` (sin red real; k6 y la API comparten CPU — limitación declarada) |
| Otros procesos | VS Code abierto; sin otras cargas intencionales |

## 2. Datos

| Elemento | Valor |
|---|---|
| Recetas en la base | 20 (ids 1–20) |
| Usuarios de prueba | 50 (`spike01_u01` … `spike01_u50`), contraseña de `k6test` |
| Favoritos al inicio de cada corrida | 0 para los usuarios del spike |

## 3. Procedimiento

```bash
# 0. (una vez) reconstruir la API en el commit de implementación
cd Docker/Postgre
docker compose up -d --build api

# 1. Preparar datos antes de CADA corrida
docker exec -i cooksmart psql -U admin -d cooksmart < ../../experimentos/spike-01-integracion/scripts/preparar-usuarios.sql

# 2. Modo sync
FAVORITOS_MODO=sync docker compose up -d api      # reinicia la API en modo sync
k6 run -e MODO=sync --summary-export=../../experimentos/spike-01-integracion/02-resultados/sync-calentamiento.json ../../experimentos/spike-01-integracion/scripts/spike-favoritos.js
#    (repetir paso 1 y luego run-1, run-2, run-3)

# 3. Modo async
FAVORITOS_MODO=async docker compose up -d api
#    (calentamiento + run-1..3, con paso 1 antes de cada una)
```

## 4. Commit medido

`f5d2506` — `feat(spike-01): escritura asincrona de favoritos detras de FAVORITOS_MODO`. La imagen de la API se reconstruyó sobre ese commit (`docker compose up -d --build api`) el 2026-10-04, antes de la primera corrida. Ambas series usan **la misma imagen**; solo cambia `FAVORITOS_MODO`.

## 5. Ejecución real

| Serie | Inicio del calentamiento | Comando |
|---|---|---|
| sync | 2026-10-04 12:44:23 −05:00 | `bash experimentos/spike-01-integracion/scripts/ejecutar-modo.sh sync` |
| async | 2026-10-04 12:48:22 −05:00 | `bash experimentos/spike-01-integracion/scripts/ejecutar-modo.sh async` |

- Antes de cada corrida: `preparar-usuarios.sql` (0 favoritos para los usuarios del spike).
- Al pasar a async la API se **recreó** con `FAVORITOS_MODO=async` (verificado con `docker exec cooksmart-api printenv FAVORITOS_MODO`; además el `setup()` de k6 aborta si el `POST` no devuelve el código esperado: 201 en sync, 202 en async).
- Al terminar: 0 filas huérfanas en `favorito` para los usuarios del spike; 0 líneas `Cola de favoritos: no se pudo aplicar el alta` en `docker logs cooksmart-api`.
- Los JSON de `02-resultados/` son el `--summary-export` de k6 **sin** la clave `setup_data` (se eliminó porque contenía los JWT de los usuarios de prueba). Los resúmenes completos de consola están en `logs/`.
