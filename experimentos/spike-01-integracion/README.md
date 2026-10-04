# Spike 1 — Integración síncrona vs asíncrona (escritura de favoritos)

**Pregunta:** ¿procesar de forma asíncrona la escritura de un favorito (encolar + `202`) mejora la latencia lo suficiente como para justificar la consistencia eventual que introduce?

**Veredicto:** **AJUSTADA** — la latencia del `POST` baja 41,5 %, pero solo el 54,7 % de las lecturas inmediatas ve el favorito. La API se mantiene síncrona (ADR-003).

| Archivo | Contenido | Commit |
|---|---|---|
| `00-preregistro.md` | Hipótesis H1/H2/H0, regla de veredicto, alcance, qué no se modifica | `912fd90` (antes de implementar y medir) |
| `scripts/spike-favoritos.js` | Instrumento k6 (fijado en el pre-registro) | `912fd90` |
| `scripts/preparar-usuarios.sql` | 50 usuarios de prueba + estado inicial | `912fd90` |
| *(código del spike)* | `FAVORITOS_MODO`, cola en memoria, `202` | `f5d2506` (revertido después del veredicto) |
| `01-condiciones.md` | Máquina, datos, procedimiento, commit medido | `912fd90` + `e4135e9` |
| `scripts/ejecutar-modo.sh` | Automatiza calentamiento + 3 corridas por modo | `e4135e9` |
| `02-resultados/*.json`, `logs/*.log` | Datos crudos de k6 | `e4135e9` |
| `03-veredicto.md` | Tabla de corridas, medianas, veredicto, qué cambia, qué no se verificó | commit de veredicto |

## Reproducir

```bash
git checkout e4135e9                       # commit con el código del spike y el instrumento
cd Docker/Postgre && docker compose up -d --build && cd ../..
bash experimentos/spike-01-integracion/scripts/ejecutar-modo.sh sync
bash experimentos/spike-01-integracion/scripts/ejecutar-modo.sh async
```

Requisitos: Docker Desktop en ejecución, k6 ≥ 0.50, el usuario `k6test@cooksmart.local` existente en la base (lo usa `preparar-usuarios.sql` para copiar el hash).

Referenciado por: [`docs/adr/ADR-003-integracion-entre-contextos.md`](../../docs/adr/ADR-003-integracion-entre-contextos.md).
