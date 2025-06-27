const express = require('express');
const router = express.Router();

// GET /api/cidades
router.get('/', async (req, res) => {
  // TODO: Implementar busca/listagem de cidades
  res.json({ data: [] });
});

module.exports = router;
