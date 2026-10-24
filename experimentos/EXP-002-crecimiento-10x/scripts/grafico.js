// EXP-002: genera resultados/degradacion-vs-carga.svg a partir de resultados/mediana-por-nivel.json
// Dos paneles (no doble eje): P95 en segundos y % de solicitudes fallidas, por nivel de carga.
// Uso: node experimentos/EXP-002-crecimiento-10x/scripts/grafico.js
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'resultados');
const d = JSON.parse(fs.readFileSync(path.join(dir, 'mediana-por-nivel.json')));
const niveles = Object.keys(d).map(Number).sort((a, b) => a - b);
const SIN_LOGIN = ['perfil', 'recetas', 'detalle', 'categorias', 'tipos_cocina', 'ingredientes', 'favoritos', 'historial', 'inventario'];
const mediana = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };

const login = niveles.map((n) => d[n].p95_login / 1000);
const resto = niveles.map((n) => mediana(SIN_LOGIN.map((op) => d[n][`p95_${op}`])) / 1000);
const fallos = niveles.map((n) => d[n].http_req_failed * 100);

const C = { fondo: '#fcfcfb', texto: '#0b0b0b', texto2: '#52514e', rejilla: '#e4e3df', s1: '#2a78d6', s2: '#eb6834', ref: '#52514e' };
const W = 1320, H = 560, PANEL_W = 460, PANEL_H = 330, TOP = 110, LEFT = [100, 760];

function panel(x0, titulo, unidad, yMax, ticks, series, refLinea) {
  const xs = niveles.map((_, i) => x0 + (i * PANEL_W) / (niveles.length - 1));
  const y = (v) => TOP + PANEL_H - (v / yMax) * PANEL_H;
  let s = `<text x="${x0}" y="${TOP - 40}" font-size="20" font-weight="600" fill="${C.texto}">${titulo}</text>`;
  for (const t of ticks) {
    s += `<line x1="${x0}" x2="${x0 + PANEL_W}" y1="${y(t)}" y2="${y(t)}" stroke="${C.rejilla}" stroke-width="1"/>`;
    s += `<text x="${x0 - 12}" y="${y(t) + 5}" font-size="15" text-anchor="end" fill="${C.texto2}">${t}${unidad}</text>`;
  }
  niveles.forEach((n, i) => {
    s += `<text x="${xs[i]}" y="${TOP + PANEL_H + 28}" font-size="15" text-anchor="middle" fill="${C.texto2}">${n} VUs</text><text x="${xs[i]}" y="${TOP + PANEL_H + 48}" font-size="14" text-anchor="middle" fill="${C.texto2}">(${n / 50}×)</text>`;
  });
  if (refLinea) {
    s += `<line x1="${x0}" x2="${x0 + PANEL_W}" y1="${y(refLinea.v)}" y2="${y(refLinea.v)}" stroke="${C.ref}" stroke-width="2" stroke-dasharray="6 5"/>`;
    s += `<text x="${x0 + 8}" y="${y(refLinea.v) - 8}" font-size="14" fill="${C.texto2}">${refLinea.etiqueta}</text>`;
  }
  for (const se of series) {
    const pts = se.valores.map((v, i) => `${xs[i]},${y(v)}`).join(' ');
    s += `<polyline points="${pts}" fill="none" stroke="${se.color}" stroke-width="2.5" stroke-linejoin="round"/>`;
    se.valores.forEach((v, i) => {
      s += `<circle cx="${xs[i]}" cy="${y(v)}" r="5" fill="${se.color}" stroke="${C.fondo}" stroke-width="2"><title>${se.nombre}, ${niveles[i]} VUs: ${v.toFixed(se.dec)}${se.unidad}</title></circle>`;
    });
    const ult = se.valores.length - 1;
    s += `<text x="${xs[ult]}" y="${y(se.valores[ult]) - 14}" font-size="15" font-weight="600" text-anchor="middle" fill="${C.texto}">${se.valores[ult].toFixed(se.dec)}${se.unidad}</text>`;
  }
  return s;
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial, Helvetica, sans-serif" role="img" aria-label="Degradación de CookSmart al crecer de 50 a 500 usuarios virtuales">`;
svg += `<rect width="${W}" height="${H}" fill="${C.fondo}"/>`;
svg += `<text x="40" y="36" font-size="24" font-weight="700" fill="${C.texto}">EXP-002 — ¿Qué falla primero al crecer 10×? (medianas de 3 corridas)</text>`;
svg += panel(LEFT[0], 'P95 por operación (segundos)', ' s', 60, [0, 10, 20, 30, 40, 50, 60], [
  { nombre: 'Login', valores: login, color: C.s1, dec: 1, unidad: ' s' },
  { nombre: 'Resto (mediana de 9 operaciones)', valores: resto, color: C.s2, dec: 1, unidad: ' s', dy: 5 },
], { v: 3, etiqueta: 'RNF04: 3 s' });
svg += panel(LEFT[1], 'Solicitudes fallidas (%)', ' %', 25, [0, 5, 10, 15, 20, 25], [
  { nombre: 'Solicitudes fallidas', valores: fallos, color: C.s1, dec: 1, unidad: ' %' },
], { v: 1, etiqueta: 'umbral 1 %' });
// leyenda (2 series en el panel izquierdo)
svg += `<rect x="100" y="${H - 42}" width="16" height="4" fill="${C.s1}"/><text x="124" y="${H - 34}" font-size="15" fill="${C.texto}">Login (bcrypt)</text>`;
svg += `<rect x="260" y="${H - 42}" width="16" height="4" fill="${C.s2}"/><text x="284" y="${H - 34}" font-size="15" fill="${C.texto}">Resto: mediana del P95 de las 9 operaciones sin login</text>`;
svg += `<text x="760" y="${H - 34}" font-size="15" fill="${C.texto2}">k6 corta cada solicitud a los 60 s (techo del login).</text>`;
svg += '</svg>';
fs.writeFileSync(path.join(dir, 'degradacion-vs-carga.svg'), svg);
console.log('login', login.map((v) => v.toFixed(1)), 'resto', resto.map((v) => v.toFixed(2)), 'fallos', fallos.map((v) => v.toFixed(2)));
