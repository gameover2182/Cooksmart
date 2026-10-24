#!/usr/bin/env bash
# EXP-004: compara la API con 1 y con 4 workers (cluster de Node) a 500 VUs,
# con el instrumento de EXP-003. Muestrea CPU de la API y de PostgreSQL.
# Uso (desde cualquier carpeta):
#   bash experimentos/EXP-004-distribucion-nucleos/scripts/ejecutar.sh               # protocolo completo
#   bash experimentos/EXP-004-distribucion-nucleos/scripts/ejecutar.sh "1 4" 1 20s     # demo en vivo
set -uo pipefail
RAIZ="$(cd "$(dirname "$0")/../../.." && pwd)"
EXP="$RAIZ/experimentos/EXP-004-distribucion-nucleos"
INSTRUMENTO="$RAIZ/experimentos/EXP-003-tacticas-resiliencia/scripts/recorrido-tacticas.js"
WORKERS="${1:-1 4}"
CORRIDAS="${2:-3}"
DURACION="${3:-60s}"
VUS="${VUS:-500}"
SALIDA="${SALIDA:-$EXP/resultados}"
mkdir -p "$SALIDA" "$EXP/logs"

muestrear() {
  echo "ts,contenedor,cpu_pct,mem" > "$1"
  while true; do
    docker stats --no-stream --format '{{.Name}},{{.CPUPerc}},{{.MemUsage}}' cooksmart-api cooksmart 2>/dev/null \
      | while IFS= read -r linea; do echo "$(date +%s),$linea" >> "$1"; done
  done
}

correr() {  # $1 = nombre
  until curl -sf localhost:3000/health >/dev/null; do sleep 1; done
  muestrear "$SALIDA/$1-recursos.csv" & PID_M=$!
  echo "== $1 ($VUS VUs, $DURACION) $(date -Iseconds)"
  k6 run --quiet -e VUS="$VUS" -e DURACION="$DURACION" \
    --summary-export="$SALIDA/$1.json" "$INSTRUMENTO" > "$EXP/logs/$1.log" 2>&1
  kill $PID_M 2>/dev/null; wait $PID_M 2>/dev/null
  grep -E "op_login|fallo_login|op_sin_login" "$EXP/logs/$1.log" || true
  sleep 10
}

for N in $WORKERS; do
  (cd "$RAIZ/Docker/Postgre" && API_WORKERS=$N LOGIN_BULKHEAD=off CACHE_CATALOGO=off docker compose up -d api >/dev/null 2>&1)
  until curl -sf localhost:3000/health >/dev/null; do sleep 1; done
  echo "API_WORKERS=$(docker exec cooksmart-api printenv API_WORKERS)"
  [ $# -eq 0 ] && correr "w$N-calentamiento"
  for i in $(seq 1 "$CORRIDAS"); do correr "w$N-run-$i"; done
done
(cd "$RAIZ/Docker/Postgre" && API_WORKERS=1 docker compose up -d api >/dev/null 2>&1)
