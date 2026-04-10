import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Box } from '@mui/material'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <Box component="header" sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
        <Typography variant="h4">Biblioteca</Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 250 }}>
          <Button variant="outlined" size="large" onClick={() => navigate('/listar')}>Lista de Livros</Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/cadastro')}>Cadastrar Livro</Button>
        </Box>
      </Box>

      <Box component="footer" sx={{ p: 2, borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <Typography variant="body2">Vinícius Henrique Budag Coelho</Typography>
      </Box>

    </Box>
  )
}