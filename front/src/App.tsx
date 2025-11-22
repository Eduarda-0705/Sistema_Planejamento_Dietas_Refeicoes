import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importações de Usuário (Pessoa 1)
import ListarUsuarios from './pages/usuario/ListarUsuarios';
import CadastrarUsuario from './pages/usuario/CadastrarUsuario';
import EditarUsuario from './pages/usuario/EditarUsuario';
import ExcluirUsuario from './pages/usuario/ExcluirUsuario';

// Importação de Alimento (Pessoa 2)
import ListarAlimentos from './pages/usuario/alimento/ListarAlimento';

// Importações de Refeição (Pessoa 3)
import ListarRefeicoes from './pages/refeicao/ListarRefeicoes';
import CadastrarRefeicao from './pages/refeicao/CadastrarRefeicao';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold" to="/">
              🍎 PlanejaDietas
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/usuarios">
                    Usuários
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/alimentos">
                    Alimentos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold" to="/refeicoes">
                    Refeições
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Rotas */}
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Rotas de Usuários */}
          <Route path="/usuarios" element={<ListarUsuarios />} />
          <Route path="/usuarios/cadastrar" element={<CadastrarUsuario />} />
          <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
          <Route path="/usuarios/excluir/:id" element={<ExcluirUsuario />} />
          
          {/* Rota de Alimentos (Restaurada) */}
          <Route path="/alimentos" element={<ListarAlimentos/>} />

          {/* Rotas de Refeições */}
          <Route path="/refeicoes" element={<ListarRefeicoes />} />
          <Route path="/refeicoes/cadastrar" element={<CadastrarRefeicao />} />
        </Routes>
      </div>
    </Router>
  );
}

// Componente Home
const Home: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="p-5 mb-4 bg-white rounded-3 shadow-sm border">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Sistema de Dietas</h1>
          <p className="col-md-8 fs-4">
            Gerencie sua alimentação, controle calorias e alcance seus objetivos de forma simples e organizada.
          </p>
          
          <hr className="my-4" />

          {/* Botões de Ação */}
          <div className="d-flex flex-wrap gap-3 mt-4">
            {/* Botão Usuários */}
            <Link className="btn btn-primary btn-lg" to="/usuarios">
              Gerenciar Usuários
            </Link>

            {/* Botão Refeições (Novo) */}
            <Link className="btn btn-outline-primary btn-lg" to="/refeicoes">
              Registrar Refeição
            </Link>
          </div>

          {/* Seção de Alimentos (Restaurada e destacada) */}
          <div className="mt-4 pt-3">
             <p className="lead fs-6 mb-2">Deseja consultar a tabela nutricional?</p>
             <Link className="btn btn-success" to="/alimentos">
                🥕 Explorar Base de Alimentos
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;