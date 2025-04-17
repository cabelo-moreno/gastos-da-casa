// Funções relacionadas ao orçamento
function atualizarOrçamentos(data) {
  const gastosPorCategoria = data.reduce((acc, item) => {
    acc[item.Categoria] = (acc[item.Categoria] || 0) + parseFloat(item.Valor);
    return acc;
  }, {});
  
  const orçamentoGrid = document.getElementById('orçamento-grid');
  orçamentoGrid.innerHTML = '';
  
  Object.keys(CONFIG.orcamentos).forEach(categoria => {
    const gasto = gastosPorCategoria[categoria] || 0;
    const orçamento = CONFIG.orcamentos[categoria];
    const percentual = (gasto / orçamento) * 100;
    
    let classeBarra = '';
    if (percentual > CONFIG.alertas.excedido_porcentagem) {
      classeBarra = 'excedido';
    } else if (percentual > CONFIG.alertas.alerta_porcentagem) {
      classeBarra = 'alerta';
    }
    
    const item = document.createElement('div');
    item.className = 'orçamento-item';
    item.innerHTML = `
      <h3>${categoria}</h3>
      <div class="progresso">
        <div class="barra ${classeBarra}" style="width: ${Math.min(percentual, 100)}%"></div>
      </div>
      <div class="valores">
        <span>${formatarMoeda(gasto)}</span>
        <span>${formatarMoeda(orçamento)}</span>
      </div>
    `;
    
    orçamentoGrid.appendChild(item);
  });
}

function calcularEstatisticas(data) {
  const totalMes = data.reduce((acc, item) => acc + parseFloat(item.Valor), 0);
  const diasNoMes = new Date().getDate();
  const mediaDiaria = totalMes / diasNoMes;
  const maiorGasto = Math.max(...data.map(item => parseFloat(item.Valor)));
  
  const gastosPorCategoria = data.reduce((acc, item) => {
    acc[item.Categoria] = (acc[item.Categoria] || 0) + parseFloat(item.Valor);
    return acc;
  }, {});

  const categoriaMaisCara = Object.entries(gastosPorCategoria)
    .sort(([,a], [,b]) => b - a)[0];

  document.getElementById('total-mes').textContent = formatarMoeda(totalMes);
  document.getElementById('media-diaria').textContent = formatarMoeda(mediaDiaria);
  document.getElementById('maior-gasto').textContent = formatarMoeda(maiorGasto);
  document.getElementById('categoria-mais-cara').textContent = categoriaMaisCara ? categoriaMaisCara[0] : '-';
  
  atualizarOrçamentos(data);
} 