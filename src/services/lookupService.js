const pool = require('../config/db');

async function getOrCreateCidade(nome, uf) {
  if (!nome || !uf) return null;
  const client = await pool.connect();
  try {
    let result = await client.query('SELECT id FROM cidades WHERE nome = $1 AND uf = $2', [nome, uf]);
    if (result.rows.length > 0) return result.rows[0].id;
    result = await client.query('INSERT INTO cidades (nome, uf) VALUES ($1, $2) RETURNING id', [nome, uf]);
    return result.rows[0].id;
  } finally {
    client.release();
  }
}

async function getOrCreateCNAE(codigo, descricao = '') {
  if (!codigo) return null;
  const client = await pool.connect();
  try {
    let result = await client.query('SELECT codigo FROM cnaes WHERE codigo = $1', [codigo]);
    if (result.rows.length > 0) return result.rows[0].codigo;
    result = await client.query('INSERT INTO cnaes (codigo, descricao) VALUES ($1, $2) RETURNING codigo', [codigo, descricao]);
    return result.rows[0].codigo;
  } finally {
    client.release();
  }
}

module.exports = { getOrCreateCidade, getOrCreateCNAE };
