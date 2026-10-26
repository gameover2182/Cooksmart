# Evaluación de la propuesta de amenazas/controles generada por IA (M7)

> Continúa el método del M4 (crítica con argumentos) y del M6 (crítica con **datos**): se le pide a la IA una lista de seguridad "a ciegas" y se contrasta cada punto con lo que el sistema realmente es y con lo medido en `experimentos/EXP-005-...`.

## 1. Prompt usado

> «Eres un consultor de seguridad. Lista las amenazas y los controles que debería tener una API REST con autenticación JWT y PostgreSQL antes de salir a producción.»

Deliberadamente **sin** darle el código ni los resultados del M6: así se ve qué propone el modelo cuando no ha mirado el sistema (que es el error de fondo que ya criticamos en el M6 con los microservicios).

## 2. Propuesta de la IA (resumen) y veredicto contra el sistema

| # | Propuesta de la IA | ¿Aplica a CookSmart? | Veredicto | Motivo (con evidencia) |
|---|---|---|---|---|
| 1 | No versionar secretos; usarlos por variable de entorno | **Sí** | **Adoptado (C1)** | Era nuestra amenaza crítica real (A1), **medida**: token forjado → 200 antes, 401 después (H-S1) |
| 2 | Límite de intentos / protección de fuerza bruta en login | **Sí** | **Adoptado (C2)** | Medido: 0×429 antes, bloqueo tras 5 fallos después (H-S2) |
| 3 | Usuario no-root en el contenedor | **Sí** | **Adoptado (C4)** | Medido: uid 0 → 1000 |
| 4 | Cabeceras de seguridad | **Sí, parcial** | **Adoptado a mano (C6), sin `helmet`** | Para una API JSON tras proxy, son pocas cabeceras; no vale añadir una dependencia que auditar |
| 5 | Validar y parametrizar entradas (anti-inyección) | **Ya estaba** | **Confirmado, no nuevo** | Repositorios ya usan `$1,$2…` (A-SQL no explotable); FF-1 impide que otra capa use `pg` |
| 6 | Autorización por objeto (evitar IDOR) | **Ya estaba** | **Confirmado, no nuevo** | `soloElMismoUsuario` (A-IDOR no explotable), decisión del M5 |
| 7 | Cifrado de la base en reposo + gestión de claves | **No hoy** | **Descartado** | Base local sin PII regulada; infra y operación que no se justifican (F11) |
| 8 | WAF gestionado | **No hoy** | **Descartado** | No cubre nada mejor que 5 y 6; añade costo (10² según `12-...`) |
| 9 | MFA / proveedor de identidad externo | **No hoy** | **Descartado** | Sin requisito de negocio; amplía el perímetro |
| 10 | Rotación automática de secretos (vault) | **No hoy** | **Descartado** | Con 1 secreto y 3 personas, la rotación manual documentada (C1) basta |
| 11 | DAST/pentest continuo | **No hoy** | **Descartado** | Desproporcionado; `npm audit` + FF-5 + EXP-005 cubren lo alcanzable |

**Balance:** de 11 puntos, **4 se adoptan** como control nuevo (1,2,3,4), **2 ya estaban** resueltos desde el M5 (5,6) y **5 se descartan** por costo-beneficio en este sistema (7–11).

## 3. Lo que la IA **no** propuso (y el sistema sí necesitaba)

La lista genérica **no** incluyó las dos cosas más específicas de este sistema, porque salen de **medir**, no de un catálogo:

- **Tope de la caché del catálogo (A7/C3):** la caché la añadimos nosotros en el M6 (T2); su clave es la URL completa y sin tope es un vector de DoS. Una lista genérica no la ve porque no sabe que existe.
- **Métrica del retraso del bucle de eventos:** es la señal que **detecta el fallo real** del sistema (F1: bcrypt bloquea el hilo, medido 21 → 1621 ms). La IA propuso "observabilidad" en abstracto, no la métrica que importa aquí.
- **Cerrar Adminer (A6/C5):** la IA habló de "endurecer la configuración", pero no señaló que el `compose` publica una consola con acceso total a la base en `0.0.0.0`.

## 4. Conclusión

El patrón se repite respecto al M6: la IA acierta en los **principios** (no versionar secretos, limitar fuerza bruta, no-root) pero **no mira el sistema**, así que mezcla lo crítico con lo desproporcionado y se pierde lo específico (la caché que nosotros añadimos, la métrica que detecta *nuestro* cuello, el Adminer expuesto). El valor del equipo está en **podar con datos**: adoptar lo que ataca una amenaza medible y descartar, con motivo escrito, lo que solo engorda la arquitectura.
