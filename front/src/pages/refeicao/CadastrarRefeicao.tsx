import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';
import alimentoService from '../../services/alimentoService';
import refeicaoService from '../../services/refeicaoService';
import { Usuario } from '../../types/Usuario';
import Alimento from '../../types/Alimento';
import { RefeicaoAlimento } from '../../types/Refeicao';

const CadastrarRefeicao: React.FC = () => {
  const navigate = useNavigate();

  // Dados para popular os selects
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);
  const [listaAlimentos, setListaAlimentos] = useState<Alimento[]>([]);

  // Estados do Formulário Principal
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [nomeRefeicao, setNomeRefeicao] = useState('');
  const [dataRefeicao, setDataRefeicao] = useState(''); // Formato datetime-local
  const [descricao, setDescricao] = useState('');

  // Estados para Adicionar Item (Alimento)
  const [alimentoSelecionadoId, setAlimentoSelecionadoId] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(0);
  
  // O "Carrinho" de alimentos da refeição
  const [itensRefeicao, setItensRefeicao] = useState<RefeicaoAlimento[]>([]);

  // Estados de controle (feedback)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar Usuários e Alimentos ao iniciar
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const usuarios = await usuarioService.listar();
        const alimentos = await alimentoService.listar();
        setListaUsuarios(usuarios);
        setListaAlimentos(alimentos);
      } catch (err) {
        setError('Erro ao carregar listas de usuários ou alimentos.');
      }
    };
    carregarDadosIniciais();
  }, []);

  // Adicionar alimento à lista temporária
  const handleAdicionarItem = () => {
    if (!alimentoSelecionadoId || quantidade <= 0) {
      alert("Selecione um alimento e uma quantidade válida.");
      return;
    }

    // Encontra o objeto alimento completo para exibir nome na tabela
    const alimentoObj = listaAlimentos.find(a => a.id === Number(alimentoSelecionadoId));

    if (!alimentoObj) return;

    const novoItem: RefeicaoAlimento = {
      alimentoId: Number(alimentoSelecionadoId),
      quantidade: quantidade,
      alimento: alimentoObj // Guardamos o objeto completo apenas para exibição visual
    };

    setItensRefeicao([...itensRefeicao, novoItem]);
    
    // Limpar campos de item
    setAlimentoSelecionadoId('');
    setQuantidade(0);
  };

  // Remover item da lista temporária
  const handleRemoverItem = (index: number) => {
    const novaLista = [...itensRefeicao];
    novaLista.splice(index, 1);
    setItensRefeicao(novaLista);
  };

  // Calcular total de calorias visualmente
  const totalCaloriasEstimado = itensRefeicao.reduce((acc, item) => {
    if (item.alimento) {
      return acc + (item.alimento.caloriasPorPorcao * item.quantidade) / 100;
    }
    return acc;
  }, 0);

  // Salvar Refeição Completa (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioId || !nomeRefeicao || !dataRefeicao) {
      setError("Preencha todos os campos obrigatórios da refeição.");
      return;
    }

    if (itensRefeicao.length === 0) {
      setError("Adicione pelo menos um alimento à refeição.");
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Montar objeto conforme esperado pelo Backend
      const payload = {
        usuarioId: Number(usuarioId),
        nome: nomeRefeicao,
        descricao: descricao,
        dataRefeicao: dataRefeicao, // O backend aceita ISO String do input datetime-local
        refeicaoAlimentos: itensRefeicao.map(item => ({
            alimentoId: item.alimentoId,
            quantidade: item.quantidade
        }))
      };

      await refeicaoService.criar(payload as any);

      setSuccess('Refeição cadastrada com sucesso!');
      
      setTimeout(() => {
        navigate('/refeicoes');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Erro ao salvar refeição.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Nova Refeição</h3>
            </div>
            <div className="card-body">
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                
                {/* SEÇÃO 1: DADOS GERAIS DA REFEIÇÃO */}
                <h5 className="mb-3 text-secondary border-bottom pb-2">1. Informações Gerais</h5>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Quem vai comer? *</label>
                        <select 
                            className="form-select" 
                            value={usuarioId}
                            onChange={e => setUsuarioId(e.target.value)}
                            required
                        >
                            <option value="">Selecione...</option>
                            {listaUsuarios.map(u => (
                                <option key={u.id} value={u.id}>{u.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Data e Hora *</label>
                        <input 
                            type="datetime-local" 
                            className="form-control"
                            value={dataRefeicao}
                            onChange={e => setDataRefeicao(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Nome da Refeição *</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: Almoço de Domingo, Lanche da Tarde..." 
                        value={nomeRefeicao}
                        onChange={e => setNomeRefeicao(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Observações (Opcional)</label>
                    <textarea 
                        className="form-control" 
                        rows={2}
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                    ></textarea>
                </div>

                {/* SEÇÃO 2: ADICIONAR ALIMENTOS */}
                <h5 className="mb-3 text-secondary border-bottom pb-2">2. O que tem no prato?</h5>
                
                <div className="card bg-light mb-3">
                    <div className="card-body">
                        <div className="row align-items-end">
                            <div className="col-md-6">
                                <label className="form-label">Alimento</label>
                                <select 
                                    className="form-select"
                                    value={alimentoSelecionadoId}
                                    onChange={e => setAlimentoSelecionadoId(e.target.value)}
                                >
                                    <option value="">Escolha um alimento...</option>
                                    {listaAlimentos.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.nome} ({a.caloriasPorPorcao} kcal / {a.unidade})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Quantidade</label>
                                <input 
                                    type="number" 
                                    className="form-control"
                                    placeholder="g ou ml"
                                    min="1"
                                    value={quantidade > 0 ? quantidade : ''}
                                    onChange={e => setQuantidade(Number(e.target.value))}
                                />
                            </div>
                            <div className="col-md-3">
                                <button 
                                    type="button" 
                                    className="btn btn-success w-100"
                                    onClick={handleAdicionarItem}
                                >
                                    + Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABELA DE ITENS ADICIONADOS */}
                {itensRefeicao.length > 0 ? (
                    <div className="table-responsive mb-3">
                        <table className="table table-striped table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Alimento</th>
                                    <th>Qtd</th>
                                    <th>Unidade</th>
                                    <th>Calorias (aprox.)</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itensRefeicao.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.alimento?.nome}</td>
                                        <td>{item.quantidade}</td>
                                        <td>{item.alimento?.unidade}</td>
                                        <td>
                                            {((item.alimento!.caloriasPorPorcao * item.quantidade) / 100).toFixed(1)} kcal
                                        </td>
                                        <td>
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleRemoverItem(index)}
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-dark">
                                <tr>
                                    <td colSpan={3} className="text-end"><strong>Total Calorias:</strong></td>
                                    <td colSpan={2}><strong>{totalCaloriasEstimado.toFixed(1)} kcal</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : (
                    <div className="alert alert-warning text-center">
                        Nenhum alimento adicionado ainda.
                    </div>
                )}

                {/* BOTÕES FINAIS */}
                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                    <Link to="/refeicoes" className="btn btn-secondary">
                        Voltar
                    </Link>
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Refeição Completa'}
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

export default CadastrarRefeicao;