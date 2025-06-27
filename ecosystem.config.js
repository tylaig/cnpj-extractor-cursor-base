module.exports = {
  apps: [
    {
      name: 'cnpj-extractor-api',
      script: './src/api/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
