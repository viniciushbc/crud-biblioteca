import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListaLivros from './pages/listagem'
import CadastroLivro from './pages/cadastro'
import DetalheLivro from './pages/detalhe'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/listar"     element={<ListaLivros />} />
        <Route path="/cadastro"   element={<CadastroLivro />} />
        <Route path="/editar/:id" element={<CadastroLivro />} />
        <Route path="/livro/:id"  element={<DetalheLivro />} />
      </Routes>
    </BrowserRouter>
  )
}