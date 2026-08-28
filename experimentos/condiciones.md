# Condiciones del experimento EXP-001 — Línea base

## 1. Identificación

**Experimento:** EXP-001 — Línea base  
**Proyecto:** CookSmart  
**Objetivo:** establecer una línea base de rendimiento para el acceso al endpoint de favoritos de Firebase Realtime Database.

**Commit medido:** El experimento se ejecutó sobre el estado del repositorio utilizado durante las mediciones.

Para verificar el commit exacto:
`git rev-parse HEAD`

---

## 2. Entorno de ejecución

### Sistema operativo
Windows.

### Equipo
La medición se realizó desde un equipo personal de desarrollo.

### Alimentación
El equipo se encontraba conectado a la alimentación eléctrica durante la ejecución de las pruebas.

### Conectividad
El experimento requiere conexión a Internet debido a que el endpoint evaluado pertenece a Firebase Realtime Database.

---

## 3. Software utilizado

| Herramienta | Uso |
|---|---|
| Git | Control de versiones del proyecto |
| PowerShell | Ejecución de comandos |
| Docker | Entorno de apoyo para infraestructura |
| k6 | Ejecución de pruebas de carga |
| Firebase Authentication | Autenticación del usuario de prueba |
| Firebase Realtime Database | Servicio utilizado por el endpoint evaluado |

---

## 4. Sistema evaluado

El sistema evaluado corresponde al estado actual de CookSmart implementado como una aplicación web basada en:

- HTML
- CSS
- JavaScript
- Firebase Authentication
- Firebase Realtime Database

En esta medición no se evaluó un backend propio ni una base de datos relacional.

---

## 5. Endpoint evaluado

Se evaluó la consulta de favoritos de un usuario autenticado en Firebase Realtime Database.

El patrón del endpoint utilizado por el script es:

`https://cook-smart-626ff-default-rtdb.firebaseio.com/usuarios/{uid}/favoritos.json`

El acceso se realiza utilizando el token de autenticación obtenido mediante Firebase Authentication.

---

## 6. Configuración de k6

El script utilizado fue:

`experimentos/EXP-001-linea-base/scripts/load-test.js`

La configuración principal utilizada fue:

`vus: 1`
`duration: '10s'`

Por lo tanto, cada ejecución utilizó:

- 1 usuario virtual.
- 10 segundos de duración.
- Ejecución repetitiva de la consulta al endpoint de favoritos.

La autenticación se realiza en la función `setup()` antes de comenzar la medición.

---

## 7. Métricas registradas

El script registra específicamente:

### favoritos_duration
Mide la duración de las peticiones realizadas al endpoint de favoritos.

### favoritos_requests
Cuenta la cantidad de solicitudes realizadas al endpoint de favoritos.

También se utilizaron métricas estándar de k6:

- `http_req_duration`
- `http_req_failed`
- `iterations`
- `checks`

El check principal utilizado fue:

`respuesta HTTP 200`

Este check permite comprobar que la respuesta del endpoint fue exitosa.

---

## 8. Ejecuciones realizadas

Se realizaron tres ejecuciones de control:

| Ejecución | Archivo |
|---|---|
| Run 01 | `resultados/run-01.json` |
| Run 02 | `resultados/run-02.json` |
| Run 03 | `resultados/run-03.json` |

Los resultados completos se encuentran en:

`experimentos/EXP-001-linea-base/resultados/`

---

## 9. Resultados utilizados para la línea base

Los valores de `p(95)` obtenidos para `favoritos_duration` fueron:

| Ejecución | p95 |
|---|---:|
| Run 01 | 93 ms |
| Run 02 | 104 ms |
| Run 03 | 98 ms |

La mediana de los tres valores es:

`Mediana p95 = 98 ms`

Por lo tanto:

**Línea base de p95 del endpoint de favoritos: 98 ms.**

---

## 10. Throughput observado

