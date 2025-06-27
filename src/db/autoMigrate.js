const pool = require('../config/db');

async function ensureTables() {
  // sync_tasks
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sync_tasks (
      id SERIAL PRIMARY KEY,
      status VARCHAR(30) NOT NULL DEFAULT 'aguardando',
      progress INTEGER NOT NULL DEFAULT 0,
      log TEXT DEFAULT '',
      started_at TIMESTAMP DEFAULT NOW(),
      finished_at TIMESTAMP
    );
  `);
  // Adicione outros CREATE TABLE IF NOT EXISTS aqui conforme necessário
  // ...
  console.log('Verificação automática de tabelas concluída.');
}

module.exports = ensureTables;
