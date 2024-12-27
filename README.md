# RecebimentoLogistica
Aplicação simples para controle de recebimentos de cargas, utilizando Google Apps Script e uma interface web intuitiva.

## Objetivo:

Desenvolver um sistema web simples e eficiente para registrar o recebimento de cargas em uma empresa, utilizando o Google Apps Script e o Google Sheets como base. O sistema permite:

### Cadastro de novos recebimentos: 
Incluindo informações como hora de chegada, placa do veículo, quantidade de pallets e NF, além de selecionar a transportadora a partir de uma lista pré-definida.
Edição de recebimentos existentes: Permite editar o horário de início e fim do descarregamento.
Validação de dados: Verifica se a chave primária (gerada a partir da placa e data) já existe, evitando duplicidade de registros.
Interface intuitiva: O formulário web possui um design clean e responsivo, facilitando a utilização.
Integração com Google Sheets: Os dados são armazenados e gerenciados em uma planilha Google Sheets, permitindo a criação de relatórios e análises.

### Funcionalidades Principais:

Formulário de cadastro: Permite inserir os dados de um novo recebimento de carga.
Formulário de edição: Permite editar os dados de um recebimento existente.
Busca de recebimentos: Permite buscar um recebimento por placa do veículo.
Validação de dados: Verifica se os campos obrigatórios foram preenchidos e se a chave primária é única.
Formatação de datas: Formata as datas de chegada, início e fim do descarregamento para um formato legível.

### Tecnologias Utilizadas:

Google Apps Script: Linguagem de programação utilizada para criar scripts que automatizam tarefas no Google Apps.
Google Sheets: Planilha eletrônica utilizada para armazenar os dados dos recebimentos.
HTML, CSS e JavaScript: Linguagens utilizadas para criar a interface do usuário.

### Estrutura do Código:

doGet(): Função principal que renderiza o formulário HTML.
getTransportadoras(): Função que obtém a lista de transportadoras de uma planilha.
salvarDados(): Função que salva os dados do formulário na planilha, realizando as validações necessárias.
verificarChavePrimaria(): Função que verifica se a chave primária já existe na planilha.
encontrarLinha(): Função que encontra a linha correspondente a uma chave primária na planilha.
buscarChavePrimaria(): Função que busca a chave primária correspondente a uma placa.
formatarDatas(): Função que formata as datas nas colunas especificadas da planilha.

### Próximos Passos:

Implementação de relatórios: Criar relatórios personalizados para analisar os dados dos recebimentos.
Integração com outros sistemas: Integrar o sistema com outros sistemas da empresa, como sistemas de gestão de estoque.
Melhoria da interface: Adicionar mais funcionalidades à interface, como filtros e ordenação de dados.
Implementação de notificações: Enviar notificações por e-mail ou outras plataformas quando ocorrerem eventos específicos, como a chegada de uma nova carga.

### Observações:

Este é um projeto básico e pode ser customizado e expandido de acordo com as necessidades específicas de cada empresa.
O código pode ser otimizado e melhorado em diversos aspectos.
É importante realizar testes unitários para garantir a qualidade do código.
