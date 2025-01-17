// Função para formatar as datas nas colunas B, G e H
function formatarDatas() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  
  // Definindo o formato desejado (BR)
  var format = "dd/MM/yyyy HH:mm:ss"; 
  
  // Obtém a última linha com dados uma vez
  var ultimaLinha = sheet.getLastRow();
  
  // Definindo os intervalos das colunas que precisam ser formatadas
  var colunasParaFormatar = ['B', 'H', 'I'];
  
  // Aplica a conversão de data se necessário e formata as colunas
  colunasParaFormatar.forEach(function(coluna) {
    var range = sheet.getRange(coluna + "2:" + coluna + ultimaLinha); // Define o intervalo dinâmico até a última linha
    
    // Convertendo os valores das células para objetos Date se necessário
    var valores = range.getValues();
    
    for (var i = 0; i < valores.length; i++) {
      if (typeof valores[i][0] === 'string' && valores[i][0].includes("T")) {
        // Caso a célula contenha uma string no formato ISO, converta para um objeto Date
        valores[i][0] = new Date(valores[i][0]);
      }
    }
    
    // Definindo os valores convertidos de volta na planilha
    range.setValues(valores);
    
    // Aplica o formato desejado à coluna
    range.setNumberFormat(format); 
  });
}




// OK
function calcularDiferencasEmHoras() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  var ultimaLinha = planilha.getLastRow();
  var intervaloDados = planilha.getRange(2, 1, ultimaLinha - 1, 12).getValues(); // Colunas A a K
  var valoresI = [];
  var valoresJ = [];
  var valoresK = [];
  
  function formatarDiferencaEmHoras(diferencaEmMillis) {
    if (diferencaEmMillis !== null && diferencaEmMillis !== undefined) {
      var totalMinutos = Math.floor(diferencaEmMillis / (1000 * 60));
      var horas = Math.floor(totalMinutos / 60);
      var minutos = totalMinutos % 60;
      return (horas < 10 ? '0' + horas : horas) + ':' + (minutos < 10 ? '0' + minutos : minutos);
    }
    return null;
  }
  
  // Processa as diferenças para as colunas I, J e K
  for (var i = 0; i < intervaloDados.length; i++) {
    var data1 = intervaloDados[i][7]; // Coluna H (Agora a coluna 7)
    var data2 = intervaloDados[i][8]; // Coluna I (Agora a coluna 8)
    var data3 = intervaloDados[i][1]; // Coluna B
    
    var diferencaI = null;
    if (data1 instanceof Date && data3 instanceof Date) {
      diferencaI = data1.getTime() - data3.getTime();
    }
    valoresI.push([formatarDiferencaEmHoras(diferencaI)]);
    
    var diferencaJ = null;
    if (data1 instanceof Date && data2 instanceof Date) {
      diferencaJ = data2.getTime() - data1.getTime();
    }
    valoresJ.push([formatarDiferencaEmHoras(diferencaJ)]);
    
    var diferencaK = null;
    if (data2 instanceof Date && data3 instanceof Date) {
      diferencaK = data2.getTime() - data3.getTime();
    }
    valoresK.push([formatarDiferencaEmHoras(diferencaK)]);
  }
  
  // Atualiza as colunas I, J e K de uma vez só
  planilha.getRange(2, 10, valoresI.length, 1).setValues(valoresI); // Preenche a coluna I
  planilha.getRange(2, 11, valoresJ.length, 1).setValues(valoresJ); // Preenche a coluna J
  planilha.getRange(2, 12, valoresK.length, 1).setValues(valoresK); // Preenche a coluna K
}


// OK
function atualizarStatus() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Recebimentos"); // Acessa a aba "Recebimentos"
  const data = sheet.getDataRange().getValues(); // Pega todos os dados da planilha
  const linhaInicial = 1; // Começa a partir da linha 2 (índice 1), já que o índice começa em 0
  
  for (let i = linhaInicial; i < data.length; i++) {
    const colunaA = data[i][0]; // Coluna A (Índice 0) - Verificar se a coluna A está preenchida
    const colunaH = data[i][7]; // Coluna H (Índice 7)
    const colunaI = data[i][8]; // Coluna I (Índice 8)
    
    let status = ''; // Variável para armazenar o status a ser atualizado
    
    // Definindo o status com base nas condições das colunas H e I
    if (!colunaH && !colunaI) {
      status = "Pendente - Inicio"; // Quando H e I estão vazias
    } else if (colunaH && !colunaI) {
      status = "Pendente - Fim"; // Quando H está preenchida e I está vazia
    } else if (colunaH && colunaI) {
      status = "Finalizado"; // Quando H e I estão preenchidas
    }
    
    // Se a coluna A estiver em branco, apagar a informação na coluna L (Índice 11)
    if (!colunaA) {
      sheet.getRange(i + 1, 13).clearContent(); // Apaga o conteúdo da coluna L (12)
    } else {
      // Se a coluna A não estiver em branco, atualizar a coluna L com o status calculado
      sheet.getRange(i + 1, 13).setValue(status); // i + 1 pois a contagem das linhas no Google Sheets começa de 1
    }
  }
}

// OK
function apagarDadosSeColunaAVazia() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  
  // Verifica se a aba 'recebimento' existe
  if (!planilha) {
    Logger.log("A aba 'recebimento' não foi encontrada.");
    return;
  }
  
  // Definir o intervalo de dados na coluna H, I, J, K e L
  var ultimaLinha = planilha.getLastRow();
  
  // Intervalos para as colunas H, I, J, K e L
  var intervaloColunaH = planilha.getRange(2, 8, ultimaLinha - 1, 1).getValues(); // Coluna H (agora a 8ª coluna)
  var intervaloColunaI = planilha.getRange(2, 9, ultimaLinha - 1, 1).getValues(); // Coluna I (agora a 9ª coluna)
  
  // Loop pelas linhas da planilha
  for (var i = 0; i < ultimaLinha - 1; i++) {
    var valorColunaH = intervaloColunaH[i][0]; // Valor na coluna H da linha i + 2
    var valorColunaI = intervaloColunaI[i][0]; // Valor na coluna I da linha i + 2
    
    // Se a coluna I estiver vazia, apagamos os valores nas colunas J e K
    if (!valorColunaI) { // Se a célula estiver vazia (falsy)
      planilha.getRange(i + 2, 11).setValue(''); // Coluna J
      planilha.getRange(i + 2, 12).setValue(''); // Coluna K
    }
    
    // Se a coluna H estiver vazia, apagamos o valor na coluna I
    if (!valorColunaH) { // Se a célula estiver vazia (falsy)
      planilha.getRange(i + 2, 8).setValue(''); // Coluna I
    }
  }
}
