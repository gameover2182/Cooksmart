// Verificación posterior al Spike 1 (NO altera el veredicto pre-registrado):
// ¿qué pasa con las altas de favoritos aceptadas si la API se reinicia
// justo después de responder?
//
// Procedimiento por corrida:
//   1. Borra los favoritos de los 50 usuarios spike01_uNN.
//   2. Hace login con los 50 usuarios.
//   3. Envía 1000 POST /favoritos concurrentes (50 usuarios x 20 recetas, pares únicos).
//   4. Apenas llegan todas las respuestas, reinicia el contenedor:
//      - forma 'restart': `docker restart` (apagado ordenado, SIGTERM + espera)
//      - forma 'kill':    `docker kill` + `docker start` (muerte inmediata, SIGKILL: simula un crash)
//   5. Cuando la API vuelve, cuenta las filas realmente guardadas en PostgreSQL.
//   perdidas = altas aceptadas por la API (201/202) - filas guardadas.
//
// Uso: node prueba-reinicio.js <modo esperado: sync|async> <contenedor> <baseUrl> [restart|kill]
const { execSync } = require('child_process');

const [modo, contenedor, baseUrl, forma = 'restart'] = process.argv.slice(2);
const USUARIOS = 50;
const RECETAS = 20;
const PASSWORD = 'K6_Prueba_2026!';

const sql = (q) =>
    execSync(`docker exec cooksmart psql -U admin -d cooksmart -tAc "${q}"`).toString().trim();
const FILTRO = "id_usuario IN (SELECT id_usuario FROM usuario WHERE correo LIKE 'spike01_u%@cooksmart.local')";

async function esperarSalud() {
    for (let i = 0; i < 120; i++) {
        try {
            const r = await fetch(`${baseUrl}/health`);
            if (r.ok) return;
        } catch (e) { /* aún arrancando */ }
        await new Promise((r) => setTimeout(r, 250));
    }
    throw new Error('La API no volvió a estar saludable');
}

async function main() {
    await esperarSalud();
    sql(`DELETE FROM favorito WHERE ${FILTRO}`);

    const usuarios = [];
    for (let i = 1; i <= USUARIOS; i++) {
        const correo = `spike01_u${String(i).padStart(2, '0')}@cooksmart.local`;
        const r = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena: PASSWORD }),
        });
        const j = await r.json();
        usuarios.push({ id: j.usuario.id_usuario, token: j.token });
    }

    const peticiones = [];
    for (const u of usuarios) {
        for (let idReceta = 1; idReceta <= RECETAS; idReceta++) {
            peticiones.push(
                fetch(`${baseUrl}/api/usuarios/${u.id}/favoritos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
                    body: JSON.stringify({ idReceta }),
                }).then((r) => r.status).catch(() => 0)
            );
        }
    }
    const codigos = await Promise.all(peticiones);
    const t0 = Date.now();
    if (forma === 'kill') {
        execSync(`docker kill ${contenedor}`);
        execSync(`docker start ${contenedor}`);
    } else {
        execSync(`docker restart ${contenedor}`);
    }
    const msReinicio = Date.now() - t0;
    await esperarSalud();

    const aceptadas = codigos.filter((c) => c === 201 || c === 202).length;
    const codigoEsperado = modo === 'async' ? 202 : 201;
    const guardadas = Number(sql(`SELECT count(*) FROM favorito WHERE ${FILTRO}`));
    const resultado = {
        modo,
        forma,
        enviadas: codigos.length,
        aceptadas,
        conCodigoEsperado: codigos.filter((c) => c === codigoEsperado).length,
        otrosCodigos: codigos.filter((c) => c !== 201 && c !== 202).length,
        guardadas,
        perdidas: aceptadas - guardadas,
        porcentajePerdidas: Number((((aceptadas - guardadas) / aceptadas) * 100).toFixed(2)),
        msReinicio,
        fecha: new Date().toISOString(),
    };
    console.log(JSON.stringify(resultado));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
