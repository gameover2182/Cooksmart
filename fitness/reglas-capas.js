#!/usr/bin/env node
// Fitness function FF-1 — Reglas de dependencia entre capas (ADR-002).
//
// Regla:   cada archivo del backend solo puede importar (require) módulos
//          internos de las capas que ADR-002 le permite, y solo config/ puede
//          importar el driver de PostgreSQL ('pg').
// Umbral:  0 violaciones.
// Rompe CI: cualquier violación → exit code 1 (el job "Fitness functions" falla).
//
// Uso: node fitness/reglas-capas.js [directorio src]   (por defecto Docker/Postgre/backend/src)

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(process.argv[2] || 'Docker/Postgre/backend/src');

// capa → capas internas que puede importar (ADR-002 §6 "Dependencias permitidas")
const PERMITIDAS = {
    '(raíz)': ['routes', 'controllers', 'services', 'repositories', 'middlewares', 'config'], // server.js = composición
    routes: ['controllers', 'middlewares'],
    controllers: ['services'],
    services: ['services', 'repositories'],
    repositories: ['config'],
    middlewares: ['services', 'config'],
    config: [],
};
// paquetes externos restringidos a ciertas capas
const PAQUETES_RESTRINGIDOS = { pg: ['config'] };

function archivosJs(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) return e.name === 'node_modules' ? [] : archivosJs(p);
        return e.name.endsWith('.js') ? [p] : [];
    });
}

function capaDe(archivo) {
    const rel = path.relative(SRC, archivo).split(path.sep);
    return rel.length === 1 ? '(raíz)' : rel[0];
}

const violaciones = [];
const archivos = archivosJs(SRC);

for (const archivo of archivos) {
    const capa = capaDe(archivo);
    const lineas = fs.readFileSync(archivo, 'utf8').split('\n');
    lineas.forEach((linea, i) => {
        for (const m of linea.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)) {
            const destino = m[1];
            const donde = `${path.relative(process.cwd(), archivo)}:${i + 1}`;
            if (destino.startsWith('.')) {
                const capaDestino = capaDe(path.resolve(path.dirname(archivo), destino));
                const permitidas = PERMITIDAS[capa];
                if (!permitidas) {
                    violaciones.push(`${donde}  capa desconocida "${capa}" (agréguela a ADR-002 y a esta regla)`);
                } else if (!permitidas.includes(capaDestino)) {
                    violaciones.push(`${donde}  ${capa} → ${capaDestino} no está permitido (permitidas: ${permitidas.join(', ') || 'ninguna'})`);
                }
            } else if (PAQUETES_RESTRINGIDOS[destino] && !PAQUETES_RESTRINGIDOS[destino].includes(capa)) {
                violaciones.push(`${donde}  ${capa} importa '${destino}' directamente (solo permitido en: ${PAQUETES_RESTRINGIDOS[destino].join(', ')})`);
            }
        }
    });
}

console.log(`FF-1 reglas de capas (ADR-002): ${archivos.length} archivos revisados en ${path.relative(process.cwd(), SRC) || '.'}`);
if (violaciones.length) {
    console.error(`FALLA: ${violaciones.length} violación(es):`);
    violaciones.forEach((v) => console.error(`  - ${v}`));
    process.exit(1);
}
console.log('OK: 0 violaciones.');
