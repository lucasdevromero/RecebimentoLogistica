function formatarDatas() {
  var sheet = SpreadsheetApp.getActiveSheet();

  // Define cada intervalo separadamente
  var rangeB = sheet.getRange("B2:B");
  var rangeG = sheet.getRange("G2:G");
  var rangeH = sheet.getRange("H2:H");

  var format = "dd/MM/yyyy HH:mm:ss"; 

  // Aplica o formato a cada intervalo
  rangeB.setNumberFormat(format);
  rangeG.setNumberFormat(format);
  rangeH.setNumberFormat(format);
}
