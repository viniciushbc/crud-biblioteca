# CRUD Biblioteca

Sistema simples de biblioteca com frontend em React e backend em Node.js + Express, usando MySQL como banco de dados.

## Tecnologias utilizadas

- React
- Vite
- Material UI
- Node.js
- Express
- MySQL

## Estrutura do projeto

```text
crud-biblioteca/
|-- backend/
|   |-- src/
|   |   |-- app.js
|   |   `-- db.js
|   |-- package.json
|   `-- .env
|-- frontend/
|   |-- src/
|   |   |-- App.jsx
|   |   `-- pages/
|   |-- package.json
|   `-- vite.config.js
|-- crud_biblioteca.sql
`-- README.md
```

## Pre-requisitos

- Node.js instalado
- npm instalado
- MySQL instalado e em execucao

## Configuracao do banco de dados

1. Importe o arquivo `crud_biblioteca.sql` no MySQL.
2. Esse arquivo ja cria o banco `crud_biblioteca`, a tabela `livros` e alguns registros de exemplo.
3. Se preferir importar pelo terminal, use um comando como este:

```bash
mysql -u root -p < crud_biblioteca.sql
```

4. A estrutura criada pelo arquivo e esta:

```sql
CREATE TABLE livros (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  autor       VARCHAR(150) NOT NULL,
  ano         INT,
  editora     VARCHAR(100),
  genero      VARCHAR(50),
  paginas     INT,
  quantidade  INT DEFAULT 0,
  sinopse     TEXT,
  criado_em   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Configuracao do backend

No arquivo `backend/.env`, configure as variaveis abaixo de acordo com o seu MySQL:

```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=crud_biblioteca
PORT=3000
```

## Como instalar e executar

### 1. Instalar dependencias do backend

```bash
cd backend
npm install
```

### 2. Instalar dependencias do frontend

```bash
cd frontend
npm install
```

### 3. Iniciar o backend

```bash
cd backend
npm start
```

O backend sera iniciado em `http://localhost:3000`.

### 4. Iniciar o frontend

```bash
cd frontend
npm run dev
```

O frontend sera iniciado em `http://localhost:5173`.

## Observacao para PowerShell no Windows

Se o PowerShell bloquear o comando `npm`, use `npm.cmd` no lugar:

```bash
npm.cmd install
npm.cmd start
npm.cmd run dev
```

## Funcionalidades

- Listagem de livros com paginacao
- Cadastro de livros
- Edicao de livros
- Exclusao de livros
- Visualizacao detalhada de cada livro
- Validacao de dados no frontend e no backend
- Mensagens de erro e sucesso para o usuario

## Rotas principais da API

- `GET /livros`
- `GET /livros/:id`
- `GET /livros/buscar?nome=...`
- `POST /livros`
- `PUT /livros/:id`
- `DELETE /livros/:id`

## Nome do aluno

O nome do aluno aparece no rodape da tela inicial do sistema.
