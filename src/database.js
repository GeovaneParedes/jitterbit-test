const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'jitterbit_test',
});

// Listener para monitorar saúde da conexão
pool.on('connect', () => {
  // Opcional: Descomente se quiser ver log a cada query
  // console.log('📦 Conexão obtida do pool');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente ocioso', err);
  process.exit(-1);
});

module.exports = pool;
