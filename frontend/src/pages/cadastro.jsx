import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container, Typography, TextField, Button, Box
} from '@mui/material'

export default function CadastroLivro() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    ano: '',
    editora: '',
    genero: '',
    paginas: '',
    quantidade: '',
    sinopse: ''
  })
  
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/livros/${id}`)
        .then(res => res.json())
        .then(data => setForm(data))
    }
  }, [id])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()

    const url    = id ? `http://localhost:3000/livros/${id}` : 'http://localhost:3000/livros'
    const method = id ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(() => navigate('/'))
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">{id ? 'Editar Livro' : 'Cadastrar Livro'}</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Título"              name="titulo"    value={form.titulo}    onChange={handleChange} />
        <TextField label="Autor"               name="autor"     value={form.autor}     onChange={handleChange} />
        <TextField label="Ano"                 name="ano"       value={form.ano}       onChange={handleChange} type="number" />
        <TextField label="Editora"             name="editora"   value={form.editora}   onChange={handleChange} />
        <TextField label="Gênero"              name="genero"    value={form.genero}    onChange={handleChange} />
        <TextField label="Páginas"             name="paginas"   value={form.paginas}   onChange={handleChange} type="number" />
        <TextField label="Quantidade estoque"  name="quantidade"value={form.quantidade}onChange={handleChange} type="number" />
        <TextField label="Sinopse"             name="sinopse"   value={form.sinopse}   onChange={handleChange} multiline rows={4} />

        <Box>
          <Button type="submit" variant="contained">Salvar</Button>
          <Button sx={{ ml: 2 }} onClick={() => navigate('/')}>Cancelar</Button>
        </Box>
      </Box>
    </Container>
  )
}