| Ejecución | Iteraciones | Tasa |
|---|---:|---:|
| Run 01 | 108 | 10.48 iter/s |
| Run 02 | 96 | 9.31 iter/s |
| Run 03 | 103 | 9.99 iter/s |

La tasa promedio aproximada de las tres ejecuciones es:

`Throughput promedio ≈ 9.93 iter/s`

Estos valores representan el comportamiento observado con una única VU durante 10 segundos.

---

## 11. Validación de las respuestas

Las tres ejecuciones obtuvieron respuestas HTTP exitosas en el check definido por el script.

| Ejecución | Checks exitosos | Checks fallidos |
|---|---:|---:|
| Run 01 | 108 | 0 |
| Run 02 | 96 | 0 |
| Run 03 | 103 | 0 |

Esto permite utilizar los resultados como una línea base para el endpoint evaluado bajo las condiciones establecidas.

---

## 12. Estructura del experimento

`experimentos/`
`└── EXP-001-linea-base/`
`    ├── condiciones.md`
`    ├── logs/`
`    │   └── .gitkeep`
`    ├── resultados/`
`    │   ├── .gitkeep`
`    │   ├── run-01.json`
`    │   ├── run-02.json`
`    │   └── run-03.json`
`    └── scripts/`
`        └── load-test.js`

---

## 13. Procedimiento general

1. Ejecutar el script de k6 correspondiente al endpoint de favoritos.
2. Autenticar un usuario de prueba mediante Firebase Authentication.
3. Consultar el endpoint de favoritos del usuario autenticado.
4. Registrar la duración de cada petición.
5. Ejecutar tres pruebas de control.
6. Guardar los resultados en archivos JSON independientes.
7. Extraer el `p(95)` de `favoritos_duration`.
8. Calcular la mediana de los tres valores.
9. Utilizar la mediana como referencia de línea base.

---

## 14. Limitaciones

Esta línea base corresponde a una prueba con:

- 1 usuario virtual.
- 10 segundos de duración.
- Un único endpoint.
- Firebase como servicio externo.
- Conexión a Internet.

Por lo tanto, estos resultados no representan todavía el comportamiento del sistema bajo alta concurrencia.

El objetivo de esta prueba es establecer una referencia inicial que permita comparar posteriormente cambios en la implementación o en la arquitectura del sistema.

---

## 15. Reproducibilidad

Para repetir el experimento se debe utilizar:

`experimentos/EXP-001-linea-base/scripts/load-test.js`

El script requiere:

`FIREBASE_API_KEY`
`FIREBASE_TEST_EMAIL`
`FIREBASE_TEST_PASSWORD`

Estas variables permiten realizar la autenticación del usuario de prueba sin incluir las credenciales directamente en el script.

La prueba debe ejecutarse manteniendo:

`1 VU`
`10 segundos`

Los resultados pueden guardarse nuevamente dentro de:

`experimentos/EXP-001-linea-base/resultados/`

---

## 16. Evidencia

Los resultados originales se conservan en:

`experimentos/EXP-001-linea-base/resultados/run-01.json`
`experimentos/EXP-001-linea-base/resultados/run-02.json`
`experimentos/EXP-001-linea-base/resultados/run-03.json`

El script utilizado se conserva en:

`experimentos/EXP-001-linea-base/scripts/load-test.js`

Estos archivos permiten revisar las métricas obtenidas y comprobar los valores utilizados para establecer la línea base.

---

## 17. Línea base final

| Métrica | Línea base |
|---|---:|
| Endpoint | `/usuarios/{uid}/favoritos.json` |
| Usuarios virtuales | 1 |
| Duración | 10 s |
| p95 de `favoritos_duration` | **98 ms** |
| Throughput promedio | **9.93 iter/s** |
| Checks fallidos | **0** |

Esta línea base será utilizada como punto de comparación para futuras modificaciones del sistema y evaluaciones de rendimiento.