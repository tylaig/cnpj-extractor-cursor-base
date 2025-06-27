const fs = require('fs');
const path = require('path');

const ARQUIVOS_ESPERADOS = [
  'Cnaes.zip', 'Empresas0.zip', 'Empresas1.zip', 'Empresas2.zip', 'Empresas3.zip', 'Empresas4.zip', 'Empresas5.zip', 'Empresas6.zip', 'Empresas7.zip', 'Empresas8.zip', 'Empresas9.zip',
  'Estabelecimentos0.zip', 'Estabelecimentos1.zip', 'Estabelecimentos2.zip', 'Estabelecimentos3.zip', 'Estabelecimentos4.zip', 'Estabelecimentos5.zip', 'Estabelecimentos6.zip', 'Estabelecimentos7.zip', 'Estabelecimentos8.zip', 'Estabelecimentos9.zip',
  'Municipios.zip', 'Naturezas.zip', 'Motivos.zip', 'Paises.zip', 'Qualificacoes.zip', 'Simples.zip',
  'Socios0.zip', 'Socios1.zip', 'Socios2.zip', 'Socios3.zip', 'Socios4.zip', 'Socios5.zip', 'Socios6.zip', 'Socios7.zip', 'Socios8.zip', 'Socios9.zip'
];

function checkArquivosReceita(dirPath) {
  const encontrados = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
  const presentes = [];
  const ausentes = [];
  const divergentes = [];

  ARQUIVOS_ESPERADOS.forEach(nome => {
    if (encontrados.includes(nome)) {
      presentes.push(nome);
    } else {
      ausentes.push(nome);
    }
  });

  encontrados.forEach(nome => {
    if (!ARQUIVOS_ESPERADOS.includes(nome)) {
      divergentes.push(nome);
    }
  });

  return {
    totalEsperados: ARQUIVOS_ESPERADOS.length,
    totalPresentes: presentes.length,
    totalAusentes: ausentes.length,
    totalDivergentes: divergentes.length,
    presentes,
    ausentes,
    divergentes
  };
}

module.exports = { checkArquivosReceita, ARQUIVOS_ESPERADOS };
