#!/usr/bin/env bash
# EXP-002: ejecuta el protocolo pre-registrado.
#   1 calentamiento a 50 VUs (descartado) + 3 corridas por nivel de carga.
#   Mientras corre k6, muestrea CPU/memoria de los contenedores cada ~2 s
#   y el número de conexiones activas a PostgreSQL.
# Uso (desde la raíz del repo):
#   bash experimentos/EXP-002-crecimiento-10x/scripts/ejecutar.sh            # protocolo completo
#   bash experimentos/EXP-002-crecimiento-10x/scripts/ejecutar.sh 500 1 20s  # demo en vivo: 1 corrida a 500 VUs de 20 s
set -uo pipefail
EXP=experimentos/EXP-002-crecimiento-10x
NIVELES="${1:-50 100 250 500}"
CORRIDAS="${2:-3}"
DURACION="${3:-60s}"
SALIDA="${SALIDA:-$EXP/resultados}"
mkdir -p "$SALIDA" "$EXP/logs"

muestrear() {  # $1 = archivo CSV
  echo "ts,contenedor,cpu_pct,mem,conexiones_pg" > "$1"
  while true; do
    conexiones=$(docker exec cooksmart psql -U admin -d cooksmart -tAc \
      "select count(*) from pg_stat_activity where datname='cooksmart' and state <> 'idle'" 2>/dev/null || echo NA)
    docker stats --no-stream --format '{{.Name}},{{.CPUPerc}},{{.MemUsage}}' cooksmart-api cooksmart 2>/dev/null \
      | while IFS= read -r linea; do echo "$(date +%s),$linea,$conexiones" >> "$1"; done
  done
}

correr() {  # $1 = VUs  $2 = nombre
  until curl -sf localhost:3000/health >/dev/null; do sleep 1; done
  muestrear "$SALIDA/$2-recursos.csv" & PID_M=$!
  echo "== $2 ($1 VUs, $DURACION) $(date -Iseconds)"
  k6 run --quiet -e VUS="$1" -e DURACION="$DURACION" \
    --summary-export="$SALIDA/$2.json" "$EXP/scripts/recorrido.js" > "$EXP/logs/$2.log" 2>&1
  kill $PID_M 2>/dev/null; wait $PID_M 2>/dev/null
  grep -E "op_login|op_recetas|http_req_failed|iteracion_completa|http_reqs" "$EXP/logs/$2.log" || true
  sleep 10   # enfriamiento entre corridas
}

if [ $# -eq 0 ]; then correr 50 calentamiento-50vu; fi
for VUS in $NIVELES; do
  for i in $(seq 1 "$CORRIDAS"); do correr "$VUS" "${VUS}vu-run-$i"; done
done
