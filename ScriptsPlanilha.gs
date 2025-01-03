// função para trazer em formato BR as datas inseridas
function formatarDatas() {
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // Definindo os intervalos de colunas que precisam ser formatados
  var colunasParaFormatar = ['B', 'G', 'H'];
  var format = "dd/MM/yyyy HH:mm:ss"; 

  // Aplica o formato a cada coluna que contém dados
  colunasParaFormatar.forEach(function(coluna) {
    var range = sheet.getRange(coluna + "2:" + coluna + sheet.getLastRow()); // Define o intervalo dinâmico, até a última linha com dados
    range.setNumberFormat(format);
  });
}


function calcularDiferencaEmHoras() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Definir os intervalos de dados que serão utilizados para calcular as diferenças
  var ultimaLinha = planilha.getLastRow();
  var intervaloDados = planilha.getRange(2, 1, ultimaLinha - 1, 8).getValues(); // Pega as colunas A a H, começando da linha 2
  
  var resultadosI = []; // Para armazenar os resultados da coluna I
  var resultadosJ = []; // Para armazenar os resultados da coluna J
  var resultadosK = []; // Para armazenar os resultados da coluna K
  
  // Função para formatar a diferença em horas e minutos no formato HH:MM
  function formatarDiferencaEmHoras(diferencaEmMillis) {
    if (diferencaEmMillis !== null) {
      var totalMinutos = Math.floor(diferencaEmMillis / (1000 * 60)); // Converte para minutos totais
      var horas = Math.floor(totalMinutos / 60); // Pega as horas inteiras
      var minutos = totalMinutos % 60; // Pega os minutos restantes
      return (horas < 10 ? '0' + horas : horas) + ':' + (minutos < 10 ? '0' + minutos : minutos); // Formata como HH:MM
    }
    return null; // Se não houver diferença, retorna null
  }
  
  // Loop nas linhas da planilha, começando da linha 2
  for (var i = 0; i < intervaloDados.length; i++) {
    var data1 = intervaloDados[i][6]; // Coluna G (índice 6)
    var data2 = intervaloDados[i][7]; // Coluna H (índice 7)
    var data3 = intervaloDados[i][1]; // Coluna B (índice 1)

    var diferenca1 = null;
    var diferenca2 = null;
    var diferenca3 = null;
    
    // Garantir que as datas estão sendo interpretadas corretamente
    if (data1 instanceof Date && data2 instanceof Date) {
      // Calcular a diferença entre data2 e data1 (colunas G e H)
      diferenca1 = data2.getTime() - data1.getTime(); // Obtém a diferença em milissegundos
    }
    
    if (data2 instanceof Date && data3 instanceof Date) {
      // Calcular a diferença entre data2 e data3 (colunas B e H)
      diferenca2 = data2.getTime() - data3.getTime(); // Obtém a diferença em milissegundos
    }

    if (data1 instanceof Date && data3 instanceof Date) {
      // Calcular a diferença entre data1 e data3 (colunas B e G)
      diferenca3 = data1.getTime() - data3.getTime(); // Obtém a diferença em milissegundos
    }
    
    // Adicionar os resultados formatados nas listas para as colunas I, J e K
    resultadosI.push([formatarDiferencaEmHoras(diferenca3)]); // Coloca o resultado na coluna I
    resultadosJ.push([formatarDiferencaEmHoras(diferenca1)]); // Coloca o resultado na coluna J
    resultadosK.push([formatarDiferencaEmHoras(diferenca2)]); // Coloca o resultado na coluna K
  }
  
  // Definir os intervalos de resultados na planilha e escrever tudo de uma vez
  planilha.getRange(2, 9, ultimaLinha - 1, 1).setValues(resultadosI); // Preenche a coluna I (índice 8), começando da linha 2
  planilha.getRange(2, 10, ultimaLinha - 1, 1).setValues(resultadosJ); // Preenche a coluna J (índice 9), começando da linha 2
  planilha.getRange(2, 11, ultimaLinha - 1, 1).setValues(resultadosK); // Preenche a coluna K (índice 10), começando da linha 2
}




function atualizarStatus() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Recebimentos"); // Acessa a aba "Recebimentos"
  const data = sheet.getDataRange().getValues(); // Pega todos os dados da planilha
  const linhaInicial = 1; // Começa a partir da linha 2 (índice 1), já que o índice começa em 0
  
  for (let i = linhaInicial; i < data.length; i++) {
    const colunaA = data[i][0]; // Coluna A (Índice 0) - Verificar se a coluna A está preenchida
    const colunaH = data[i][7]; // Coluna H (Índice 7) - Verificar se a coluna H está preenchida
    const status = colunaH ? "Finalizado" : "Pendente"; // Se a coluna H estiver preenchida, "Finalizado", senão "Pendente"
    
    // Se a coluna A estiver em branco, apagar a informação na coluna L (Índice 11)
    if (!colunaA) {
      sheet.getRange(i + 1, 12).clearContent(); // Apaga o conteúdo da coluna L (12)
    } else {
      // Se a coluna A não estiver em branco, atualizar a coluna L com o status
      sheet.getRange(i + 1, 12).setValue(status); // i + 1 pois a contagem das linhas no Google Sheets começa de 1
    }
  }
}
