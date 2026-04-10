import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Alert,
  Container,
  Snackbar,
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
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('success')
  // Controle da paginacao da tabela
  const [pagina, setPagina] = useState(0)
  const [linhasPorPagina, setLinhasPorPagina] = useState(5)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const carregarLivros = async () => {
      try {
        setCarregando(true)
        setErro('')

        const res = await fetch('http://localhost:3000/livros')

        if (!res.ok) {
          const erroApi = await res.json()
          throw new Error(erroApi.mensagem || 'Nao foi possivel carregar os livros.')
        }

        const data = await res.json()
        setLivros(data)
      } catch (error) {
        setErro(error.message || 'Erro ao carregar os livros.')
      } finally {
        setCarregando(false)
      }
    }

    carregarLivros()
  }, [])

  useEffect(() => {
    if (location.state?.mensagem) {
      setMensagem(location.state.mensagem)
      setTipoMensagem(location.state.tipo || 'success')
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const filtrados = livros.filter(l =>
    l.titulo.toLowerCase().includes(busca.toLowerCase())
  )

  // Pega so os livros da pagina atual
  const inicio = pagina * linhasPorPagina
  const fim = inicio + linhasPorPagina
  const livrosPaginados = filtrados.slice(inicio, fim)

  const handleBusca = e => {
    setBusca(e.target.value)
    // Sempre volta pra primeira pagina quando fizer uma nova busca
    setPagina(0)
  }

  const handleMudarPagina = (_, novaPagina) => {
    setPagina(novaPagina)
  }

  const handleMudarLinhasPorPagina = e => {
    // Muda quantos itens aparecem por vez e reinicia a paginacao
    setLinhasPorPagina(parseInt(e.target.value, 10))
    setPagina(0)
  }

  const handleFecharMensagem = (_, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setMensagem('')
  }

  const handleExcluir = async id => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este livro?')

    if (!confirmar) {
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/livros/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const erroApi = await res.json()
        throw new Error(erroApi.mensagem || 'Nao foi possivel excluir o livro.')
      }

      setLivros(prevLivros => prevLivros.filter(livro => livro.id !== id))
      setPagina(0)
      setMensagem('Livro excluido com sucesso.')
      setTipoMensagem('success')
    } catch (error) {
      setMensagem(error.message || 'Erro ao excluir o livro.')
      setTipoMensagem('error')
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Biblioteca</Typography>

      {erro && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {erro}
        </Alert>
      )}

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

      {carregando ? (
        <Typography sx={{ mt: 2 }}>Carregando livros...</Typography>
      ) : (
        <>
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
                    <Button size="small" color="error" onClick={() => handleExcluir(l.id)}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtrados.length === 0 && (
            <Typography sx={{ mt: 2 }}>
              Nenhum livro encontrado.
            </Typography>
          )}

          {/* Componente do Material para navegar entre as paginas da lista */}
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
        </>
      )}

      <Snackbar
        open={Boolean(mensagem)}
        autoHideDuration={3000}
        onClose={handleFecharMensagem}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleFecharMensagem} severity={tipoMensagem} sx={{ width: '100%' }}>
          {mensagem}
        </Alert>
      </Snackbar>
    </Container>
  )
}
