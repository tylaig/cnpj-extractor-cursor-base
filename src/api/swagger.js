const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/swagger.json')));

const options = {
  customCss: `
    .swagger-ui .topbar { background: #1B4F72; }
    .swagger-ui .info { color: #2C3E50; }
    .swagger-ui .scheme-container { background: #F8F9FA; }
    .swagger-ui .opblock.opblock-post { border-color: #28B463; }
    .swagger-ui .opblock.opblock-get { border-color: #1B4F72; }
    .swagger-ui .btn.execute { background: #28B463; color: #fff; }
    .swagger-ui .responses-inner { background: #F8F9FA; }
    .swagger-ui .response-col_status { color: #27AE60; }
    .swagger-ui .tab li { color: #F39C12; }
  `,
  customSiteTitle: 'CNPJ Extractor API Docs'
};

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
}

module.exports = setupSwagger;
