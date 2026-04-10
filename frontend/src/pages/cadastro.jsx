import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material'

function validarFormulario(form) {
  const erros = {}
  const anoAtual = new Date().getFullYear()
  const ano = Number(form.ano)
  const paginas = Number(form.paginas)
  const quantidade = Number(form.quantidade)

  if (!form.titulo.trim()) {
    erros.titulo = 'Informe o titulo do livro.'
  }

  if (!form.autor.trim()) {
    erros.autor = 'Informe o autor.'
  }

  if (!Number.isInteger(ano) || ano <= 0 || ano > anoAtual) {
    erros.ano = 'Informe um ano valido.'
  }

  if (!form.editora.trim()) {
    erros.editora = 'Informe a editora.'
  }

  if (!form.genero.trim()) {
    erros.genero = 'Informe o genero.'
  }

  if (!Number.isInteger(paginas) || paginas <= 0) {
    erros.paginas = 'As paginas devem ser maiores que zero.'
  }

  if (!Number.isInteger(quantidade) || quantidade < 0) {
    erros.quantidade = 'A quantidade nao pode ser negativa.'
  }

  if (!form.sinopse.trim()) {
    erros.sinopse = 'Informe a sinopse.'
  }

  return erros
}

async function lerRespostaErro(res, mensagemPadrao) {
  try {
    const erroApi = await res.json()

    return {
      mensagem: erroApi.mensagem || mensagemPadrao,
      erros: Array.isArray(erroApi.erros) ? erroApi.erros : []
    }
  } catch {
    return {
      mensagem: mensagemPadrao,
      erros: []
    }
  }
}

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
  const [mensagensErro, setMensagensErro] = useState([])
  const [errosCampos, setErrosCampos] = useState({})
  const [carregando, setCarregando] = useState(false)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    const carregarLivro = async () => {
      try {
        setCarregando(true)
        setMensagensErro([])

        const res = await fetch(`http://localhost:3000/livros/${id}`)

        if (!res.ok) {
          const erroApi = await lerRespostaErro(res, 'Nao foi possivel carregar o livro para edicao.')
          throw new Error(erroApi.mensagem)
        }

        const data = await res.json()

        if (!data) {
          throw new Error('Livro nao encontrado.')
        }

        setForm({
          titulo: data.titulo || '',
          autor: data.autor || '',
          ano: data.ano || '',
          editora: data.editora || '',
          genero: data.genero || '',
          paginas: data.paginas || '',
          quantidade: data.quantidade || '',
          sinopse: data.sinopse || ''
        })
      } catch (error) {
        setMensagensErro([error.message || 'Erro ao carregar o livro.'])
      } finally {
        setCarregando(false)
      }
    }

    carregarLivro()
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target

    setForm({ ...form, [name]: value })
    setErrosCampos(prev => ({ ...prev, [name]: '' }))
    setMensagensErro([])
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const errosFormulario = validarFormulario(form)

    if (Object.keys(errosFormulario).length > 0) {
      setErrosCampos(errosFormulario)
      setMensagensErro(['Corrija os campos destacados antes de salvar.'])
      return
    }

    const url = id ? `http://localhost:3000/livros/${id}` : 'http://localhost:3000/livros'
    const method = id ? 'PUT' : 'POST'
    const mensagemSucesso = id
      ? 'Livro atualizado com sucesso.'
      : 'Livro cadastrado com sucesso.'

    try {
      setMensagensErro([])
      setErrosCampos({})
      setSalvando(true)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const erroApi = await lerRespostaErro(
          res,
          id ? 'Nao foi possivel atualizar o livro.' : 'Nao foi possivel cadastrar o livro.'
        )

        setMensagensErro(
          erroApi.erros.length > 0 ? erroApi.erros : [erroApi.mensagem]
        )
        return
      }

      navigate('/listar', {
        state: {
          mensagem: mensagemSucesso,
          tipo: 'success'
        }
      })
    } catch (error) {
      setMensagensErro([error.message || 'Erro ao salvar o livro.'])
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">{id ? 'Editar Livro' : 'Cadastrar Livro'}</Typography>

      {mensagensErro.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Confira os dados</AlertTitle>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {mensagensErro.map(mensagem => (
              <Box component="li" key={mensagem}>
                {mensagem}
              </Box>
            ))}
          </Box>
        </Alert>
      )}

      {carregando && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Carregando dados do livro...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Titulo"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          error={Boolean(errosCampos.titulo)}
          helperText={errosCampos.titulo}
          required
        />
        <TextField
          label="Autor"
          name="autor"
          value={form.autor}
          onChange={handleChange}
          error={Boolean(errosCampos.autor)}
          helperText={errosCampos.autor}
          required
        />
        <TextField
          label="Ano"
          name="ano"
          value={form.ano}
          onChange={handleChange}
          type="number"
          error={Boolean(errosCampos.ano)}
          helperText={errosCampos.ano}
          required
          inputProps={{ min: 1, max: new Date().getFullYear() }}
        />
        <TextField
          label="Editora"
          name="editora"
          value={form.editora}
          onChange={handleChange}
          error={Boolean(errosCampos.editora)}
          helperText={errosCampos.editora}
          required
        />
        <TextField
          label="Genero"
          name="genero"
          value={form.genero}
          onChange={handleChange}
          error={Boolean(errosCampos.genero)}
          helperText={errosCampos.genero}
          required
        />
        <TextField
          label="Paginas"
          name="paginas"
          value={form.paginas}
          onChange={handleChange}
          type="number"
          error={Boolean(errosCampos.paginas)}
          helperText={errosCampos.paginas}
          required
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Quantidade estoque"
          name="quantidade"
          value={form.quantidade}
          onChange={handleChange}
          type="number"
          error={Boolean(errosCampos.quantidade)}
          helperText={errosCampos.quantidade}
          required
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Sinopse"
          name="sinopse"
          value={form.sinopse}
          onChange={handleChange}
          multiline
          rows={4}
          error={Boolean(errosCampos.sinopse)}
          helperText={errosCampos.sinopse}
          required
        />

        <Box>
          <Button type="submit" variant="contained" disabled={salvando || carregando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button sx={{ ml: 2 }} onClick={() => navigate('/')} disabled={salvando}>
            Cancelar
          </Button>
        </Box>
      </Box>

      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2">Vinicius Henrique Budag Coelho</Typography>
      </Box>
    </Container>
  )
}
