-- Spike 1: crea 50 usuarios de prueba (uno por VU) para que cada VU tenga
-- favoritos propios y no compita con los demás por la misma fila.
-- Reutiliza el hash bcrypt del usuario k6test (contraseña K6_Prueba_2026!).
-- Idempotente.
INSERT INTO usuario (nombre, correo, contrasena_hash)
SELECT 'Spike01 U' || lpad(g::text, 2, '0'),
       'spike01_u' || lpad(g::text, 2, '0') || '@cooksmart.local',
       (SELECT contrasena_hash FROM usuario WHERE correo = 'k6test@cooksmart.local')
FROM generate_series(1, 50) AS g
ON CONFLICT (correo) DO NOTHING;

-- Estado inicial idéntico para cada corrida.
DELETE FROM favorito
WHERE id_usuario IN (SELECT id_usuario FROM usuario WHERE correo LIKE 'spike01_u%@cooksmart.local');

SELECT count(*) AS usuarios_spike FROM usuario WHERE correo LIKE 'spike01_u%@cooksmart.local';
