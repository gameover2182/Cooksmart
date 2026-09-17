const { Pool } = require('pg');

// Soporta DATABASE_URL (recomendado en Docker) o variables sueltas (PG*),
// que es lo que usa por defecto la librería 'pg' si no se le pasa nada.
const pool = new Pool(
    process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL }
        : {
              host: process.env.PGHOST || 'localhost',
              port: Number(process.env.PGPORT) || 5432,
              user: process.env.PGUSER || 'admin',
              password: process.env.PGPASSWORD || 'Cooksmart2024',
              database: process.env.PGDATABASE || 'cooksmart',
          }
);

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de Postgres:', err);
});

async function query(text, params) {
    return pool.query(text, params);
}

module.exports = { pool, query };
