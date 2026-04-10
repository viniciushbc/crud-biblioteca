import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

function validarId(id) {
  const idNumero = Number(id)

  if (!Number.isInteger(idNumero) || idNumero <= 0) {
    return 'Id invalido.'
  }

  return null
}

function validarLivro(dados) {
  const erros = []
  const anoAtual = new Date().getFullYear()

  if (typeof dados.titulo !== 'string' || !dados.titulo.trim()) {
    erros.push('O titulo e obrigatorio.')
  }

  if (typeof dados.autor !== 'string' || !dados.autor.trim()) {
    erros.push('O autor e obrigatorio.')
  }

  if (typeof dados.editora !== 'string' || !dados.editora.trim()) {
    erros.push('A editora e obrigatoria.')
  }

  if (typeof dados.genero !== 'string' || !dados.genero.trim()) {
    erros.push('O genero e obrigatorio.')
  }

  if (typeof dados.sinopse !== 'string' || !dados.sinopse.trim()) {
    erros.push('A sinopse e obrigatoria.')
  }

  const ano = Number(dados.ano)
  if (!Number.isInteger(ano) || ano <= 0 || ano > anoAtual) {
    erros.push('O ano informado e invalido.')
  }

  const paginas = Number(dados.paginas)
  if (!Number.isInteger(paginas) || paginas <= 0) {
    erros.push('A quantidade de paginas deve ser maior que zero.')
  }

  const quantidade = Number(dados.quantidade)
  if (!Number.isInteger(quantidade) || quantidade < 0) {
    erros.push('A quantidade em estoque nao pode ser negativa.')
  }

  return erros
}

function normalizarLivro(dados) {
  return {
    titulo: dados.titulo.trim(),
    autor: dados.autor.trim(),
    ano: Number(dados.ano),
    editora: dados.editora.trim(),
    genero: dados.genero.trim(),
    paginas: Number(dados.paginas),
    quantidade: Number(dados.quantidade),
    sinopse: dados.sinopse.trim()
  }
}

// GET todos
app.get('/livros', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM livros')
    res.json(rows)
  } catch {
    res.status(500).json({ mensagem: 'Erro ao buscar os livros.' })
  }
})

// GET buscar por nome
app.get('/livros/buscar', async (req, res) => {
  const { nome } = req.query

  if (typeof nome !== 'string' || !nome.trim()) {
    return res.status(400).json({ mensagem: 'Informe um nome para a busca.' })
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM livros WHERE titulo LIKE ?',
      [`%${nome.trim()}%`]
    )
    return res.json(rows)
  } catch {
    return res.status(500).json({ mensagem: 'Erro ao buscar livros pelo nome.' })
  }
})

// GET por id
app.get('/livros/:id', async (req, res) => {
  const erroId = validarId(req.params.id)

  if (erroId) {
    return res.status(400).json({ mensagem: erroId })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM livros WHERE id = ?', [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Livro nao encontrado.' })
    }

    return res.json(rows[0])
  } catch {
    return res.status(500).json({ mensagem: 'Erro ao buscar o livro.' })
  }
})

// POST
app.post('/livros', async (req, res) => {
  const erros = validarLivro(req.body)

  if (erros.length > 0) {
    return res.status(400).json({
      mensagem: 'Dados invalidos.',
      erros
    })
  }

  const livro = normalizarLivro(req.body)

  try {
    const [result] = await pool.query(
      'INSERT INTO livros (titulo, autor, ano, editora, genero, paginas, quantidade, sinopse) VALUES (?,?,?,?,?,?,?,?)',
      [livro.titulo, livro.autor, livro.ano, livro.editora, livro.genero, livro.paginas, livro.quantidade, livro.sinopse]
    )

    return res.status(201).json({ id: result.insertId })
  } catch {
    return res.status(500).json({ mensagem: 'Erro ao cadastrar o livro.' })
  }
})

// PUT
app.put('/livros/:id', async (req, res) => {
  const erroId = validarId(req.params.id)

  if (erroId) {
    return res.status(400).json({ mensagem: erroId })
  }

  const erros = validarLivro(req.body)

  if (erros.length > 0) {
    return res.status(400).json({
      mensagem: 'Dados invalidos.',
      erros
    })
  }

  const livro = normalizarLivro(req.body)

  try {
    const [result] = await pool.query(
      'UPDATE livros SET titulo=?, autor=?, ano=?, editora=?, genero=?, paginas=?, quantidade=?, sinopse=? WHERE id=?',
      [livro.titulo, livro.autor, livro.ano, livro.editora, livro.genero, livro.paginas, livro.quantidade, livro.sinopse, req.params.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Livro nao encontrado.' })
    }

    return res.json({ mensagem: 'Atualizado com sucesso' })
  } catch {
    return res.status(500).json({ mensagem: 'Erro ao atualizar o livro.' })
  }
})

// DELETE
app.delete('/livros/:id', async (req, res) => {
  const erroId = validarId(req.params.id)

  if (erroId) {
    return res.status(400).json({ mensagem: erroId })
  }

  try {
    const [result] = await pool.query('DELETE FROM livros WHERE id = ?', [req.params.id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Livro nao encontrado.' })
    }

    return res.json({ mensagem: 'Excluido com sucesso' })
  } catch {
    return res.status(500).json({ mensagem: 'Erro ao excluir o livro.' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
