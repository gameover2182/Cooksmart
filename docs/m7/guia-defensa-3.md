# Guía de defensa — Módulo 7 (seguridad, despliegue, observabilidad)

> Script de ~8 min + demo en vivo + Q&A. Mismo formato que `docs/m6/guia-defensa-2.md`.

## Guion (8 min)

1. **La pregunta (30 s).** «Si el sistema falla en producción, ¿sabríamos qué pasó, dónde, a quién afectó y qué decisión lo permitió?» Hoy el M6 ya nos dijo que **no** teníamos ninguna señal (F4). El M7 lo arregla y, de paso, cierra agujeros de seguridad reales.
2. **No lo supusimos, lo medimos (1 min).** Igual que en los módulos anteriores, pre-registramos hipótesis (EXP-005) y medimos **antes y después** contra el stack real.
3. **La amenaza crítica (1,5 min).** El `JWT_SECRET` estaba en el `docker-compose.yml`, en un repo público. Con él, cualquiera forja un token de cualquier usuario. **Medido:** token forjado → **200** antes, **401** después de rotarlo y sacarlo del repo. Y una fitness function (FF-5) impide que vuelva a entrar.
4. **Los otros controles (1,5 min).** Fuerza bruta → límite de intentos (0×429 → bloqueo tras 5, por cuenta no por IP). Adminer cerrado al exterior. API no-root. Cabeceras. Caché acotada. Todo con variable de entorno y reversible.
5. **Observabilidad = responder la pregunta (1,5 min).** Logs JSON con `X-Request-Id` (dónde/a quién, sin filtrar datos: la ruta va como patrón `/api/usuarios/:id/...`). Métrica del retraso del bucle de eventos: **21 ms en reposo → 1621 ms bajo carga de login**. Esa métrica **detecta el fallo real del M6** (F1). `/metrics` protegido con token.
6. **Despliegue y costo (1 min).** Un host con proxy (D-A) vs PaaS gestionado (D-B). Elegimos D-A: controla TLS, puertos y `healthcheck` —justo las piezas donde el M6 vio el riesgo (F12)— y cuesta un orden de magnitud menos. El free tier queda como experimento del nivel avanzado.
7. **ADR-005 + riesgos operativos (30 s).** Decisión acoplada, matriz de 8 riesgos operativos, riesgos residuales aceptados **por escrito** (token tras cambio de contraseña, enum. de cuentas).
8. **Cierre (30 s).** La pregunta del módulo tiene respuesta con número: sabríamos que el hilo se bloqueó porque el lag pasa de 21 a 1621 ms, en qué ruta por el log, a quién por el id de usuario, y qué lo permitió porque está en el ADR.

## Demo en vivo (elige una, todas son rápidas)

**A. La fitness function rompe (lo que pide el docente):**
```bash
node fitness/sin-secretos.js                 # OK: 0 secretos
cp Docker/Postgre/docker-compose.yml /tmp/malo.yml
printf '\n      JWT_SECRET: %s\n' "$(openssl rand -hex 16)" >> /tmp/malo.yml  # inyecta un secreto real
node fitness/sin-secretos.js /tmp/malo.yml   # FALLA + exit 1  → el PR se pondría rojo
```

**B. El control de secreto funciona (antes/después):**
```bash
cd experimentos/EXP-005-controles-seguridad-observabilidad
node scripts/verificar-seguridad.js despues  # H-S1: token forjado → 401
```

**C. La observabilidad detecta el fallo:**
```bash
docker restart cooksmart-api
MT=$(docker exec cooksmart-api printenv METRICS_TOKEN)
METRICS_TOKEN=$MT node experimentos/EXP-005-controles-seguridad-observabilidad/scripts/verificar-observabilidad.js
# H-O1: lag p99 21 ms (reposo) → ~1600 ms (bajo carga)
```

## Preguntas probables y respuesta corta

- **«¿Qué regla protege FF-5 y qué pasa en CI si se viola?»** Protege C1: el `JWT_SECRET` fuera del repo. Si alguien lo recommitea, el job de seguridad falla y el PR queda en rojo antes del merge, con archivo y línea. Tiene autoprueba para no "pasar siempre".
- **«¿El límite de login no bloquea a usuarios legítimos?»** No: solo cuenta intentos **fallidos** y un acierto limpia el contador; la clave es (IP, correo), así que no bloquea una IP entera por una cuenta atacada. Medido: otra cuenta desde la misma IP sigue dando 401, no 429.
- **«Si el hilo está saturado, ¿`/metrics` responde?»** Puede que no (es el mismo mecanismo del F12). Por eso la **ausencia** de métricas es una alerta (`APISinMétricas`): no nos deja ciegos.
- **«¿Por qué no `helmet`/vault/WAF?»** Costo-beneficio para 3 personas y este sistema; descartados con motivo en `10-seguridad.md` §4 y en la evaluación de la IA.
- **«¿Rotaron el secreto o solo lo movieron?»** Las dos cosas: el valor nuevo está solo en `.env` (no versionado); el viejo del repo ya no sirve (token forjado con él → 401).

## Declaración de uso de IA

Los borradores (controles, scripts, fitness functions, ADR, estos documentos) se hicieron con asistencia de IA bajo revisión del equipo. La lista de amenazas generada por IA se podó con los datos del sistema (`docs/ia/evaluacion-amenazas-ia-m7.md`): se adoptó lo que ataca una amenaza medible y se descartó, con motivo, lo genérico.
