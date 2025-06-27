const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processZip } = require('../../services/zipProcessor');
const { generateTempCSV, copyToPostgres } = require('../../services/bulkInsert');
const { getOrCreateCidade, getOrCreateCNAE } = require('../../services/lookupService');
const router = express.Router();
const promisePool = require('../../utils/promisePool');

const EMPRESA_COLUMNS = [
  'cnpj',
  'razao_social',
  'nome_fantasia',
  'cnae_principal',
  'cidade_id',
  'uf',
  'situacao_cadastral',
  'data_abertura',
  'data_situacao',
  'capital_social',
  'porte'
];

const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// Função para validar e transformar cada linha
async function validarTransformarLinha(row) {
  const cnpj = (row.cnpj || '').replace(/\D/g, '');
  const razao_social = row.razao_social || '';
  const nome_fantasia = row.nome_fantasia || '';
  const cnae_principal = await getOrCreateCNAE(row.cnae_principal, row.cnae_descricao);
  const cidade_id = await getOrCreateCidade(row.cidade, row.uf);
  const uf = row.uf || '';
  const situacao_cadastral = row.situacao_cadastral || '';
  const data_abertura = row.data_abertura || null;
  const data_situacao = row.data_situacao || null;
  const capital_social = row.capital_social || null;
  const porte = row.porte || '';
  const erros = [];
  if (!cnpj) erros.push('CNPJ ausente ou inválido');
  if (!razao_social) erros.push('Razão social ausente');
  if (!cnae_principal) erros.push('CNAE principal ausente');
  if (!cidade_id) erros.push('Cidade/UF ausente ou inválida');
  return {
    valido: erros.length === 0,
    dados: {
      cnpj,
      razao_social,
      nome_fantasia,
      cnae_principal,
      cidade_id,
      uf,
      situacao_cadastral,
      data_abertura,
      data_situacao,
      capital_social,
      porte
    },
    erros
  };
}

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não enviado.' });
  }
  const zipPath = req.file.path;
  const rows = [];
  const errosLinhas = [];
  try {
    await processZip(zipPath, (row) => rows.push(row));
    // Processamento em lote com concorrência
    const resultados = await promisePool(rows, validarTransformarLinha, 10);
    const linhasValidadas = [];
    for (let i = 0; i < resultados.length; i++) {
      const result = resultados[i];
      if (result && result.valido) {
        linhasValidadas.push(result.dados);
      } else if (result) {
        errosLinhas.push({ linha: i + 1, erros: result.erros, dados: rows[i] });
      }
    }
    if (linhasValidadas.length === 0) {
      return res.status(400).json({ error: 'Nenhuma linha válida encontrada.', erros: errosLinhas });
    }
    const tempCSV = await generateTempCSV(linhasValidadas, EMPRESA_COLUMNS);
    await copyToPostgres(tempCSV, EMPRESA_COLUMNS);
    res.json({ 
      message: 'Arquivo processado e dados inseridos com sucesso', 
      totalLinhasValidas: linhasValidadas.length,
      totalLinhasInvalidas: errosLinhas.length,
      erros: errosLinhas.slice(0, 10) // Mostra até 10 exemplos de erro
    });
  } catch (err) {
    console.error('Erro ao processar upload:', err);
    res.status(500).json({ error: 'Erro ao processar o ZIP', details: err.message });
  } finally {
    fs.unlink(zipPath, () => {});
  }
});

module.exports = router;
