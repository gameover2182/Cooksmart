# Condiciones del experimento

## Entorno

- Sistema operativo: Windows
- Docker: instalado
- PostgreSQL: ejecutado mediante Docker
- k6: instalado

## PostgreSQL

- Contenedor: cooksmart-postgres
- Base de datos: cooksmart
- Puerto: 5432

## Nota

El repositorio actual de Cook Smart utiliza Firebase Realtime
Database como mecanismo de persistencia. PostgreSQL se levanta
como parte del entorno solicitado para el experimento, pero no
participa directamente en la operación real evaluada.