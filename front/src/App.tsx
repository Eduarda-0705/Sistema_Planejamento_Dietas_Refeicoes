import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListarUsuarios from './pages/usuario/ListarUsuarios';
import CadastrarUsuario from './pages/usuario/CadastrarUsuario';
import EditarUsuario from './pages/usuario/EditarUsuario';
import ExcluirUsuario from './pages/usuario/ExcluirUsuario';
import ListarAlimentos from './pages/usuario/alimento/ListarAlimento';

function App() {
  return (
    <Router>
      <div className="min-vh-100">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Sistema de Planejamento de Dietas e Refeições
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
  <Link className="nav-link" to="/alimentos">Alimentos</Link>
</li>

              </ul>
            </div>
          </div>
        </nav>

        {/* Rotas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<ListarUsuarios />} />
          <Route path="/usuarios/cadastrar" element={<CadastrarUsuario />} />
          <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
          <Route path="/usuarios/excluir/:id" element={<ExcluirUsuario />} />
          <Route path="/alimentos" element={<ListarAlimentos/>} />
        </Routes>
      </div>
    </Router>
  );
}

// Componente Home
const Home: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Bem-vindo!</h1>
        <p className="lead">
          Sistema de Planejamento de Dietas e Refeições
        </p>
        <hr className="my-4" />
        <p>Gerencie usuários, dietas e refeições de forma eficiente.</p>
        <Link className="btn btn-primary btn-lg" to="/usuarios" role="button">
          Gerenciar Usuários
        </Link>
    
       <p className="mt-4">
  Deseja explorar a nossa base de alimentos?
  <Link
    to="/alimentos"
    className="btn btn-sm btn-success ms-3"
  >
    Clique aqui
  </Link>
        </p>
      </div>
    </div>
  );
};

export default App;
