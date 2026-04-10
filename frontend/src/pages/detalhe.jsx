import { useNavigate, useParams } from 'react-router-dom'
import {
  Container, Typography, Button, Box
} from '@mui/material'

export default function DetalheLivro() {
  const { id } = useParams()
  const navigate = useNavigate()

  // chamar api
  const livro = {
    titulo: '',
    autor: '',
    ano: '',
    editora: '',
    genero: '',
    paginas: '',
    quantidade: '',
    sinopse: ''
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Detalhe do Livro</Typography>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography><strong>Título:</strong> {livro.titulo}</Typography>
        <Typography><strong>Autor:</strong> {livro.autor}</Typography>
        <Typography><strong>Ano:</strong> {livro.ano}</Typography>
        <Typography><strong>Editora:</strong> {livro.editora}</Typography>
        <Typography><strong>Gênero:</strong> {livro.genero}</Typography>
        <Typography><strong>Páginas:</strong> {livro.paginas}</Typography>
        <Typography><strong>Quantidade em estoque:</strong> {livro.quantidade}</Typography>
        <Typography><strong>Sinopse:</strong> {livro.sinopse}</Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={() => navigate(`/editar/${id}`)}>Editar</Button>
        <Button sx={{ ml: 2 }} color="error">Excluir</Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate('/')}>Voltar</Button>
      </Box>
    </Container>
  )
}