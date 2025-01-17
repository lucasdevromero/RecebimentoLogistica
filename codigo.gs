function doGet() {
  const transportadoras = getTransportadoras();
  let template = HtmlService.createTemplateFromFile('formulario');
  template.transportadoras = transportadoras;  // Certifique-se que transportadoras é um array válido
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

// Função para salvar dados com tratamento de exceções aprimorado
function salvarDados(formData) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
    try {
        // Caso de ação "novo"
        if (formData.acao === 'novo') {
            // Hora de chegada já está em formato ISO
            const horaChegada = new Date(formData.hora_chegada);
            
            // Verifique se a data está válida
            if (isNaN(horaChegada)) {
                return 'Erro: Hora de chegada inválida!'; // Retorna erro se a data não for válida
            }

            const chavePrimaria = formData.placa + '.' + Utilities.formatDate(horaChegada, Session.getScriptTimeZone(), 'dd/MM/yyyy');
            const chaveExistente = verificarChavePrimaria(chavePrimaria);
            if (chaveExistente) {
                return 'Erro: A chave primária já existe!'; // Retorna mensagem de erro
            }

            const novaLinha = [chavePrimaria, formData.hora_chegada, formData.placa, formData.tipocarga, '', '', formData.transportadora, '', ''];
            sheet.appendRow(novaLinha); // Adiciona uma nova linha com os dados
            return chavePrimaria; // Retorna a chave primária gerada
        }

        // Caso de ação "editar"
        if (formData.acao === 'editar') {
            const chave = formData.chave_primaria;
            const linha = encontrarLinha(sheet, chave);
            if (linha !== -1) {
                // Verifica se o campo de edição é 'inicio' ou 'fim'
                if (formData.campo_editar === 'inicio' && formData.inicio_descarregamento) {
                    sheet.getRange(linha, 8).setValue(formData.inicio_descarregamento); // Atualiza "Início do Descarregamento"
                } else if (formData.campo_editar === 'fim' && formData.fim_descarregamento) {
                    sheet.getRange(linha, 9).setValue(formData.fim_descarregamento); // Atualiza "Fim do Descarregamento"

                    // Inserir os dados de Pallets e NFs apenas se o campo de edição for "fim"
                    if (formData.pallets) {
                        sheet.getRange(linha, 5).setValue(formData.pallets); // Atualiza "Pallets" na coluna 5
                    }
                    if (formData.nfs) {
                        sheet.getRange(linha, 6).setValue(formData.nfs); // Atualiza "NFs" na coluna 6
                    }
                }
            } else {
                return 'Erro: Chave primária não encontrada!'; // Caso a chave não seja encontrada
            }
        }
    } catch (error) {
        Logger.log(error); // Apenas loga o erro no console
        return 'Erro ao salvar dados!'; // Mensagem de erro genérica
    }
}

// Função otimizada para verificar a chave primária
function verificarChavePrimaria(chavePrimaria) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat();
    const chavesExistentes = new Set(data); // Usando Set para verificar rapidamente a existência da chave
    return chavesExistentes.has(chavePrimaria); // Retorna true se a chave já existir
}

// Função para encontrar a linha com a chave primária
function encontrarLinha(sheet, chave) {
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat();
    const index = data.indexOf(chave); // Encontra o índice da chave primária
    if (index !== -1) {
        return index + 2; // Retorna a linha 1-based (index + 2 porque a iteração começa na linha 2)
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

// Função otimizada para verificar a chave primária com placa e hora de chegada
function verificarChavePrimaria2(placa, horaChegada) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
    const chavePrimaria = placa + '.' + Utilities.formatDate(new Date(horaChegada), Session.getScriptTimeZone(), 'dd/MM/yyyy');
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat();
    const chavesExistentes = new Set(data); // Usando Set para verificar rapidamente a existência da chave
    return chavesExistentes.has(chavePrimaria); // Retorna true se a chave primária já existir
}

// Função para buscar códigos pendentes
function buscarCodigosPendentes() {
    var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Recebimentos"); // Acessa a planilha
    var dados = planilha.getRange(2, 1, planilha.getLastRow() - 1, 13).getValues(); // Obtém as linhas de dados da planilha (ignorando o cabeçalho)
    var codigosPendentes = new Set(); // Usando um Set para garantir unicidade

    // Loop para percorrer as linhas e verificar o status
    for (var i = 0; i < dados.length; i++) {
        var codigo = dados[i][0]; // Coluna A (Código de Rastreio)
        var status = dados[i][12]; // Coluna M (Status), índice 12 (considerando que o índice começa em 0)

        // Verifica se o status é "Pendente - Inicio" ou "Pendente - Fim"
        if (status === "Pendente - Inicio" || status === "Pendente - Fim") {
            codigosPendentes.add(codigo); // Adiciona o código ao Set
        }
    }

    // Converte o Set para um array e retorna
    return Array.from(codigosPendentes); // Retorna apenas os códigos únicos
}

// Função para buscar o status do descarregamento baseado no código de rastreio
function buscarStatusDescarregamento(codigo) {
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getSheetByName("Recebimentos");  // Ajuste o nome da aba conforme necessário
    const dados = aba.getDataRange().getValues();  // Obtém todos os dados da planilha
    
    for (let i = 0; i < dados.length; i++) {
        if (dados[i][0] === codigo) {  // Supondo que a coluna 0 (A) contém os códigos de rastreio
            return dados[i][12];  // Supondo que a coluna M (13ª coluna) contém o status "Pendente - Início" ou "Pendente - Fim"
        }
    }
    
    return null;  // Se o código não for encontrado
}
