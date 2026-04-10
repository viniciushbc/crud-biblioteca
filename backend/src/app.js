import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// GET todos
app.get('/livros', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM livros')
  res.json(rows)
})

// GET buscar por nome
app.get('/livros/buscar', async (req, res) => {
  const { nome } = req.query
  const [rows] = await pool.query(
    'SELECT * FROM livros WHERE titulo LIKE ?', [`%${nome}%`]
  )
  res.json(rows)
})

// GET por id
app.get('/livros/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM livros WHERE id = ?', [req.params.id])
  res.json(rows[0])
})

// POST
app.post('/livros', async (req, res) => {
  const { titulo, autor, ano, editora, genero, paginas, quantidade, sinopse } = req.body
  const [result] = await pool.query(
    'INSERT INTO livros (titulo, autor, ano, editora, genero, paginas, quantidade, sinopse) VALUES (?,?,?,?,?,?,?,?)',
    [titulo, autor, ano, editora, genero, paginas, quantidade, sinopse]
  )
  res.status(201).json({ id: result.insertId })
})

// PUT
app.put('/livros/:id', async (req, res) => {
  const { titulo, autor, ano, editora, genero, paginas, quantidade, sinopse } = req.body
  await pool.query(
    'UPDATE livros SET titulo=?, autor=?, ano=?, editora=?, genero=?, paginas=?, quantidade=?, sinopse=? WHERE id=?',
    [titulo, autor, ano, editora, genero, paginas, quantidade, sinopse, req.params.id]
  )
  res.json({ mensagem: 'Atualizado com sucesso' })
})

// DELETE
app.delete('/livros/:id', async (req, res) => {
  await pool.query('DELETE FROM livros WHERE id = ?', [req.params.id])
  res.json({ mensagem: 'Excluído com sucesso' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))