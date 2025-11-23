import React, { useEffect, useState } from "react";
import usuarioService from "../../services/usuarioService";
import relatorioService from "../../services/relatorioService";
import { Usuario } from "../../types/Usuario";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const RelatorioSemanal: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    usuarioService.listar().then(setUsuarios);
  }, []);

  const buscarRelatorio = async () => {
    if (!usuarioId || !dataFinal) return;
    setLoading(true);
    const res = await relatorioService.getSemanal(Number(usuarioId), dataFinal);
    setResultado(res);
    setLoading(false);
  };

  const dadosGrafico = resultado
    ? [
        { nome: "Semana", calorias: resultado.totalCaloriasDaSemana }
      ]
    : [];

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-white">
          <h3>Relatório Semanal</h3>
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
              <label className="form-label">Data Final</label>
              <input type="date" className="form-control"
                value={dataFinal}
                onChange={e => setDataFinal(e.target.value)} />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100"
                onClick={buscarRelatorio}>
                Buscar
              </button>
            </div>
          </div>

          {loading && <p>Carregando...</p>}

          {resultado && (
            <>
              <div className="row text-center mb-4">
                <div className="col">
                  <div className="card border-warning shadow-sm">
                    <div className="card-body">
                      <h5>Total da Semana</h5>
                      <h3 className="text-warning">
                        {resultado.totalCaloriasDaSemana.toFixed(1)} kcal
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico */}
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calorias" stroke="#1976d2" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatorioSemanal;
