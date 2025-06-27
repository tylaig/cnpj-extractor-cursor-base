const express = require('express');
const pool = require('../../config/db');
const router = express.Router();

// GET /api/search?cnae=...&cidade=...&uf=...&razao_social=...&situacao_cadastral=...&page=1&limit=50
// Agora aceita múltiplos valores separados por vírgula para cada filtro
router.get('/', async (req, res) => {
  const {
    cnae,
    cidade,
    uf,
    razao_social,
    situacao_cadastral,
    page = 1,
    limit = 50
  } = req.query;

  let where = [];
  let values = [];

  // Helper para múltiplos valores
  function addMultiParam(param, column, ilike = false) {
    if (!param) return;
    const arr = param.split(',').map(v => v.trim()).filter(Boolean);
    if (arr.length === 0) return;
    if (ilike) {
      where.push(`(${arr.map((_, i) => `${column} ILIKE $${values.length + i + 1}`).join(' OR ')})`);
      arr.forEach(v => values.push(`%${v}%`));
    } else {
      where.push(`${column} IN (${arr.map((_, i) => `$${values.length + i + 1}`).join(', ')})`);
      values.push(...arr);
    }
  }

  addMultiParam(cnae, 'e.cnae_principal');
  addMultiParam(cidade, 'c.nome', true);
  addMultiParam(uf, 'e.uf');
  addMultiParam(razao_social, 'e.razao_social', true);
  addMultiParam(situacao_cadastral, 'e.situacao_cadastral');

  const offset = (parseInt(page) - 1) * parseInt(limit);
  let sql = `SELECT e.cnpj, e.razao_social, e.nome_fantasia, e.cnae_principal, c.nome as cidade, e.uf, e.situacao_cadastral
    FROM empresas e
    LEFT JOIN cidades c ON e.cidade_id = c.id`;
  if (where.length > 0) {
    sql += ' WHERE ' + where.join(' AND ');
  }
  sql += ' ORDER BY e.razao_social ASC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
  values.push(limit, offset);

  let countSql = 'SELECT COUNT(*) FROM empresas e LEFT JOIN cidades c ON e.cidade_id = c.id';
  if (where.length > 0) {
    countSql += ' WHERE ' + where.join(' AND ');
  }

  try {
    const [result, countResult] = await Promise.all([
      pool.query(sql, values),
      pool.query(countSql, values.slice(0, -2))
    ]);
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar empresas', details: err.message });
  }
});

module.exports = router;
