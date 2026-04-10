import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material'

export default function DetalheLivro() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [livro, setLivro] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregarLivro = async () => {
      try {
        setCarregando(true)
        setErro('')

        const res = await fetch(`http://localhost:3000/livros/${id}`)

        if (!res.ok) {
          const erroApi = await res.json()
          throw new Error(erroApi.mensagem || 'Nao foi possivel carregar os detalhes do livro.')
        }

        const data = await res.json()

        if (!data) {
          throw new Error('Livro nao encontrado.')
        }

        setLivro(data)
      } catch (error) {
        setErro(error.message || 'Erro ao carregar o livro.')
      } finally {
        setCarregando(false)
      }
    }

    carregarLivro()
  }, [id])

  const handleExcluir = async () => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este livro?')

    if (!confirmar) {
      return
    }

    try {
      setErro('')

      const res = await fetch(`http://localhost:3000/livros/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const erroApi = await res.json()
        throw new Error(erroApi.mensagem || 'Nao foi possivel excluir o livro.')
      }

      navigate('/listar', {
        state: {
          mensagem: 'Livro excluido com sucesso.',
          tipo: 'success'
        }
      })
    } catch (error) {
      setErro(error.message || 'Erro ao excluir o livro.')
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Detalhe do Livro</Typography>

      {erro && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {erro}
        </Alert>
      )}

      {carregando ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Carregando livro...
        </Alert>
      ) : (
        <>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography><strong>Titulo:</strong> {livro?.titulo}</Typography>
            <Typography><strong>Autor:</strong> {livro?.autor}</Typography>
            <Typography><strong>Ano:</strong> {livro?.ano}</Typography>
            <Typography><strong>Editora:</strong> {livro?.editora}</Typography>
            <Typography><strong>Genero:</strong> {livro?.genero}</Typography>
            <Typography><strong>Paginas:</strong> {livro?.paginas}</Typography>
            <Typography><strong>Quantidade em estoque:</strong> {livro?.quantidade}</Typography>
            <Typography><strong>Sinopse:</strong> {livro?.sinopse}</Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" onClick={() => navigate(`/editar/${id}`)}>Editar</Button>
            <Button sx={{ ml: 2 }} color="error" onClick={handleExcluir}>Excluir</Button>
            <Button sx={{ ml: 2 }} onClick={() => navigate('/')}>Voltar</Button>
          </Box>
        </>
      )}

      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2">Vinicius Henrique Budag Coelho</Typography>
      </Box>
    </Container>
  )
}
