require('dotenv').config();
const cluster = require('cluster');
const express = require('express');
const cors = require('cors');

const { pool } = require('./config/db');
const recetasRoutes = require('./routes/recetas.routes');
const catalogosRoutes = require('./routes/catalogos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler');
const { cabecerasSeguridad } = require('./middlewares/cabecerasSeguridad');
const { observabilidad, montarMetricas } = require('./middlewares/observabilidad');
const { totalBloqueos } = require('./middlewares/limiteLoginFallidos');

if (!process.env.JWT_SECRET) {
    console.error('Falta la variable de entorno JWT_SECRET. El servidor no puede arrancar sin ella.');
    process.exit(1);
}

// EXP-004 (M6): con API_WORKERS > 1 el proceso principal solo lanza N procesos
// de la API que comparten el puerto; con 1 (por defecto) arranca como siempre.
const WORKERS = Number(process.env.API_WORKERS) || 1;
if (WORKERS > 1 && cluster.isPrimary) {
    for (let i = 0; i < WORKERS; i++) cluster.fork();
    cluster.on('exit', (worker) => {
        console.error(`Worker ${worker.process.pid} terminó; se lanza otro`);
        cluster.fork();
    });
    console.log(`CookSmart API: proceso principal con ${WORKERS} workers`);
} else {
    iniciarServidor();
}

function iniciarServidor() {
const app = express();

// A9 (C6): no anunciar Express en ninguna respuesta.
app.disable('x-powered-by');
// Detrás de un proxy/compose: confiar en la primera salto para que req.ip sea
// la IP real del cliente (la usa el límite de intentos de login, C2).
app.set('trust proxy', 1);

// Observabilidad lo primero: así registra TODO, incluso 404 y errores.
app.use(observabilidad);
app.use(cabecerasSeguridad);
app.use(cors());
app.use(express.json({ limit: '100kb' })); // A8: cuerpo acotado (evita payloads enormes)

// Métricas (protegidas por METRICS_TOKEN; 404 si no se configura). Ver observabilidad.js.
montarMetricas(app, { bloqueos: totalBloqueos });

// Healthcheck: verifica que el proceso responde Y que puede hablar con Postgres
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', db: 'connected' });
    } catch (err) {
        res.status(503).json({ status: 'error', db: 'unreachable' });
    }
});

app.use('/api/recetas', recetasRoutes);
app.use('/api', catalogosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);

// 404 para rutas no definidas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CookSmart API escuchando en el puerto ${PORT}`);
});
}
