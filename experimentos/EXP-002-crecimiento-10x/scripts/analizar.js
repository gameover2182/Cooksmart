// EXP-002: calcula medianas (3 corridas) por nivel de carga a partir de resultados/*.json y *-recursos.csv
// Uso: node experimentos/EXP-002-crecimiento-10x/scripts/analizar.js [carpeta resultados]
const fs = require('fs');
const path = require('path');
const dir = process.argv[2] || path.join(__dirname, '..', 'resultados');
const OPS = ['login', 'perfil', 'recetas', 'detalle', 'categorias', 'tipos_cocina', 'ingredientes', 'favoritos', 'historial', 'inventario'];
const mediana = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const niveles = [...new Set(fs.readdirSync(dir).filter((f) => /^\d+vu-run-\d+\.json$/.test(f)).map((f) => Number(f.split('vu')[0])))].sort((a, b) => a - b);
const salida = {};
for (const n of niveles) {
  const corridas = fs.readdirSync(dir).filter((f) => f.startsWith(`${n}vu-run-`) && f.endsWith('.json'));
  const filas = corridas.map((f) => {
    const m = JSON.parse(fs.readFileSync(path.join(dir, f))).metrics;
    const csv = fs.readFileSync(path.join(dir, f.replace('.json', '-recursos.csv')), 'utf8').trim().split('\n').slice(1).map((l) => l.split(','));
    const cpu = (c) => mediana(csv.filter((r) => r[1] === c).map((r) => parseFloat(r[2])));
    const conex = mediana(csv.map((r) => Number(r[4])).filter((x) => !isNaN(x)));
    const r = { cpu_api: cpu('cooksmart-api'), cpu_db: cpu('cooksmart'), conexiones_pg: conex,
      http_reqs: m.http_reqs.count, rps: m.http_reqs.rate, http_req_failed: m.http_req_failed.value,
      iteraciones: m.iterations.count, iteracion_completa: m.iteracion_completa.value };
    for (const op of OPS) { r[`p95_${op}`] = m[`op_${op}`]?.['p(95)']; r[`fallo_${op}`] = m[`fallo_${op}`]?.value; }
    return r;
  });
  salida[n] = {};
  for (const k of Object.keys(filas[0])) salida[n][k] = mediana(filas.map((f) => f[k] ?? NaN));
  salida[n].corridas = filas.length;
}
console.log(JSON.stringify(salida, null, 1));
