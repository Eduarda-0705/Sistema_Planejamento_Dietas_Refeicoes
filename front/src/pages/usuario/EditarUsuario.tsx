import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';
import { Usuario } from '../../types/Usuario';

const EditarUsuario: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Usuario>({
    nome: '',
    email: '',
    altura: undefined,
    peso: undefined,
    objetivo: '',
  });
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
      const usuario = await usuarioService.buscarPorId(usuarioId);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        altura: usuario.altura,
        peso: usuario.peso,
        objetivo: usuario.objetivo || '',
      });
      setError('');
    } catch (err: any) {
      const mensagemErro = err.response?.data?.message 
        || err.response?.data?.title
        || 'Erro ao carregar usuário. Verifique se a API está rodando.';
      setError(mensagemErro);
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Converter altura e peso para número
    if (name === 'altura' || name === 'peso') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validarFormulario = (): string | null => {
    // Validação de nome
    if (!formData.nome || formData.nome.trim().length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      return 'Email inválido';
    }

    // Validação de altura (opcional)
    if (formData.altura !== undefined && (formData.altura <= 0 || formData.altura > 3)) {
      return 'Altura deve estar entre 0 e 3 metros';
    }

    // Validação de peso (opcional)
    if (formData.peso !== undefined && (formData.peso <= 0 || formData.peso > 500)) {
      return 'Peso deve estar entre 0 e 500 kg';
    }

    // Validação de objetivo (opcional)
    if (formData.objetivo && formData.objetivo.trim().length < 5) {
      return 'Objetivo deve ter pelo menos 5 caracteres';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulário
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setError(erroValidacao);
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await usuarioService.atualizar(Number(id), formData);
      
      setSuccess('Usuário atualizado com sucesso!');
      
      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        navigate('/usuarios');
      }, 1500);
    } catch (err: any) {
      const mensagemErro = err.response?.data?.message 
        || err.response?.data?.title
        || err.response?.data
        
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

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Editar Usuário</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Erro!</strong> {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError('')}
                  ></button>
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

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">
                    Nome *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    minLength={3}
                    placeholder="Digite o nome completo"
                  />
                  <small className="form-text text-muted">Mínimo 3 caracteres</small>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="exemplo@email.com"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="altura" className="form-label">
                      Altura (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="altura"
                      name="altura"
                      value={formData.altura || ''}
                      onChange={handleChange}
                      placeholder="Ex: 1.75"
                      min="0"
                      max="3"
                    />
                    <small className="form-text text-muted">Em metros (ex: 1.75)</small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="peso" className="form-label">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      id="peso"
                      name="peso"
                      value={formData.peso || ''}
                      onChange={handleChange}
                      placeholder="Ex: 70.5"
                      min="0"
                      max="500"
                    />
                    <small className="form-text text-muted">Em quilogramas</small>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="objetivo" className="form-label">
                    Objetivo
                  </label>
                  <textarea
                    className="form-control"
                    id="objetivo"
                    name="objetivo"
                    value={formData.objetivo || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ex: Perder peso, ganhar massa muscular, manter saúde..."
                  />
                  <small className="form-text text-muted">Descreva seu objetivo (opcional)</small>
                </div>

                <div className="alert alert-info">
                  <small>
                    <strong>Nota:</strong> A senha não pode ser alterada por esta tela.
                  </small>
                </div>

                <div className="d-flex justify-content-between">
                  <Link to="/usuarios" className="btn btn-secondary">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarUsuario;
