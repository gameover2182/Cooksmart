require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { pool } = require('./config/db');
const recetasRoutes = require('./routes/recetas.routes');
const catalogosRoutes = require('./routes/catalogos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const meRoutes = require('./routes/me.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler');

if (!process.env.JWT_SECRET) {
    console.error('Falta la variable de entorno JWT_SECRET. El servidor no puede arrancar sin ella.');
    process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

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
app.use('/api/me', meRoutes);
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