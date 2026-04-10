CREATE DATABASE crud_biblioteca;
USE crud_biblioteca;

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

DELETE FROM livros;

INSERT INTO livros (titulo, autor, ano, editora, genero, paginas, quantidade, sinopse) VALUES
('O Alquimista', 'Paulo Coelho', 1988, 'HarperCollins', 'Ficção', 208, 8, 'Santiago busca seu tesouro pessoal pelo deserto do Saara.'),
('Onze Minutos', 'Paulo Coelho', 2003, 'HarperCollins', 'Romance', 288, 6, 'Maria, uma jovem brasileira, descobre o amor em Genebra.'),
('O Diário de um Mago', 'Paulo Coelho', 1987, 'HarperCollins', 'Autobiográfico', 256, 5, 'A peregrinação de Paulo Coelho pelo Caminho de Santiago.'),
('Brida', 'Paulo Coelho', 1990, 'HarperCollins', 'Ficção', 272, 4, 'Uma jovem irlandesa busca seu dom espiritual e o amor verdadeiro.'),
('Veronika Decide Morrer', 'Paulo Coelho', 1998, 'HarperCollins', 'Romance', 224, 5, 'Veronika tenta o suicídio e descobre o valor da vida num manicômio.');
