// Função para formatar as datas nas colunas B, G e H
function formatarDatas() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  
  // Definindo o formato desejado (BR)
  var format = "dd/MM/yyyy HH:mm:ss"; 
  
  // Obtém a última linha com dados uma vez
  var ultimaLinha = sheet.getLastRow();

  // Definindo os intervalos das colunas que precisam ser formatadas
  var colunasParaFormatar = ['B', 'G', 'H'];
  
  // Aplica o formato para todas as colunas de uma vez
  colunasParaFormatar.forEach(function(coluna) {
    var range = sheet.getRange(coluna + "2:" + coluna + ultimaLinha); // Define o intervalo dinâmico até a última linha
    range.setNumberFormat(format); // Aplica o formato à coluna
  });
}


function calcularDiferencasEmHoras() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  var ultimaLinha = planilha.getLastRow();
  var intervaloDados = planilha.getRange(2, 1, ultimaLinha - 1, 8).getValues(); // Colunas A a H
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
    var data1 = intervaloDados[i][6]; // Coluna G
    var data2 = intervaloDados[i][7]; // Coluna H
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
  planilha.getRange(2, 9, valoresI.length, 1).setValues(valoresI); // Preenche a coluna I
  planilha.getRange(2, 10, valoresJ.length, 1).setValues(valoresJ); // Preenche a coluna J
  planilha.getRange(2, 11, valoresK.length, 1).setValues(valoresK); // Preenche a coluna K
}



function atualizarStatus() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Recebimentos"); // Acessa a aba "Recebimentos"
  const data = sheet.getDataRange().getValues(); // Pega todos os dados da planilha
  const linhaInicial = 1; // Começa a partir da linha 2 (índice 1), já que o índice começa em 0
  
  for (let i = linhaInicial; i < data.length; i++) {
    const colunaA = data[i][0]; // Coluna A (Índice 0) - Verificar se a coluna A está preenchida
    const colunaG = data[i][6]; // Coluna G (Índice 6)
    const colunaH = data[i][7]; // Coluna H (Índice 7)
    
    let status = ''; // Variável para armazenar o status a ser atualizado
    
    // Definindo o status com base nas condições das colunas G e H
    if (!colunaG && !colunaH) {
      status = "Pendente - Inicio"; // Quando G e H estão vazias
    } else if (colunaG && !colunaH) {
      status = "Pendente - Fim"; // Quando G está preenchida e H está vazia
    } else if (colunaG && colunaH) {
      status = "Finalizado"; // Quando G e H estão preenchidas
    }
    
    // Se a coluna A estiver em branco, apagar a informação na coluna L (Índice 11)
    if (!colunaA) {
      sheet.getRange(i + 1, 12).clearContent(); // Apaga o conteúdo da coluna L (12)
    } else {
      // Se a coluna A não estiver em branco, atualizar a coluna L com o status calculado
      sheet.getRange(i + 1, 12).setValue(status); // i + 1 pois a contagem das linhas no Google Sheets começa de 1
    }
  }
}

function apagarDadosSeColunaAVazia() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recebimentos');
  
  // Verifica se a aba 'recebimento' existe
  if (!planilha) {
    Logger.log("A aba 'recebimento' não foi encontrada.");
    return;
  }
  
  // Definir o intervalo de dados na coluna G, H, I, J e K
  var ultimaLinha = planilha.getLastRow();
  
  // Intervalos para as colunas G, H, I, J e K
  var intervaloColunaG = planilha.getRange(2, 7, ultimaLinha - 1, 1).getValues(); // Coluna G (começando da linha 2)
  var intervaloColunaH = planilha.getRange(2, 8, ultimaLinha - 1, 1).getValues(); // Coluna H (começando da linha 2)
  
  // Loop pelas linhas da planilha
  for (var i = 0; i < ultimaLinha - 1; i++) {
    var valorColunaG = intervaloColunaG[i][0]; // Valor na coluna G da linha i + 2
    var valorColunaH = intervaloColunaH[i][0]; // Valor na coluna H da linha i + 2
    
    // Se a coluna H estiver vazia, apagamos os valores nas colunas J e K
    if (!valorColunaH) { // Se a célula estiver vazia (falsy)
      planilha.getRange(i + 2, 10).setValue(''); // Coluna J
      planilha.getRange(i + 2, 11).setValue(''); // Coluna K
    }
    
    // Se a coluna G estiver vazia, apagamos o valor na coluna I
    if (!valorColunaG) { // Se a célula estiver vazia (falsy)
      planilha.getRange(i + 2, 9).setValue(''); // Coluna I
    }
  }
}
