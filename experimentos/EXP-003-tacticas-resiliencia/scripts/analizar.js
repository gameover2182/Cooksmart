// EXP-003 / EXP-004: medianas de 3 corridas por configuración y métricas derivadas.
// Uso: node experimentos/EXP-003-tacticas-resiliencia/scripts/analizar.js <carpeta resultados> [prefijos...]
//   p. ej.: ... analizar.js experimentos/EXP-003-tacticas-resiliencia/resultados base t1 t2
const fs = require('fs');
const path = require('path');
const [dir, ...configs] = process.argv.slice(2);
const mediana = (a) => { const s = a.filter((x) => !isNaN(x)).sort((x, y) => x - y); const n = s.length; if (!n) return NaN; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };

function cpu(archivo, contenedor) {
  if (!fs.existsSync(archivo)) return NaN;
  const filas = fs.readFileSync(archivo, 'utf8').trim().split('\n').slice(1).map((l) => l.split(','));
  return mediana(filas.filter((r) => r[1] === contenedor).map((r) => parseFloat(r[2])));
}

const salida = {};
for (const c of configs) {
  const filas = [1, 2, 3].map((i) => {
    const f = path.join(dir, `${c}-run-${i}.json`);
    const m = JSON.parse(fs.readFileSync(f)).metrics;
    const duracion = m.http_reqs.count / m.http_reqs.rate;
    // En un Rate de k6, "passes" cuenta los valores true y "fails" los false.
    // fallo_login registra cada login NO rechazado: false = login exitoso (200).
    const loginsOk = m.fallo_login ? m.fallo_login.fails : 0;
    return {
      p95_sin_login: m.op_sin_login ? m.op_sin_login['p(95)'] : NaN,
      fallo_sin_login: m.fallo_sin_login ? m.fallo_sin_login.value : NaN,
      p95_login: m.op_login ? m.op_login['p(95)'] : NaN,
      fallo_login: m.fallo_login ? m.fallo_login.value : NaN,
      rechazo_controlado: m.login_rechazo_controlado.value,
      p95_rechazo: m.login_rechazo_duracion ? m.login_rechazo_duracion['p(95)'] : NaN,
      logins_ok: loginsOk,
      logins_ok_por_s: loginsOk / duracion,
      iteraciones_completas: m.iteracion_completa.passes,
      http_reqs: m.http_reqs.count,
      cpu_api: cpu(f.replace('.json', '-recursos.csv'), 'cooksmart-api'),
      cpu_db: cpu(f.replace('.json', '-recursos.csv'), 'cooksmart'),
      duracion_s: duracion,
    };
  });
  salida[c] = {};
  for (const k of Object.keys(filas[0])) salida[c][k] = mediana(filas.map((f) => f[k]));
  salida[c].por_corrida = filas;
}
console.log(JSON.stringify(salida, null, 1));
