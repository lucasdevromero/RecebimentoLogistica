``` javascript
function doGet() {
  const transportadoras = getTransportadoras();
  const template = HtmlService.createTemplateFromFile('formulario');
  template.transportadoras = transportadoras;
  return template.evaluate();
}

function getTransportadoras() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transportadoras');
  
  // Obter o número de linhas preenchidas da coluna B
  const lastRow = sheet.getLastRow();
  
  // Verifique se há dados na coluna B
  if (lastRow < 2) return []; // Se não houver dados, retorne um array vazio

  // Obter os valores da coluna B (da linha 2 até a última linha com dados)
  const data = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  
  // Retornar uma lista com as transportadoras não vazias
  return data.map(row => row[0]).filter(value => value !== '');
}

function salvarDados(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  
  try {
    if (formData.acao === 'novo') {
      // Criação da chave primária
      const chavePrimaria = formData.placa + '.' + Utilities.formatDate(new Date(formData.hora_chegada), Session.getScriptTimeZone(), 'dd/MM/yyyy');
      
      // Verifica se a chave primária já existe
      const chaveExistente = verificarChavePrimaria(sheet, chavePrimaria);
      if (chaveExistente) {
        return 'Erro: A chave primária já existe!'; // Retorna mensagem de erro
      }
      
      // Adiciona um novo registro
      const novaLinha = [chavePrimaria, formData.hora_chegada, formData.placa, formData.pallets, formData.nfs, formData.transportadora, '', ''];
      sheet.appendRow(novaLinha); // Utiliza appendRow uma vez
      return chavePrimaria;  // Retorna a chave primária gerada
    } 
    
    if (formData.acao === 'editar') {
      const chave = formData.chave_primaria;
      const linha = encontrarLinha(sheet, chave);
      
      if (linha !== -1) {
        // Atualiza os campos conforme a solicitação
        if (formData.campo_editar === 'inicio' && formData.inicio_descarregamento) {
          sheet.getRange(linha, 7).setValue(formData.inicio_descarregamento); // Atualiza "Início do Descarregamento"
        } else if (formData.campo_editar === 'fim' && formData.fim_descarregamento) {
          sheet.getRange(linha, 8).setValue(formData.fim_descarregamento); // Atualiza "Fim do Descarregamento"
        }
      } else {
        return 'Erro: Chave primária não encontrada!'; // Caso a chave não seja encontrada
      }
    }
  } catch (error) {
    Logger.log(error);
    return 'Erro ao salvar dados: ' + error.message; // Mensagem de erro genérica em caso de falha
  }
}

// Função para verificar se a chave primária já existe
function verificarChavePrimaria(sheet, chavePrimaria) {
  // Obtém apenas os dados da coluna onde a chave primária está armazenada
  const dados = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues(); // A partir da linha 2 (presumindo que a primeira linha é cabeçalho)
  
  // Utiliza um Set para verificar rapidamente se a chave existe
  const chavesExistentes = new Set(dados.flat()); // .flat() para transformar o array 2D em 1D
  
  return chavesExistentes.has(chavePrimaria); // Retorna true se a chave já existir
}

function encontrarLinha(sheet, chave) {
  // Obtém apenas a coluna com as chaves primárias (coluna 1, a partir da linha 2)
  const dados = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  
  // Itera sobre os dados para encontrar a linha correspondente
  for (let i = 0; i < dados.length; i++) {
    if (dados[i][0] === chave) {
      return i + 2; // Retorna a linha 1-based (i + 2 porque a iteração começa na linha 2)
    }
  }
  
  return -1; // Retorna -1 se não encontrar a chave
}

function buscarChavePrimaria(placa) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  
  // Obtém apenas as colunas necessárias: chave primária (coluna 1) e placa (coluna 3)
  const dados = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();  // Carrega a chave e a placa
  
  // Itera sobre os dados e busca pela placa
  for (let i = 0; i < dados.length; i++) {
    if (dados[i][2] === placa) {  // A placa está na terceira coluna (índice 2)
      return dados[i][0];  // Retorna a chave primária que está na primeira coluna
    }
  }
  
  return '';  // Retorna vazio se não encontrar a placa
}

function verificarChavePrimaria(placa, horaChegada) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  const chavePrimaria = placa + '.' + Utilities.formatDate(new Date(horaChegada), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  
  // Obtém apenas a primeira coluna (onde está a chave primária)
  const chavesExistentes = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();  // Carrega a coluna de chave primária
  
  // Itera sobre as chaves primárias e verifica se já existe
  for (let i = 0; i < chavesExistentes.length; i++) {
    if (chavesExistentes[i][0] === chavePrimaria) {
      return true;  // Se já existir, retorna verdadeiro
    }
  }
  
  return false;  // Se não encontrar a chave, retorna falso
}
