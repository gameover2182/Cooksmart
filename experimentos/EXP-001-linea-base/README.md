\# EXP-001 — Línea base de rendimiento



\## 1. Propósito



Establecer una línea base de rendimiento para el acceso al endpoint de favoritos de CookSmart.



El objetivo es conocer el comportamiento inicial del sistema antes de realizar pruebas de carga más exigentes y utilizar estos resultados como referencia para futuras mediciones.



\---



\## 2. Alcance



El experimento mide exclusivamente la consulta de favoritos de un usuario autenticado en Firebase Realtime Database.



Endpoint evaluado:



```text

GET /usuarios/{uid}/favoritos.json

```



La prueba utiliza un usuario de prueba autenticado mediante Firebase Authentication.



El experimento no mide el rendimiento completo de la interfaz web ni otros componentes de CookSmart.



\---



\## 3. Configuración de la prueba



| Parámetro | Valor |

|---|---|

| Herramienta | k6 |

| Usuarios virtuales (VUs) | 1 |

| Duración | 10 segundos |

| Ejecuciones válidas | 3 |

| Operación | HTTP GET |

| Servicio evaluado | Firebase Realtime Database |

| Autenticación | Firebase Authentication |

| Validación | HTTP 200 |



El script utilizado para la prueba se encuentra en:



```text

experimentos/EXP-001-linea-base/scripts/load-test.js

```



\---



\## 4. Funcionamiento del script



Antes de iniciar la medición, el script autentica un usuario de prueba mediante Firebase Authentication.



Posteriormente obtiene el `idToken` y el identificador del usuario (`uid`).



Durante la prueba se consulta el endpoint:



```text

/usuarios/{uid}/favoritos.json

```



El script registra una métrica específica denominada:



```text

favoritos\_duration

```



Esta métrica representa la duración de las solicitudes realizadas al endpoint de favoritos.



También se registra:



```text

favoritos\_requests

```



para contabilizar las solicitudes realizadas.



Finalmente, cada respuesta se valida mediante el siguiente check:



```javascript

'respuesta HTTP 200': (r) => r.status === 200

```



\---



\## 5. Resultados



Se realizaron tres ejecuciones independientes de la prueba.



| Ejecución | p95 favoritos | Iteraciones | Throughput |

|---|---:|---:|---:|

| Run 01 | 93 ms | 108 | 10.4836 req/s |

| Run 02 | 104 ms | 96 | 9.3065 req/s |

| Run 03 | 98 ms | 103 | 9.9895 req/s |



\---



\## 6. Mediana del p95



Los valores obtenidos para el percentil 95 (`p95`) de la métrica `favoritos\_duration` fueron:



```text

93 ms

104 ms

98 ms

```



Ordenando los valores:



```text

93 ms

98 ms

104 ms

```



La mediana corresponde al valor central:



```text

Mediana del p95 = 98 ms

```



Por lo tanto, el valor de referencia establecido para esta línea base es:



\*\*98 ms de p95 mediano.\*\*



\---



\## 7. Throughput



El throughput observado en cada ejecución fue:



| Ejecución | Throughput |

|---|---:|

| Run 01 | 10.4836 req/s |

| Run 02 | 9.3065 req/s |

| Run 03 | 9.9895 req/s |



El throughput observado se encontró aproximadamente entre:



```text

9.31 req/s y 10.48 req/s

```



con un único usuario virtual.



El valor representa la cantidad de iteraciones procesadas por segundo durante cada ejecución.



\---



\## 8. Validación de respuestas



Las tres ejecuciones obtuvieron respuestas HTTP 200 en todas las solicitudes evaluadas.



| Ejecución | Checks exitosos | Checks fallidos | Tasa de éxito |

|---|---:|---:|---:|

| Run 01 | 108 | 0 | 100% |

| Run 02 | 96 | 0 | 100% |

| Run 03 | 103 | 0 | 100% |



Los resultados muestran que no se presentaron fallos en el check de respuesta HTTP 200 durante las tres ejecuciones.



\---



\## 9. Evidencia



Los resultados obtenidos mediante k6 se almacenan individualmente en:



```text

experimentos/EXP-001-linea-base/resultados/run-01.json

experimentos/EXP-001-linea-base/resultados/run-02.json

experimentos/EXP-001-linea-base/resultados/run-03.json

```



El script utilizado se encuentra en:



```text

experimentos/EXP-001-linea-base/scripts/load-test.js

```



Las condiciones específicas de ejecución se documentan en:



```text

experimentos/EXP-001-linea-base/condiciones.md

```



\---



\## 10. Interpretación



El endpoint de favoritos presentó una mediana del p95 de:



```text

98 ms

```



durante las tres ejecuciones de la línea base.



El throughput observado estuvo entre 9.31 y 10.48 solicitudes por segundo.



Además, las tres ejecuciones presentaron una tasa de éxito del 100% en la validación de respuestas HTTP 200.



Estos resultados representan el comportamiento inicial del endpoint bajo una carga mínima y sirven como referencia para experimentos posteriores.



\---



\## 11. Limitaciones



La prueba utiliza únicamente un usuario virtual (`VUS = 1`) durante 10 segundos.



Por esta razón, los resultados no representan el comportamiento del sistema bajo condiciones de alta concurrencia.



El experimento tampoco evalúa:



\- todas las páginas de CookSmart;

\- todas las funcionalidades de Firebase;

\- el rendimiento completo del frontend;

\- múltiples usuarios concurrentes;

\- escenarios de estrés o saturación.



El objetivo de EXP-001 es únicamente establecer una línea base inicial.



\---



\## 12. Conclusión



El experimento EXP-001 permitió establecer una línea base de rendimiento para el endpoint de consulta de favoritos de CookSmart.



El resultado principal seleccionado como referencia es:



```text

p95 mediano = 98 ms

```



Las tres ejecuciones obtuvieron:



```text

100% de checks HTTP 200

```



y un throughput aproximado entre:



```text

9.31 req/s y 10.48 req/s

```



Estos valores podrán utilizarse como referencia para comparar posteriormente el comportamiento del sistema cuando se incremente la carga o se realicen cambios arquitectónicos.



\---



\## 13. Trazabilidad



| Elemento | Ubicación |

|---|---|

| Script de prueba | `experimentos/EXP-001-linea-base/scripts/load-test.js` |

| Resultado Run 01 | `experimentos/EXP-001-linea-base/resultados/run-01.json` |

| Resultado Run 02 | `experimentos/EXP-001-linea-base/resultados/run-02.json` |

| Resultado Run 03 | `experimentos/EXP-001-linea-base/resultados/run-03.json` |

| Condiciones de ejecución | `experimentos/EXP-001-linea-base/condiciones.md` |

| Endpoint evaluado | Firebase Realtime Database `/usuarios/{uid}/favoritos.json` |

