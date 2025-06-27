const express = require('express');
const router = express.Router();

// GET /api/cnaes
router.get('/', async (req, res) => {
  // TODO: Implementar busca/listagem de CNAEs
  res.json({ data: [] });
});

module.exports = router;
