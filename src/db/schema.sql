-- Schema inicial do banco de dados para CNPJ Extractor

CREATE TABLE IF NOT EXISTS cidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS cnaes (
    codigo VARCHAR(10) PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS empresas (
    cnpj VARCHAR(14) PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnae_principal VARCHAR(10) REFERENCES cnaes(codigo),
    cidade_id INTEGER REFERENCES cidades(id),
    uf CHAR(2),
    situacao_cadastral VARCHAR(20),
    data_abertura DATE,
    data_situacao DATE,
    capital_social NUMERIC(18,2),
    porte VARCHAR(20)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_empresas_cnae ON empresas(cnae_principal);
CREATE INDEX IF NOT EXISTS idx_empresas_cidade ON empresas(cidade_id);
CREATE INDEX IF NOT EXISTS idx_empresas_razao ON empresas(razao_social);
-- ... código existente ...

-- Tabela para controle de tarefas de sincronização
CREATE TABLE IF NOT EXISTS sync_tasks (
    id SERIAL PRIMARY KEY,
    status VARCHAR(30) NOT NULL DEFAULT 'aguardando', -- aguardando, processando, finalizado, erro
    progress INTEGER NOT NULL DEFAULT 0, -- 0 a 100
    log TEXT DEFAULT '',
    started_at TIMESTAMP DEFAULT NOW(),
    finished_at TIMESTAMP
);
