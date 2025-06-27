# CNPJ Extractor API

API web para processamento, carga e consulta de dados públicos de CNPJ da Receita Federal, inspirada em Brasil.io.

## Visão Geral

Este serviço permite:
- Upload de arquivos ZIP da Receita Federal
- Extração, validação e carga em massa dos dados para PostgreSQL
- Consulta via API REST com filtros avançados (CNAE, cidade, nome, UF, etc)
- Documentação interativa e customizada

## Estrutura do Projeto

```
/cnpj-extractor-cursor-base
│
├── src/
│   ├── api/                # Endpoints REST
│   ├── services/           # Lógica de negócio (parsing, validação, carga)
│   ├── db/                 # Scripts e modelos do banco de dados
│   ├── utils/              # Funções utilitárias (extração ZIP, etc)
│   ├── config/             # Configurações (env, conexões)
│   └── docs/               # Documentação customizada da API
│
├── public/                 # Assets estáticos (ex: logo, docs custom)
├── .env                    # Variáveis de ambiente
├── package.json
└── README.md
```

## Endpoints Principais

### 1. Upload de Arquivo ZIP
- `POST /api/upload`
- Upload de arquivo ZIP contendo os dados da Receita Federal.

### 2. Consulta de Empresas
- `GET /api/empresas`
- Filtros: cnae, cidade, nome, uf, situação, etc.
- Paginação: `?page=1&limit=50`

### 3. Consulta de CNAEs
- `GET /api/cnaes`
- Lista e busca de códigos CNAE.

### 4. Consulta de Cidades
- `GET /api/cidades`
- Lista e busca de cidades.

## Exemplo de Resposta

```json
{
  "data": [
    {
      "cnpj": "12345678000195",
      "razao_social": "EMPRESA EXEMPLO LTDA",
      "nome_fantasia": "EXEMPLO",
      "cnae_principal": "6201-5/01",
      "cidade": "SÃO PAULO",
      "uf": "SP",
      "situacao_cadastral": "ATIVA"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000
  }
}
```

## Filtros Disponíveis

- `cnae` (ex: 6201-5/01)
- `cidade` (ex: SÃO PAULO)
- `uf` (ex: SP)
- `razao_social` (busca parcial)
- `situacao_cadastral` (ATIVA, BAIXADA, etc)

## Estilo da Documentação

- **Cores:**  
  - Primária: #1B4F72  
  - Secundária: #28B463  
  - Fundo: #F8F9FA  
  - Texto: #2C3E50  
  - Acento: #F39C12  
  - Sucesso: #27AE60  
- **Fonte:** Roboto ou Source Sans Pro
- **Layout:** Tabs para endpoints, exemplos de requisição/resposta, parâmetros bem descritos.

---

## Como rodar o projeto (instruções iniciais)

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` com as variáveis do PostgreSQL
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

---

## Licença
MIT
