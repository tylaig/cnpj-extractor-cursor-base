# CNPJ Extractor API

API web para processamento, carga e consulta de dados públicos de CNPJ da Receita Federal, inspirada em Brasil.io.

## Visão Geral

Este serviço permite:
- Upload e sincronização de arquivos ZIP da Receita Federal
- Extração, validação e carga em massa dos dados para PostgreSQL
- Consulta via API REST com filtros avançados (CNAE, cidade, nome, UF, etc)
- Dashboard web para controle e acompanhamento da sincronização
- Documentação interativa e customizada (Swagger)

## Estrutura do Projeto

```
/cnpj-extractor-cursor-base
│
├── arquivos-receita/         # Coloque aqui todos os arquivos ZIP da Receita Federal
├── src/
│   ├── api/                  # Endpoints REST
│   ├── config/               # Configurações (env, conexões)
│   ├── db/                   # Scripts e modelos do banco de dados
│   ├── docs/                 # Documentação customizada da API
│   ├── frontend/             # Frontend React (dashboard)
│   ├── services/             # Lógica de negócio (parsing, sync, validação, carga)
│   └── utils/                # Funções utilitárias
├── public/                   # Assets estáticos (ex: logo, docs custom)
├── .env                      # Variáveis de ambiente
├── .env.example              # Exemplo de configuração
├── .gitignore
├── package.json
└── README.md
```

## Como rodar o projeto

1. **Clone o repositório e entre na pasta:**
   ```bash
   git clone ...
   cd cnpj-extractor-cursor-base
   ```

2. **Coloque todos os arquivos ZIP da Receita Federal na pasta:**
   ```
   arquivos-receita/
   ```

3. **Instale as dependências (backend e frontend):**
   ```bash
   npm install
   ```

4. **Configure o arquivo `.env` com as variáveis do PostgreSQL (veja `.env.example`):**

5. **Suba o backend e o frontend juntos:**
   ```bash
   npm run dev:all
   ```
   - O backend ficará disponível em `http://localhost:3000`
   - O frontend (dashboard) ficará disponível em `http://localhost:5173`

## Dashboard de Sincronização

- Acesse `http://localhost:5173` para:
  - Verificar status dos arquivos da Receita Federal
  - Iniciar a sincronização completa do banco de dados
  - Acompanhar barra de progresso e logs em tempo real

## Endpoints Principais

### 1. Status dos Arquivos
- `GET /api/receita/status`
- Retorna status dos arquivos ZIP esperados na pasta `arquivos-receita`

### 2. Sincronização Completa
- `POST /api/receita/sync`
  - Inicia uma tarefa de sincronização assíncrona
  - Retorna `task_id`
- `GET /api/receita/sync/status/:task_id`
  - Consulta status, progresso e logs da tarefa

### 3. Consulta de Empresas
- `GET /api/search?cnae=...&cidade=...&uf=...&razao_social=...&situacao_cadastral=...&page=1&limit=50`
- Filtros dinâmicos, múltiplos valores por vírgula

## Documentação Interativa
- Acesse `http://localhost:3000/api/docs` para ver e testar todos os endpoints (Swagger UI customizado)

## Scripts Úteis

- `npm run dev:all` — Sobe backend e frontend juntos (ideal para desenvolvimento)
- `npm run dev` — Sobe apenas o backend
- `cd src/frontend && npm run dev` — Sobe apenas o frontend

## Observações
- Todos os arquivos ZIP devem estar em `arquivos-receita/` antes de sincronizar.
- O processo de sincronização é assíncrono, com barra de progresso e logs no dashboard.
- O banco de dados será limpo e reimportado a cada sincronização.

## Licença
MIT
