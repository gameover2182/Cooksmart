# Presentación ejecutiva del dossier (M8)

> La presentación ejecutiva es un **deck** (no un archivo del repositorio): se construyó como artefacto de diapositivas para la defensa del Corte 3. Este documento la referencia y deja por escrito su estructura y sus cifras, para que el dossier sea autocontenido y un auditor pueda comprobar que **las cifras del deck coinciden con los documentos del M8**.

## Enlace

Deck de 12 diapositivas (privado; se comparte desde el menú *Share* del propio deck). Mismo lenguaje visual que las defensas de M6 y M7.

## Estructura (12 diapositivas) y de dónde sale cada cifra

| # | Diapositiva | Cifra / afirmación clave | Fuente en el dossier |
|---|---|---|---|
| 1 | Portada | 10/12 afirmaciones medidas · 5 experimentos · 2 fitness functions | `15-evidencia-ejecutable.md` §1 |
| 2 | La pregunta, respondida | 10 medidas / 1 argumento / 1 no concluyente | `15-evidencia-ejecutable.md` §1–§2 |
| 3 | Evidencia (medido vs argumento) | E1–E12 | `15-evidencia-ejecutable.md` §1 |
| 4 | Las 3 acusaciones | sobreingeniería / insegura / sin crecer | `16-matriz-trade-offs.md` §3 |
| 5 | Trade-offs y costo | D0 10¹ · D1 10¹ (4,4×) · D2 10² · D3 10³ | `16-matriz-trade-offs.md` §2 |
| 6 | Riesgos | P1/P2/P5/P8/P9 | `17-riesgos-priorizados.md` |
| 7 | Re-decisión (3 restricciones) | presupuesto / PII / 100× | `evaluacion-arquitectonica.md` §2 |
| 8 | IA adversarial | refutadas vs aceptadas | `evaluacion-arquitectonica.md` §3 |
| 9 | Plan de evolución | disparadores medibles | `plan-evolucion.md` |
| 10 | Recorte si se pierde 1 integrante | mantener/congelar/cortar | `evaluacion-arquitectonica.md` §4 |
| 11 | Declaración de IA | aceptado/modificado/rechazado | `declaracion-ia-final.md` |
| 12 | Cierre | «corran los experimentos» | `15-evidencia-ejecutable.md` §0 |

## Cifras que deben coincidir (control de consistencia)

- Crecimiento 10× → **73 %** de logins fallan; CPU API **100 %** de 1 núcleo, PostgreSQL **≈2 %** (E1).
- Bulkhead: P95 del resto **6,8 s → 0,55 s** (−92 %) (E2).
- Caché: **−37 %** (E3). Distribución: **4,4×** logins/s (E4).
- Seguridad: token forjado **200 → 401** (E7); fuerza bruta **0×429 → bloqueo a los 5** (E8).
- Observabilidad: retraso del bucle de eventos **21 ms → 1621 ms** (E9).
- Costo microservicios: **~10³ USD/mes** vs **10¹** (E5, argumento declarado).

Si alguna cifra del deck no coincide con estas, manda el dossier (que es la fuente), no el deck.
