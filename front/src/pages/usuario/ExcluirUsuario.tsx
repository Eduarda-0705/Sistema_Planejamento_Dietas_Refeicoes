import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';
import { Usuario } from '../../types/Usuario';

const ExcluirUsuario: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (id) {
      carregarUsuario(Number(id));
    }
  }, [id]);

  const carregarUsuario = async (usuarioId: number) => {
    try {
      setLoadingData(true);
      const data = await usuarioService.buscarPorId(usuarioId);
      setUsuario(data);
      setError('');
    } catch (err: any) {
      const mensagemErro =
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Erro ao carregar usuário.';

      setError(mensagemErro);
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleExcluir = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await usuarioService.deletar(Number(id));

      setSuccess('Usuário excluído com sucesso!');

      setTimeout(() => {
        navigate('/usuarios');
      }, 1500);
    } catch (err: any) {
      const mensagemErro =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data;

      setError(typeof mensagemErro === 'string' ? mensagemErro : JSON.stringify(mensagemErro));
      setSuccess('');
      console.error('Erro completo:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mt-5">
        <h3>Carregando...</h3>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Usuário não encontrado.</div>
        <Link to="/usuarios" className="btn btn-secondary">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h3>Excluir Usuário</h3>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Erro!</strong> {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Sucesso!</strong> {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess('')}
                  ></button>
                </div>
              )}

              <div className="alert alert-warning">
                <strong>Atenção!</strong> Esta ação não pode ser desfeita.
              </div>

              <p>Tem certeza que deseja excluir o seguinte usuário?</p>

              <div className="card mb-3">
                <div className="card-body">
                  <p>
                    <strong>ID:</strong> {usuario.id}
                  </p>
                  <p>
                    <strong>Nome:</strong> {usuario.nome}
                  </p>
                  <p>
                    <strong>Email:</strong> {usuario.email}
                  </p>

                  {usuario.altura && (
                    <p>
                      <strong>Altura:</strong> {usuario.altura} m
                    </p>
                  )}

                  {usuario.peso && (
                    <p>
                      <strong>Peso:</strong> {usuario.peso} kg
                    </p>
                  )}

                  {usuario.objetivo && (
                    <p>
                      <strong>Objetivo:</strong> {usuario.objetivo}
                    </p>
                  )}

                  {usuario.dataCadastro && (
                    <p>
                      <strong>Data de Cadastro:</strong>{' '}
                      {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <Link to="/usuarios" className="btn btn-secondary">
                  Cancelar
                </Link>

                <button
                  onClick={handleExcluir}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcluirUsuario;
