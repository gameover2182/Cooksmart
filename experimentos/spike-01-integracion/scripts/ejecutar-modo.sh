#!/usr/bin/env bash
# Ejecuta el protocolo pre-registrado para UN modo: calentamiento + 3 corridas,
# reiniciando la API en ese modo y restaurando el estado inicial antes de cada corrida.
# Uso (desde la raíz del repo): bash experimentos/spike-01-integracion/scripts/ejecutar-modo.sh sync|async
set -euo pipefail
MODO="$1"
SPIKE=experimentos/spike-01-integracion
(cd Docker/Postgre && FAVORITOS_MODO="$MODO" docker compose up -d api)
until curl -sf localhost:3000/health >/dev/null; do sleep 1; done
for CORRIDA in calentamiento run-1 run-2 run-3; do
  docker exec -i cooksmart psql -q -U admin -d cooksmart < "$SPIKE/scripts/preparar-usuarios.sql" >/dev/null
  echo "== $MODO $CORRIDA $(date -Iseconds)"
  k6 run --quiet -e MODO="$MODO" \
    --summary-export="$SPIKE/02-resultados/$MODO-$CORRIDA.json" \
    "$SPIKE/scripts/spike-favoritos.js" > "$SPIKE/logs/$MODO-$CORRIDA.log" 2>&1 || echo "k6 terminó con código $?"
  grep -E "favorito_post_duration|lectura_consistente|delete_antes|http_req_failed|iterations\.|errores_5xx" "$SPIKE/logs/$MODO-$CORRIDA.log" || true
done
