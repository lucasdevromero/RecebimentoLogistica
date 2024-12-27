``` javascript
function doGet() {
  const transportadoras = getTransportadoras();
  const template = HtmlService.createTemplateFromFile('formulario');
  template.transportadoras = transportadoras;
  return template.evaluate();
}

function getTransportadoras() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transportadoras');
  const data = sheet.getRange('B2:B').getValues(); // Obtém os valores da coluna B, a partir da linha 2
  const transportadoras = data.filter(row => row[0] !== ''); // Filtra linhas vazias
  return transportadoras.map(row => row[0]); // Retorna apenas os valores da coluna B
}

function salvarDados(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  
  if (formData.acao === 'novo') {
    const chavePrimaria = formData.placa + '.' + Utilities.formatDate(new Date(formData.hora_chegada), Session.getScriptTimeZone(), 'dd/MM/yyyy');
    
    // Verifica se a chave primária já existe
    const chaveExistente = verificarChavePrimaria(sheet, chavePrimaria);
    
    if (chaveExistente) {
      return 'Erro: A chave primária já existe!'; // Retorna a mensagem de erro
    }
    
    // Se for novo recebimento, cria um novo registro
    const lastRow = sheet.getLastRow();
    sheet.appendRow([chavePrimaria, formData.hora_chegada, formData.placa, formData.pallets, formData.nfs, formData.transportadora, '', '']);
    return chavePrimaria;  // Retorna a chave primária gerada
  } else if (formData.acao === 'editar') {
    const chave = formData.chave_primaria;
    const linha = encontrarLinha(sheet, chave);
    
    if (linha !== -1) {
      if (formData.campo_editar === 'inicio' && formData.inicio_descarregamento) {
        sheet.getRange(linha, 7).setValue(formData.inicio_descarregamento); // Atualiza "Início do Descarregamento"
      } else if (formData.campo_editar === 'fim' && formData.fim_descarregamento) {
        sheet.getRange(linha, 8).setValue(formData.fim_descarregamento); // Atualiza "Fim do Descarregamento"
      }
    }
  }
}

// Função para verificar se a chave primária já existe
function verificarChavePrimaria(sheet, chavePrimaria) {
  const dados = sheet.getDataRange().getValues();
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === chavePrimaria) {
      return true; // Retorna verdadeiro se a chave já existir
    }
  }
  return false; // Se não encontrar, retorna falso
}

function encontrarLinha(sheet, chave) {
  const dados = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dados.length; i++) {
    const rowChave = dados[i][0]; // A chave primária está na primeira coluna
    if (rowChave === chave) {
      return i + 1; // Retorna a linha correspondente (1-based)
    }
  }
  return -1; // Se não encontrar a chave, retorna -1
}

function buscarChavePrimaria(placa) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  const dados = sheet.getDataRange().getValues();
  
  // Itera sobre os dados da planilha e busca a chave primária correspondente à placa
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][2] === placa) {  // A placa está na terceira coluna (índice 2)
      return dados[i][0];  // Retorna a chave primária que está na primeira coluna
    }
  }
  return ''; // Retorna vazio se não encontrar
}
