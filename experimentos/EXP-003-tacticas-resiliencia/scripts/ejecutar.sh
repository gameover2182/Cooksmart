#!/usr/bin/env bash
# EXP-003: compara línea base, T1 (bulkhead de login) y T2 (caché de catálogo)
# en el mismo commit, misma máquina, mismo script. Por cada configuración:
# reinicia la API con sus variables, 1 calentamiento (descartado) + 3 corridas.
# Uso (desde la raíz del repo):
#   bash experimentos/EXP-003-tacticas-resiliencia/scripts/ejecutar.sh               # protocolo completo
#   bash experimentos/EXP-003-tacticas-resiliencia/scripts/ejecutar.sh "base t1" 1 20s  # demo en vivo
set -uo pipefail
RAIZ="$(cd "$(dirname "$0")/../../.." && pwd)"
EXP="$RAIZ/experimentos/EXP-003-tacticas-resiliencia"
CONFIGS="${1:-base t1 t2}"
CORRIDAS="${2:-3}"
DURACION="${3:-60s}"
VUS="${VUS:-500}"
SALIDA="${SALIDA:-$EXP/resultados}"
mkdir -p "$SALIDA" "$EXP/logs"

levantar() {  # $1 = config
  local bulkhead=off cache=off
  [ "$1" = t1 ] && bulkhead=on
  [ "$1" = t2 ] && cache=on
  (cd "$RAIZ/Docker/Postgre" && LOGIN_BULKHEAD=$bulkhead CACHE_CATALOGO=$cache docker compose up -d api >/dev/null 2>&1)
  until curl -sf localhost:3000/health >/dev/null; do sleep 1; done
  echo "API: LOGIN_BULKHEAD=$(docker exec cooksmart-api printenv LOGIN_BULKHEAD) CACHE_CATALOGO=$(docker exec cooksmart-api printenv CACHE_CATALOGO)"
}

correr() {  # $1 = config  $2 = nombre
  until curl -sf localhost:3000/health >/dev/null; do sleep 1; done
  echo "== $2 ($VUS VUs, $DURACION) $(date -Iseconds)"
  k6 run --quiet -e VUS="$VUS" -e DURACION="$DURACION" -e CONFIG="$1" \
    --summary-export="$SALIDA/$2.json" "$EXP/scripts/recorrido-tacticas.js" > "$EXP/logs/$2.log" 2>&1
  grep -E "op_sin_login|op_login|login_rechazo_controlado|fallo_sin_login" "$EXP/logs/$2.log" || true
  sleep 10
}

for CONFIG in $CONFIGS; do
  levantar "$CONFIG"
  [ $# -eq 0 ] && correr "$CONFIG" "$CONFIG-calentamiento"
  for i in $(seq 1 "$CORRIDAS"); do correr "$CONFIG" "$CONFIG-run-$i"; done
done
levantar base   # dejar la API como estaba
