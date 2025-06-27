const express = require('express');
const path = require('path');
const { checkArquivosReceita } = require('../../services/receitaFileChecker');
const router = express.Router();

router.get('/', (req, res) => {
  const pasta = path.join(__dirname, '../../../arquivos-receita');
  const status = checkArquivosReceita(pasta);
  res.json(status);
});

module.exports = router;
