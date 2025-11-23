import React, { useEffect, useState } from "react";
import usuarioService from "../../services/usuarioService";
import relatorioService from "../../services/relatorioService";
import { Usuario } from "../../types/Usuario";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const RelatorioDiario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [data, setData] = useState("");

  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const carregarUsuarios = async () => {
    const lista = await usuarioService.listar();
    setUsuarios(lista);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const buscarRelatorio = async () => {
    if (!usuarioId || !data) return;

    setLoading(true);
    const res = await relatorioService.getDiario(Number(usuarioId), data);
    setResultado(res);
    setLoading(false);
  };

  const dadosGrafico = resultado
    ? [{ nome: "Calorias", valor: resultado.totalCaloriasDoDia }]
    : [];

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h3 className="mb-0">Relatório Diário</h3>
        </div>

        <div className="card-body">

          {/* Filtros */}
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label">Usuário</label>
              <select className="form-select"
                value={usuarioId}
                onChange={e => setUsuarioId(e.target.value)}>
                <option value="">Selecione...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Data</label>
              <input type="date" className="form-control"
                value={data}
                onChange={e => setData(e.target.value)} />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100"
                onClick={buscarRelatorio}>
                Buscar
              </button>
            </div>
          </div>

          {/* Resultado */}
          {loading && <p>Carregando...</p>}

          {resultado && (
            <>
              <div className="row text-center mb-4">
                <div className="col">
                  <div className="card border-primary shadow-sm">
                    <div className="card-body">
                      <h5>Total do Dia</h5>
                      <h3 className="text-primary">
                        {resultado.totalCaloriasDoDia.toFixed(1)} kcal
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico */}
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default RelatorioDiario;
