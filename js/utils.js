// Funções utilitárias
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function preencherSelectMeses() {
  const select = document.getElementById('mes-select');
  const hoje = new Date();
  const meses = [];
  
  // Adiciona os últimos 12 meses
  for (let i = 0; i < 12; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const mesAno = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    meses.push({
      value: data.toISOString().slice(0, 7),
      text: mesAno.charAt(0).toUpperCase() + mesAno.slice(1)
    });
  }
  
  select.innerHTML = meses.map(mes => 
    `<option value="${mes.value}">${mes.text}</option>`
  ).join('');
  
  // Seleciona o mês atual
  select.value = hoje.toISOString().slice(0, 7);
}

function filtrarDados() {
  const mesSelecionado = document.getElementById('mes-select').value;
  const termoBusca = document.getElementById('busca').value.toLowerCase();
  
  return gastosData.filter(item => {
    const dataGasto = new Date(item.Data);
    const mesGasto = dataGasto.toISOString().slice(0, 7);
    const matchMes = mesGasto === mesSelecionado;
    const matchBusca = !termoBusca || 
      item.Descrição.toLowerCase().includes(termoBusca) ||
      item.Categoria.toLowerCase().includes(termoBusca);
    
    return matchMes && matchBusca;
  });
} 