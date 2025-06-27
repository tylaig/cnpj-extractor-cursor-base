/**
 * Executa funções assíncronas em paralelo com limite de concorrência.
 * @param {Array} items - Itens a processar
 * @param {Function} fn - Função assíncrona que recebe (item, index)
 * @param {number} concurrency - Limite de concorrência
 * @returns {Promise<Array>} Resultados na ordem dos itens
 */
async function promisePool(items, fn, concurrency = 10) {
  const results = [];
  let i = 0;
  const executing = [];
  function enqueue() {
    if (i >= items.length) return Promise.resolve();
    const idx = i;
    const p = Promise.resolve(fn(items[idx], idx)).then(res => {
      results[idx] = res;
    });
    i++;
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    let r = Promise.resolve();
    if (executing.length >= concurrency) {
      r = Promise.race(executing);
    }
    return r.then(() => enqueue());
  }
  await enqueue();
  await Promise.all(executing);
  return results;
}

module.exports = promisePool;
