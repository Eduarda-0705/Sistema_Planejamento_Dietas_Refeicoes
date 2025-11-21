import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';
import { Usuario } from '../../types/Usuario';

const ListarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.listar();
      setUsuarios(data);
      setError('');
    } catch (err: any) {
      const mensagemErro = err.response?.data?.message 
        || err.response?.data?.title
    ;
      setError(mensagemErro);
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-5"><h3>Carregando...</h3></div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Usuários</h2>
        <Link to="/usuarios/cadastrar" className="btn btn-primary">
          + Novo Usuário
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {usuarios.length === 0 ? (
        <div className="alert alert-info">
          Nenhum usuário cadastrado. Clique em "Novo Usuário" para começar.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Altura</th>
                <th>Peso</th>
                <th>Objetivo</th>
                <th>Data Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.altura ? `${usuario.altura} m` : '-'}</td>
                  <td>{usuario.peso ? `${usuario.peso} kg` : '-'}</td>
                  <td>
                    {usuario.objetivo ? (
                      <span title={usuario.objetivo}>
                        {usuario.objetivo.length > 30
                          ? `${usuario.objetivo.substring(0, 30)}...`
                          : usuario.objetivo}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {usuario.dataCadastro
                      ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td>
                    <Link
                      to={`/usuarios/editar/${usuario.id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/usuarios/excluir/${usuario.id}`}
                      className="btn btn-sm btn-danger"
                    >
                      Excluir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarUsuarios;
