import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@mui/material'

export default function ListaLivros() {
  const [busca, setBusca] = useState('')
  const [livros, setLivros] = useState([])
  // Controle da paginação da tabela
  const [pagina, setPagina] = useState(0)
  const [linhasPorPagina, setLinhasPorPagina] = useState(5)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/livros')
      .then(res => res.json())
      .then(data => setLivros(data))
  }, [])

  const filtrados = livros.filter(l =>
    l.titulo.toLowerCase().includes(busca.toLowerCase())
  )

  // Pega só os livros da página atual
  const inicio = pagina * linhasPorPagina
  const fim = inicio + linhasPorPagina
  const livrosPaginados = filtrados.slice(inicio, fim)

  const handleBusca = e => {
    setBusca(e.target.value)
    // Sempre volta pra primeira página quando fizer uma nova busca
    setPagina(0)
  }

  const handleMudarPagina = (_, novaPagina) => {
    setPagina(novaPagina)
  }

  const handleMudarLinhasPorPagina = e => {
    // Muda quantos itens aparecem por vez e reinicia a paginação
    setLinhasPorPagina(parseInt(e.target.value, 10))
    setPagina(0)
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Biblioteca</Typography>

      <TextField
        label="Buscar por nome"
        value={busca}
        onChange={handleBusca}
        sx={{ my: 2 }}
        fullWidth
      />

      <Button variant="contained" onClick={() => navigate('/cadastro')}>
        Cadastrar livro
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Titulo</TableCell>
            <TableCell>Autor</TableCell>
            <TableCell>Ano</TableCell>
            <TableCell>Acoes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {livrosPaginados.map(l => (
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

      {/* Componente do Material para navegar entre as páginas da lista */}
      <TablePagination
        component="div"
        count={filtrados.length}
        page={pagina}
        onPageChange={handleMudarPagina}
        rowsPerPage={linhasPorPagina}
        onRowsPerPageChange={handleMudarLinhasPorPagina}
        rowsPerPageOptions={[5, 10, 15]}
        labelRowsPerPage="Livros por pagina"
      />
    </Container>
  )
}
