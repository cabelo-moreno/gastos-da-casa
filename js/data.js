// Funções de manipulação de dados
let tabletop;
let gastosData = [];

function showInfo(data) {
  gastosData = data;
  const dadosFiltrados = filtrarDados();
  
  const tbody = document.querySelector('#gastos-table tbody');
  tbody.innerHTML = '';
  
  if (dadosFiltrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="no-results">Nenhum gasto encontrado para o período selecionado</td>
      </tr>
    `;
  } else {
    // Ordenar por data (mais recente primeiro)
    dadosFiltrados.sort((a, b) => new Date(b.Data) - new Date(a.Data));
    
    dadosFiltrados.forEach((item, index) => {
      const row = document.createElement('tr');
      const valor = parseFloat(item.Valor);
      row.innerHTML = `
        <td>${new Date(item.Data).toLocaleDateString('pt-BR')}</td>
        <td>${item.Categoria}</td>
        <td>${item.Descrição}</td>
        <td class="${valor >= 0 ? 'positive' : 'negative'}">${formatarMoeda(valor)}</td>
        <td class="action-buttons">
          <button class="btn btn-edit" onclick="editGasto(${index})">Editar</button>
          <button class="btn btn-danger" onclick="deleteGasto(${index})">Excluir</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  calcularEstatisticas(dadosFiltrados);
  atualizarGraficos(dadosFiltrados);
}

function editGasto(index) {
  const dadosFiltrados = filtrarDados();
  const gasto = dadosFiltrados[index];
  
  document.getElementById('row-id').value = index;
  document.getElementById('data').value = gasto.Data;
  document.getElementById('categoria').value = gasto.Categoria;
  document.getElementById('descricao').value = gasto.Descrição;
  document.getElementById('valor').value = gasto.Valor;
}

function deleteGasto(index) {
  if (confirm('Tem certeza que deseja excluir este gasto?')) {
    const dadosFiltrados = filtrarDados();
    const gastoParaExcluir = dadosFiltrados[index];
    
    const data = tabletop.sheets(CONFIG.spreadsheet.sheet.name).elements();
    const indexReal = data.findIndex(item => 
      item[CONFIG.spreadsheet.sheet.colunas.data] === gastoParaExcluir.Data && 
      item[CONFIG.spreadsheet.sheet.colunas.categoria] === gastoParaExcluir.Categoria &&
      item[CONFIG.spreadsheet.sheet.colunas.descricao] === gastoParaExcluir.Descrição &&
      item[CONFIG.spreadsheet.sheet.colunas.valor] === gastoParaExcluir.Valor
    );
    
    if (indexReal !== -1) {
      data.splice(indexReal, 1);
      tabletop.sheets(CONFIG.spreadsheet.sheet.name).elements = data;
      tabletop.sheets(CONFIG.spreadsheet.sheet.name).save();
      showInfo(data);
    }
  }
}

function limparFormulario() {
  document.getElementById('gasto-form').reset();
  document.getElementById('row-id').value = '';
}

function exportarCSV() {
  const dadosFiltrados = filtrarDados();
  
  if (dadosFiltrados.length === 0) {
    alert('Não há dados para exportar no período selecionado.');
    return;
  }
  
  // Cabeçalho do CSV
  let csv = 'Data,Categoria,Descrição,Valor\n';
  
  // Dados
  dadosFiltrados.forEach(item => {
    const data = new Date(item.Data).toLocaleDateString('pt-BR');
    const valor = item.Valor.toString().replace('.', ',');
    csv += `${data},${item.Categoria},${item.Descrição},${valor}\n`;
  });
  
  // Criar blob e link para download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `gastos_${document.getElementById('mes-select').value}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Inicialização
async function carregarConfiguracao() {
  try {
    const response = await fetch('config.yaml');
    const yamlText = await response.text();
    CONFIG = jsyaml.load(yamlText);
    inicializarAplicacao();
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    alert('Erro ao carregar configuração. Por favor, recarregue a página.');
  }
}

function inicializarAplicacao() {
  preencherSelectMeses();
  
  tabletop = Tabletop.init({
    key: CONFIG.spreadsheet.url,
    callback: showInfo,
    simpleSheet: true
  });
}

// Event Listeners
document.getElementById('gasto-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const rowId = document.getElementById('row-id').value;
  const newGasto = {
    [CONFIG.spreadsheet.sheet.colunas.data]: document.getElementById('data').value,
    [CONFIG.spreadsheet.sheet.colunas.categoria]: document.getElementById('categoria').value,
    [CONFIG.spreadsheet.sheet.colunas.descricao]: document.getElementById('descricao').value,
    [CONFIG.spreadsheet.sheet.colunas.valor]: document.getElementById('valor').value
  };

  try {
    const data = tabletop.sheets(CONFIG.spreadsheet.sheet.name).elements();
    
    if (rowId === '') {
      // Adicionar novo gasto
      data.push(newGasto);
    } else {
      // Editar gasto existente
      const dadosFiltrados = filtrarDados();
      const gastoParaEditar = dadosFiltrados[rowId];
      const indexReal = data.findIndex(item => 
        item[CONFIG.spreadsheet.sheet.colunas.data] === gastoParaEditar.Data && 
        item[CONFIG.spreadsheet.sheet.colunas.categoria] === gastoParaEditar.Categoria &&
        item[CONFIG.spreadsheet.sheet.colunas.descricao] === gastoParaEditar.Descrição &&
        item[CONFIG.spreadsheet.sheet.colunas.valor] === gastoParaEditar.Valor
      );
      
      if (indexReal !== -1) {
        data[indexReal] = newGasto;
      }
    }

    // Atualizar a planilha
    tabletop.sheets(CONFIG.spreadsheet.sheet.name).elements = data;
    await tabletop.sheets(CONFIG.spreadsheet.sheet.name).save();
    
    // Atualizar a visualização
    showInfo(data);
    limparFormulario();
    
    alert(rowId === '' ? 'Gasto adicionado com sucesso!' : 'Gasto atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar gasto:', error);
    alert('Erro ao salvar gasto. Por favor, tente novamente.');
  }
});

document.getElementById('mes-select').addEventListener('change', () => showInfo(gastosData));
document.getElementById('busca').addEventListener('input', () => showInfo(gastosData));

window.addEventListener('DOMContentLoaded', carregarConfiguracao); 