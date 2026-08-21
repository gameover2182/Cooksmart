# Condiciones del experimento

## Identificación

- Experimento: EXP-001-linea-base
- Tipo: medición de línea base
- Herramienta: k6
- Endpoint medido: GET /usuarios/{uid}/favoritos.json

## Entorno

- Sistema operativo: Windows
- Docker: instalado
- PostgreSQL: ejecutado mediante Docker
- k6: instalado
- Proyecto: Cook Smart

## PostgreSQL

- Contenedor: cooksmart-postgres
- Base de datos: cooksmart
- Puerto: 5432

## Condiciones de ejecución

- Equipo conectado a corriente durante las mediciones.
- Se utilizó el mismo equipo para las tres corridas.
- Se utilizó 1 VU.
- Duración de cada corrida: 10 segundos.
- Se realizó una corrida de warm-up antes de las tres corridas de control.
- La corrida de warm-up fue descartada y no se utilizó para los cálculos finales.

## Endpoint evaluado

Se midió la consulta de favoritos del usuario autenticado mediante Firebase
Realtime Database:

GET /usuarios/{uid}/favoritos.json

La autenticación se realiza previamente en la función setup() de k6.
La medición personalizada se concentra en la operación de consulta de
favoritos.

## Resultados de control

| Corrida | p95 | Throughput | Errores |
|---|---:|---:|---:|
| RUN-01 | 93 ms | 10.483579 req/s | 0% |
| RUN-02 | 104 ms | 9.306505 req/s | 0% |
| RUN-03 | 98 ms | 9.989478 req/s | 0% |

## Resultado consolidado

- Mediana de p95: 98 ms
- Mediana de throughput: 9.989478 req/s
- Errores HTTP: 0%

## Commit medido

La versión del proyecto utilizada para la medición corresponde al commit
presente en la rama `leo-k6` al momento de ejecutar las tres corridas
oficiales.

## Nota sobre PostgreSQL

El repositorio actual de Cook Smart utiliza Firebase Realtime Database
como mecanismo de persistencia para la funcionalidad evaluada. PostgreSQL
se levantó mediante Docker como parte del entorno solicitado para el
experimento, pero no participa directamente en la operación medida.