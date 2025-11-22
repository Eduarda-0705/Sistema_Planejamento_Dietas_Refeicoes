import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';
import refeicaoService from '../../services/refeicaoService';
import { Usuario } from '../../types/Usuario';
import { Refeicao } from '../../types/Refeicao';

const ListarRefeicoes: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string>('');
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carrega a lista de usuários para o dropdown
  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const data = await usuarioService.listar();
        setUsuarios(data);
      } catch (err) {
        setError('Erro ao carregar lista de usuários.');
      }
    };
    carregarUsuarios();
  }, []);

  // Busca as refeições sempre que trocar o usuário
  useEffect(() => {
    if (usuarioSelecionado) {
      carregarRefeicoes(Number(usuarioSelecionado));
    } else {
      setRefeicoes([]);
    }
  }, [usuarioSelecionado]);

  const carregarRefeicoes = async (id: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await refeicaoService.listarPorUsuario(id);
      setRefeicoes(data);
    } catch (err: any) {
      setError('Erro ao buscar refeições. Verifique se o usuário possui registros.');
      setRefeicoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta refeição?')) {
      try {
        await refeicaoService.deletar(id);
        // Recarrega a lista
        if (usuarioSelecionado) carregarRefeicoes(Number(usuarioSelecionado));
      } catch (err) {
        alert('Erro ao excluir refeição.');
      }
    }
  };

  // Função auxiliar para calcular calorias totais da refeição no front (visualização rápida)
  const calcularTotalCalorias = (refeicao: Refeicao) => {
    return refeicao.refeicaoAlimentos.reduce((total, item) => {
      const cals = item.alimento ? item.alimento.caloriasPorPorcao : 0;
      // Regra de 3 baseada em porção de 100g/ml (padrão do banco)
      return total + (cals * item.quantidade) / 100;
    }, 0);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Histórico de Refeições</h2>
        <Link to="/refeicoes/cadastrar" className="btn btn-primary">
          + Nova Refeição
        </Link>
      </div>

      {/* Filtro de Usuário */}
      <div className="card mb-4">
        <div className="card-body">
            <label htmlFor="selectUsuario" className="form-label fw-bold">Selecione um Usuário para ver as refeições:</label>
            <select 
                id="selectUsuario"
                className="form-select" 
                value={usuarioSelecionado} 
                onChange={(e) => setUsuarioSelecionado(e.target.value)}
            >
                <option value="">-- Selecione --</option>
                {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
            </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && <div className="text-center">Carregando refeições...</div>}

      {!loading && usuarioSelecionado && refeicoes.length === 0 && (
          <div className="alert alert-info">Este usuário ainda não possui refeições cadastradas.</div>
      )}

      {/* Lista de Refeições (Accordion) */}
      <div className="accordion" id="accordionRefeicoes">
        {refeicoes.map((refeicao, index) => (
          <div className="accordion-item" key={refeicao.id}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button 
                className="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#collapse${index}`} 
                aria-expanded="false" 
                aria-controls={`collapse${index}`}
              >
                <div className="d-flex w-100 justify-content-between me-3">
                    <span>
                        <strong>{new Date(refeicao.dataRefeicao).toLocaleDateString('pt-BR')}</strong> - {refeicao.nome}
                    </span>
                    <span className="badge bg-success rounded-pill">
                        {calcularTotalCalorias(refeicao).toFixed(0)} kcal
                    </span>
                </div>
              </button>
            </h2>
            <div 
                id={`collapse${index}`} 
                className="accordion-collapse collapse" 
                aria-labelledby={`heading${index}`} 
                data-bs-parent="#accordionRefeicoes"
            >
              <div className="accordion-body">
                <p className="text-muted mb-2">Obs: {refeicao.descricao || 'Sem observações'}</p>
                
                <table className="table table-sm table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Alimento</th>
                            <th>Qtd</th>
                            <th>Unidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refeicao.refeicaoAlimentos.map((item, i) => (
                            <tr key={i}>
                                <td>{item.alimento?.nome || 'Carregando...'}</td>
                                <td>{item.quantidade}</td>
                                <td>{item.alimento?.unidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="d-flex justify-content-end">
                    <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => refeicao.id && handleDelete(refeicao.id)}
                    >
                        Excluir Refeição
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarRefeicoes;