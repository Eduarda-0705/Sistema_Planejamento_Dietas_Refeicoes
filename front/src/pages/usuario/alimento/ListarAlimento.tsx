import React, { useEffect, useState } from "react";
import alimentoService from "../../../services/alimentoService";
import Alimento from "../../../Alimento";

const ListarAlimentos: React.FC = () => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarAlimentos();
  }, []);

  const carregarAlimentos = async () => {
    try {
      setLoading(true);
      const data = await alimentoService.listar();
      setAlimentos(data);
      setErro("");
    } catch (err: any) {
      setErro("Erro ao carregar alimentos");
    } finally {
      setLoading(false);
    }
  };

  const tiposDisponiveis = Array.from(new Set(alimentos.map(a => a.tipo)));
  
  const alimentosFiltrados = alimentos.filter((a) => {
    const combinaBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
    const combinaTipo = tipoFiltro ? a.tipo === tipoFiltro : true;
    

    return combinaBusca && combinaTipo;
  });

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Carregando...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Alimentos</h2>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {/* Busca + Filtro */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="form-control"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

       <div className="col-md-4">
  <select
    className="form-control"
    value={tipoFiltro}
    onChange={(e) => setTipoFiltro(e.target.value)}
  >
    <option value="">Todos os tipos</option>

    {tiposDisponiveis.map((t) => (
      <option key={t} value={t}>
        {t}
      </option>
    ))}
  </select>
</div>
      </div>

      {/* Tabela */}
      {alimentosFiltrados.length === 0 ? (
        <div className="alert alert-info">Nenhum alimento encontrado.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Unidade</th>
                <th>Calorias</th>
              </tr>
            </thead>
            <tbody>
              {alimentosFiltrados.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.nome}</td>
                  <td>{a.tipo}</td>
                  <td>{a.unidade}</td>
                  <td>{a.caloriasPorPorcao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarAlimentos;
