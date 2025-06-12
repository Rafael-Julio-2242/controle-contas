# Controle de Contas

Um aplicativo móvel desenvolvido com React Native e Expo para gerenciamento de despesas e receitas pessoais.

## 📱 Funcionalidades

- **Gerenciamento Mensal**: Organize suas finanças por mês e ano
- **Controle de Entradas**: Registre todas as suas receitas com título, fonte e valor
- **Controle de Despesas**: Cadastre seus gastos com descrição, fonte, valor e categoria
- **Categorização**: Organize suas despesas em categorias personalizadas
- **Relatórios**: Visualize totais de entradas, saídas e saldo restante
- **Exportação**: Exporte seus dados em formato Excel para análise detalhada

## 🛠️ Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- SQLite (expo-sqlite)
- React Native Paper (UI Components)
- React Navigation
- XLSX (para exportação de dados)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/controle-contas.git
```

2. Instale as dependências:
```bash
cd controle-contas
npm install
```

3. Inicie o projeto:
```bash
npm start
```

## 🚀 Como Usar

1. **Criar Novo Mês**:
   - Na tela inicial, clique no botão "+" para adicionar um novo mês
   - Informe o mês e ano desejados

2. **Registrar Entradas**:
   - Acesse o mês desejado
   - Clique em "+Nova" na seção Entradas
   - Preencha título, fonte e valor
   - Adicione a data da entrada

3. **Registrar Despesas**:
   - Acesse o mês desejado
   - Clique em "+Novo" na seção Custos
   - Preencha descrição, fonte, valor e categoria
   - Adicione a data da despesa

4. **Exportar Dados**:
   - Na tela do mês, clique no botão "Exportar"
   - Um arquivo Excel será gerado com:
     - Totais gerais
     - Lista de entradas
     - Lista de despesas

## 📊 Estrutura do Banco de Dados

O aplicativo utiliza SQLite com as seguintes tabelas:

- **datas**: Armazena os meses e anos
- **categorias**: Categorias para classificação de despesas
- **custos**: Registro de despesas
- **entradas**: Registro de receitas

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Seu Nome - [@seutwitter](https://twitter.com/seutwitter) - email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/controle-contas](https://github.com/seu-usuario/controle-contas)
