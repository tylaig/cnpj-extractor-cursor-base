const pool = require('../config/db');

async function createSyncTask() {
  const result = await pool.query(
    `INSERT INTO sync_tasks (status, progress, log) VALUES ('aguardando', 0, $1) RETURNING id`,
    ['Tarefa criada.']
  );
  return result.rows[0].id;
}

async function updateSyncTask(id, { status, progress, log, finished_at }) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (status) { fields.push(`status = $${idx++}`); values.push(status); }
  if (progress !== undefined) { fields.push(`progress = $${idx++}`); values.push(progress); }
  if (log !== undefined) { fields.push(`log = $${idx++}`); values.push(log); }
  if (finished_at) { fields.push(`finished_at = $${idx++}`); values.push(finished_at); }
  if (fields.length === 0) return;
  values.push(id);
  await pool.query(`UPDATE sync_tasks SET ${fields.join(', ')} WHERE id = $${values.length}` , values);
}

async function appendLog(id, msg) {
  await pool.query('UPDATE sync_tasks SET log = log || $1 WHERE id = $2', ['\n' + msg, id]);
}

async function getSyncTask(id) {
  const result = await pool.query('SELECT * FROM sync_tasks WHERE id = $1', [id]);
  return result.rows[0];
}

module.exports = { createSyncTask, updateSyncTask, appendLog, getSyncTask };
