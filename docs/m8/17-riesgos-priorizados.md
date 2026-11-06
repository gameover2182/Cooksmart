# 17 · Riesgos arquitectónicos priorizados — CookSmart (M8)

> Consolida los riesgos de los módulos anteriores (R-01…R-10 del dossier, F1–F12 de la matriz de fallos del M6, O-1…O-8 operativos y R-S1…R-S5 residuales de seguridad del M7) en **una sola lista priorizada** por impacto × probabilidad, cada uno con mitigación realista y su estado.
>
> Escala: impacto y probabilidad en Alto / Medio / Bajo. Prioridad = combinación, ordenada de mayor a menor. **Medido** = hay experimento que lo respalda; **Inferido** = razonamiento.

## 1. Riesgos priorizados

| # | Riesgo | Impacto | Prob. | Base | Mitigación | Estado |
|---|---|---|---|---|---|---|
| **P1** | Saturación de autenticación al crecer (bcrypt satura 1 núcleo) | Alto | Alta | **Medido** (E1/EXP-002) | Escalar en núcleos (D1, +4,4×) + bulkhead (T1) | Mitigación medida (E4/E2); activación pendiente de medir combinada |
| **P2** | Secreto/credencial filtrado o no rotado | Alto | Media | **Medido** (E7) | Secreto fuera del repo + rotación (C1) + FF-5 en CI | **Cerrado y vigilado** |
| **P3** | Healthcheck reinicia la API bajo carga (F12) | Alto | Media | **Medido** (EXP-003) | Despliegue D-A sin orquestador que reinicie por liveness; `start-period` holgado | Mitigado por decisión (ADR-005) |
| **P4** | Fuerza bruta contra una cuenta | Alto | Media | **Medido** (E8) | Límite de intentos por (IP, correo) (C2) | **Cerrado** |
| **P5** | Sin señales propias: un incidente pasa inadvertido (F4) | Alto | Media | **Medido** (E9) | Logs JSON + métrica del bucle de eventos + alertas (M7) | **Cerrado** (detecta F1 a 1621 ms) |
| **P6** | Contagio: el login lento arrastra al resto de la API (F2) | Alto | Alta | **Medido** (E1) | Bulkhead (T1): aísla el login, −92 % P95 del resto | Mitigación medida (E2) |
| **P7** | Pérdida de datos por crash con escritura async | Alto | Baja | **Medido** (E6) | Escrituras síncronas (ADR-003) | **Evitado por diseño** |
| **P8** | Equipo de 3 sin guardias; operación no sostenible (F11) | Medio | Alta | Inferido | No distribuir (ADR-004); alertas pocas y accionables; D-A simple | Mitigado por decisión |
| **P9** | Límites por proceso ineficaces con N workers (R-S3) | Medio | Media | Inferido | Mover estado a almacén compartido antes de escalar workers | Pendiente (condición de ADR-004) |
| **P10** | Caída de PostgreSQL (F6) | Alto | Baja | Inferido (no ocurrió bajo carga) | `/health` + alerta + volumen persistente + respaldo | Parcial |
| **P11** | TLS caducado / ausente en producción (R-S4) | Alto | Baja | Inferido | Renovación automática en el proxy (D-A) | Plan (depende del despliegue) |
| **P12** | Consultas N+1 en `GET /recetas` al crecer el catálogo (F7) | Medio | Baja | Inferido | Paginación + revisar subconsultas cuando el catálogo crezca | Pendiente (hoy invisible) |
| **P13** | Enumeración de cuentas en `/registro` (R-S1) | Bajo | Media | **Medido** (409) | Riesgo aceptado (usabilidad del registro) | Aceptado, documentado |
| **P14** | Token válido tras cambiar contraseña (R-S2) | Medio | Baja | **Medido** | Aceptado con `exp` de 7 días | Aceptado, documentado |

## 2. Mapa de prioridad (impacto × probabilidad)

```
            Prob. ALTA        Prob. MEDIA         Prob. BAJA
IMPACTO   ┌───────────────┬──────────────────┬──────────────────┐
  ALTO    │ P1  P6        │ P2 P3 P4 P5      │ P7 P10 P11       │
          ├───────────────┼──────────────────┼──────────────────┤
  MEDIO   │ P8            │ P9 P14*          │ P12              │
          ├───────────────┼──────────────────┼──────────────────┤
  BAJO    │               │ P13              │                  │
          └───────────────┴──────────────────┴──────────────────┘
  (*P14 impacto medio / prob. baja; ubicado por impacto)
```

Los dos de arriba-izquierda (P1, P6) son los que **ya mitigamos con medición**. Los de arriba-centro están cerrados (P2, P4, P5) o mitigados por decisión (P3).

## 3. Lo que un comité hostil atacaría primero, y la respuesta

- **«P1 solo lo mitigaron por separado»** → cierto; la combinación D1+T1+T2 es condición de entrada declarada en ADR-004, no un supuesto escondido (P9).
- **«P10 y P11 no los midieron»** → cierto, y están marcados *Inferido*; P10 no ocurrió porque la BD estuvo al 2–8 % en todos los experimentos, lo cual **sí** está medido.
- **«P8 es un riesgo de equipo, no de arquitectura»** → precisamente por eso la arquitectura se eligió simple: la decisión de no distribuir (ADR-004) **es** la mitigación de un riesgo de equipo.
