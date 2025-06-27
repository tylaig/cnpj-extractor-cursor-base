# Instalação e Execução com PM2

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Instale o PM2 globalmente (caso não tenha):
   ```bash
   npm install -g pm2
   ```

3. Inicie a aplicação com PM2:
   ```bash
   pm2 start ecosystem.config.js
   ```

4. Para ver o status:
   ```bash
   pm2 status
   ```

5. Para logs:
   ```bash
   pm2 logs cnpj-extractor-api
   ```

6. Para parar:
   ```bash
   pm2 stop cnpj-extractor-api
   ```

7. Para reiniciar:
   ```bash
   pm2 restart cnpj-extractor-api
   ```

8. Para remover:
   ```bash
   pm2 delete cnpj-extractor-api
   ```

---

**Dica:** Para rodar sempre que o servidor reiniciar, use:
```bash
pm2 startup
pm2 save
```
