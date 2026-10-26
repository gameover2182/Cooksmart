#!/usr/bin/env node
// Fitness function FF-5 (M7) — Ningún secreto en archivos versionados.
//
// Regla:   los archivos que se suben al repo no deben contener secretos con
//          valor literal (JWT_SECRET, contraseñas, claves privadas, tokens).
//          Es la contraparte en CI del control C1: el secreto se sacó del
//          docker-compose.yml y debe QUEDARSE fuera.
// Umbral:  0 hallazgos.
// Rompe CI: cualquier hallazgo → exit 1 (el job de seguridad falla y bloquea el PR).
//
// Qué protege y qué pasa si se viola (lo que pregunta el docente):
//   si alguien vuelve a escribir `JWT_SECRET: <valor>` en el compose, o pega
//   una clave privada, este job falla ANTES del merge y señala archivo y línea.
//
// Uso: node fitness/sin-secretos.js            (escanea archivos rastreados por git)
//      node fitness/sin-secretos.js <ruta...>  (escanea rutas concretas, para la autoprueba)

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Archivos que legítimamente describen el formato del secreto (no son el secreto).
const EXCEPCIONES = [/\.env\.example$/, /fitness[/\\]sin-secretos\.js$/];

// Valores que NO son un secreto real: referencias, interpolaciones y marcadores
// de prueba desechables que es aceptable tener versionados (p. ej. el JWT ficticio
// que usan los jobs de CI contra una base de datos efímera que nunca tiene datos).
const VALORES_SEGUROS = /^(process\.env|\$\{|%s|"\$|'\$|\$\(|["']?(rellenar|ci-test-secret|ci-build-secret|changeme|test-secret|example|dummy))/;

const REGLAS = [
    {
        nombre: 'JWT_SECRET con valor literal',
        // Captura el valor a la derecha de JWT_SECRET: / JWT_SECRET= y lo compara
        // contra la lista de valores seguros. Así `= process.env.JWT_SECRET` (una
        // referencia) y `: ci-test-secret` (fixture de CI) no se marcan.
        re: /JWT_SECRET\s*[:=]\s*(.+)$/,
        valor: (m) => m[1].trim().replace(/[;,]$/, ''),
    },
    { nombre: 'Clave privada PEM', re: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/ },
    { nombre: 'Token tipo AWS Access Key', re: /AKIA[0-9A-Z]{16}/ },
];

function archivos(args) {
    if (args.length) {
        // Modo autoprueba: rutas explícitas (pueden ser archivos).
        return args.flatMap((a) => {
            const st = fs.statSync(a);
            if (st.isFile()) return [a];
            return execSync(`git ls-files ${a}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
        });
    }
    // Modo normal: solo archivos rastreados por git (lo que realmente se publica).
    return execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
}

const args = process.argv.slice(2);
const hallazgos = [];
let revisados = 0;

for (const archivo of archivos(args)) {
    if (EXCEPCIONES.some((re) => re.test(archivo))) continue;
    let contenido;
    try { contenido = fs.readFileSync(archivo, 'utf8'); } catch { continue; }
    if (contenido.includes('\0')) continue; // binario
    revisados++;
    contenido.split('\n').forEach((linea, i) => {
        for (const regla of REGLAS) {
            const m = linea.match(regla.re);
            if (!m) continue;
            // Si la regla extrae un valor, lo filtramos contra la lista de valores seguros.
            if (regla.valor) {
                const v = regla.valor(m);
                if (!v || VALORES_SEGUROS.test(v)) continue;
            }
            hallazgos.push(`${archivo}:${i + 1}  ${regla.nombre}`);
        }
    });
}

console.log(`FF-5 sin-secretos: ${revisados} archivos versionados revisados.`);
if (hallazgos.length) {
    console.error(`FALLA: ${hallazgos.length} posible(s) secreto(s) en el repo:`);
    hallazgos.forEach((h) => console.error(`  - ${h}`));
    console.error('\nSaca el secreto del archivo, muévelo a .env (no versionado) y ROTALO.');
    process.exit(1);
}
console.log('OK: 0 secretos en archivos versionados.');
