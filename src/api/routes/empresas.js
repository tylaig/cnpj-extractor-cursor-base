const express = require('express');
const router = express.Router();

// GET /api/empresas
router.get('/', async (req, res) => {
  // TODO: Implementar busca com filtros (cnae, cidade, nome, uf, situação, paginação)
  res.json({ data: [], pagination: { page: 1, limit: 50, total: 0 } });
});

module.exports = router;
