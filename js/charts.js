// Funções relacionadas aos gráficos
let graficoCategoria;
let graficoDia;
let graficoTendencia;

function atualizarGraficos(data) {
  atualizarGraficoCategoria(data);
  atualizarGraficoDia(data);
  atualizarGraficoTendencia();
}

function atualizarGraficoCategoria(data) {
  const gastosPorCategoria = data.reduce((acc, item) => {
    acc[item.Categoria] = (acc[item.Categoria] || 0) + parseFloat(item.Valor);
    return acc;
  }, {});

  if (graficoCategoria) {
    graficoCategoria.destroy();
  }

  graficoCategoria = new Chart(document.getElementById('gastosPorCategoria'), {
    type: 'pie',
    data: {
      labels: Object.keys(gastosPorCategoria),
      datasets: [{
        data: Object.values(gastosPorCategoria),
        backgroundColor: CONFIG.grafico_cores
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Gastos por Categoria'
        }
      }
    }
  });
}

function atualizarGraficoDia(data) {
  const gastosPorDia = data.reduce((acc, item) => {
    const dia = new Date(item.Data).toLocaleDateString('pt-BR');
    acc[dia] = (acc[dia] || 0) + parseFloat(item.Valor);
    return acc;
  }, {});

  if (graficoDia) {
    graficoDia.destroy();
  }

  graficoDia = new Chart(document.getElementById('gastosPorDia'), {
    type: 'bar',
    data: {
      labels: Object.keys(gastosPorDia),
      datasets: [{
        label: 'Gastos por Dia',
        data: Object.values(gastosPorDia),
        backgroundColor: '#3498db'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Gastos por Dia'
        }
      }
    }
  });
}

function atualizarGraficoTendencia() {
  // Agrupar gastos por mês
  const gastosPorMes = {};
  
  gastosData.forEach(item => {
    const data = new Date(item.Data);
    const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
    gastosPorMes[mesAno] = (gastosPorMes[mesAno] || 0) + parseFloat(item.Valor);
  });
  
  // Ordenar por data
  const meses = Object.keys(gastosPorMes).sort((a, b) => {
    const [mesA, anoA] = a.split('/').map(Number);
    const [mesB, anoB] = b.split('/').map(Number);
    return (anoA * 12 + mesA) - (anoB * 12 + mesB);
  });
  
  const valores = meses.map(mes => gastosPorMes[mes]);
  
  if (graficoTendencia) {
    graficoTendencia.destroy();
  }
  
  graficoTendencia = new Chart(document.getElementById('tendenciaMensal'), {
    type: 'line',
    data: {
      labels: meses,
      datasets: [{
        label: 'Total de Gastos',
        data: valores,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Tendência de Gastos Mensais'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatarMoeda(value);
            }
          }
        }
      }
    }
  });
} 