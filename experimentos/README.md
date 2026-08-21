# EXP-001 — Línea base de Cook Smart

## 1. Objetivo

Realizar una medición de línea base del comportamiento de una operación real de Cook Smart utilizando la herramienta de pruebas de carga k6.

El objetivo es obtener valores de referencia de latencia y throughput para utilizarlos posteriormente como punto de comparación en futuras mediciones del proyecto.

---

## 2. Operación evaluada

La operación seleccionada corresponde a la consulta de favoritos de un usuario autenticado en Firebase Realtime Database.

### Endpoint

GET /usuarios/{uid}/favoritos.json

La consulta utiliza el identificador de un usuario existente y obtiene la información almacenada en la ruta de favoritos correspondiente.

---

## 3. Herramientas utilizadas

- k6
- Docker
- PostgreSQL
- Firebase Authentication
- Firebase Realtime Database
- Visual Studio Code
- Git
- GitHub
- Windows

---

## 4. Estructura del experimento

El experimento se organizó de la siguiente manera:

EXP-001-linea-base/
├── README.md
├── condiciones.md
├── scripts/
│   └── load-test.js
├── resultados/
│   ├── run-01.json
│   ├── run-02.json
│   └── run-03.json
└── logs/

### Descripción de los directorios

- `scripts/`: contiene los scripts utilizados para ejecutar las pruebas con k6.
- `resultados/`: contiene los resultados exportados de las tres corridas oficiales.
- `logs/`: directorio destinado a almacenar registros adicionales del experimento.
- `condiciones.md`: documenta las condiciones bajo las cuales se realizó la medición.
- `README.md`: contiene la descripción, procedimiento y resultados del experimento.

---

## 5. Configuración de la prueba

La prueba fue configurada con las siguientes características:

- Usuarios virtuales (VUs): 1
- Duración: 10 segundos
- Corridas oficiales: 3
- Warm-up: 1 corrida descartada

Se utilizó un único usuario virtual para obtener una medición de línea base de la operación evaluada.

---

## 6. Procedimiento

El procedimiento realizado fue el siguiente:

1. Se preparó el entorno de ejecución.
2. Se verificó la disponibilidad de Docker.
3. Se levantó PostgreSQL mediante un contenedor Docker.
4. Se verificó la instalación y funcionamiento de k6.
5. Se configuró el script `load-test.js`.
6. Se configuró la autenticación necesaria para acceder a la operación evaluada.
7. Se realizó una primera corrida de warm-up.
8. La corrida de warm-up fue descartada y no se utilizó para los cálculos finales.
9. Se realizaron tres corridas oficiales de control.
10. Cada corrida fue ejecutada utilizando `--summary-export`.
11. Los resultados fueron almacenados en archivos JSON.
12. Se registraron los valores de p95 y throughput de cada corrida.
13. Se calculó la mediana de los tres valores de p95.
14. Se calculó la mediana de los tres valores de throughput.

---

## 7. Comandos utilizados

### Warm-up

La primera ejecución se realizó como corrida de calentamiento y fue descartada de los resultados finales.

### RUN-01

```powershell
k6 run --summary-export=experimentos/EXP-001-linea-base/resultados/run-01.json experimentos/EXP-001-linea-base/scripts/load-test.js