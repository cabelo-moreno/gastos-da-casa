// Configuração da planilha do Google Sheets
const CONFIG = {
  // URL da planilha do Google Sheets
  SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1STMEeICq_ShlzIL8MTvQyDSBBs9dMPZX72sBS51xB6o/edit?usp=sharing',
  
  // Configurações da planilha
  SHEET: {
    NAME: 'Sheet1',
    COLUNAS: {
      DATA: 'Data',
      CATEGORIA: 'Categoria',
      DESCRICAO: 'Descrição',
      VALOR: 'Valor'
    }
  },
  
  // Orçamentos padrão por categoria (em reais)
  ORCAMENTOS: {
    'Alimentação': 1000,
    'Moradia': 2000,
    'Transporte': 500,
    'Saúde': 300,
    'Educação': 400,
    'Lazer': 300,
    'Outros': 500
  },
  
  // Cores para os gráficos
  GRAFICO_CORES: [
    '#2ecc71', // Verde
    '#3498db', // Azul
    '#9b59b6', // Roxo
    '#e74c3c', // Vermelho
    '#f1c40f', // Amarelo
    '#1abc9c', // Verde água
    '#e67e22'  // Laranja
  ],
  
  // Configurações de alerta do orçamento
  ALERTAS: {
    ALERTA_PORCENTAGEM: 80,  // Alerta quando atinge 80% do orçamento
    EXCEDIDO_PORCENTAGEM: 100 // Excedido quando passa de 100% do orçamento
  }
}; 