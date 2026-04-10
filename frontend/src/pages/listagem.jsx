import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material'

export default function ListaLivros() {
  const [busca, setBusca] = useState('')
  const [livros, setLivros] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/livros')
      .then(res => res.json())
      .then(data => setLivros(data))
  }, [])

  const filtrados = livros.filter(l =>
    l.titulo.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Biblioteca</Typography>

      <TextField
        label="Buscar por nome"
        value={busca}
        onChange={e => setBusca(e.target.value)}
        sx={{ my: 2 }}
        fullWidth
      />

      <Button variant="contained" onClick={() => navigate('/cadastro')}>
        Cadastrar livro
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Autor</TableCell>
            <TableCell>Ano</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtrados.map(l => (
            <TableRow key={l.id}>
              <TableCell>{l.titulo}</TableCell>
              <TableCell>{l.autor}</TableCell>
              <TableCell>{l.ano}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => navigate(`/livro/${l.id}`)}>Ver</Button>
                <Button size="small" onClick={() => navigate(`/editar/${l.id}`)}>Editar</Button>
                <Button size="small" color="error">Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}
