"use client";

import { useContext, useEffect, useState } from "react";
import api from "@/shared/axios";
import { AuthContext, JWTClaims } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import FuncionarioLayout from "@/shared/FuncionarioLayout";

interface Historico {
  id: number;
  chamadoId: number;
  funcionarioId: string;
  dataModificacao: string;
  statusAnterior: string;
  statusNovo: string;
  observacao?: string;
}

export default function HistoricoFuncionario() {
  const { token } = useContext(AuthContext);
  const [historicos, setHistoricos] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);

  const jwt = token ? jwtDecode<JWTClaims>(token) : null;
  const funcionarioId = jwt?.sub;

  useEffect(() => {
    async function fetchHistorico() {
      if (!funcionarioId) return;
      try {
        // não há filtro no back, pega tudo e filtra aqui
        const { data } = await api.get<{ _embedded: { historicoList: Historico[] } }>(
          `/api/historico`,
          { params: { page: 0, size: 100 } }
        );
        const all = Array.isArray(data._embedded.historicoList)
          ? data._embedded.historicoList
          : [];
        const list = all.filter(h => h.funcionarioId === funcionarioId);
        list.sort((a, b) => new Date(b.dataModificacao).getTime() - new Date(a.dataModificacao).getTime());
        setHistoricos(list);
      } catch (error) {
        console.error("Erro ao buscar histórico de chamados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistorico();
  }, [funcionarioId]);

  if (loading) {
    return <p className="p-6">Carregando histórico...</p>;
  }

  return (
    <FuncionarioLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Histórico de Devolutivas</h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left font-medium">ID</th>
                <th className="p-3 text-left font-medium">Chamado</th>
                <th className="p-3 text-left font-medium">Data</th>
                <th className="p-3 text-left font-medium">De</th>
                <th className="p-3 text-left font-medium">Para</th>
                <th className="p-3 text-left font-medium">Observação</th>
              </tr>
            </thead>
            <tbody>
              {historicos.map((h, idx) => (
                <tr key={h.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3">{h.id}</td>
                  <td className="p-3">{h.chamadoId}</td>
                  <td className="p-3">{new Date(h.dataModificacao).toLocaleString()}</td>
                  <td className="p-3">{h.statusAnterior}</td>
                  <td className="p-3">{h.statusNovo}</td>
                  <td className="p-3">{h.observacao || "—"}</td>
                </tr>
              ))}
              {historicos.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">Nenhuma devolutiva registrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FuncionarioLayout>
  );
}
