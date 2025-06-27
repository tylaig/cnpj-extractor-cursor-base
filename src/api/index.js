require('dotenv').config();
const express = require('express');
const searchRouter = require('./routes/search');
const uploadRouter = require('./routes/upload');
const receitaStatusRouter = require('./routes/receitaStatus');
const receitaSyncRouter = require('./routes/receitaSync');
const setupSwagger = require('./swagger');
const ensureTables = require('../db/autoMigrate');

async function startServer() {
  await ensureTables();
  const app = express();
  app.use(express.json());

  app.use('/api/search', searchRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/receita/status', receitaStatusRouter);
  app.use('/api/receita/sync', receitaSyncRouter);
  setupSwagger(app);

  app.get('/', (req, res) => {
    res.send('CNPJ Extractor API rodando!');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();
