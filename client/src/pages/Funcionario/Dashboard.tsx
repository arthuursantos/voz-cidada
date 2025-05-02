"use client";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import api from "@/shared/axios";
import { AuthContext, JWTClaims } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FuncionarioLayout from "@/shared/FuncionarioLayout";

interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
}

const statusOptions = ["Todos", "Em Análise", "Em Andamento", "Finalizado"];

export default function DashboardFuncionario() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const jwt = token ? jwtDecode<JWTClaims>(token) : null;
  const userId = jwt?.sub;

  useEffect(() => {
    async function fetchChamados() {
      if (!userId) return;
      try {
        const { data } = await api.get<{ _embedded: { chamadoDTOList: Chamado[] } }>(
          `/api/chamado/user/${userId}`,
          { params: { page: 0, size: 100 } }
           );
           const list = Array.isArray(data._embedded.chamadoDTOList)
           ? data._embedded.chamadoDTOList
           : [];        setChamados(list);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      }
    }
    fetchChamados();
  }, [userId]);

  const filtered = chamados
    .filter((c) => c.titulo.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => filter === "Todos" || c.status === filter);

  function getBadgeClasses(status: string) {
    switch (status) {
      case "Em Análise": return "bg-yellow-200 text-yellow-800";
      case "Em Andamento": return "bg-blue-200 text-blue-800";
      case "Finalizado": return "bg-green-200 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  }

  return (
    <FuncionarioLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Pesquisar títulos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <div className="flex gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-2 rounded-md shadow-sm ${filter === opt ? "bg-white text-gray-900" : "bg-gray-100 text-gray-600"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ch) => (
            <Card
              key={ch.id}
              className="cursor-pointer hover:shadow-md"
              onClick={() => navigate(`/funcionario/chamados/${ch.id}`)}
            >
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-medium">{ch.titulo}</h2>
                <FileText className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  {ch.descricao.length > 100 ? `${ch.descricao.slice(0, 100)}...` : ch.descricao}
                </p>
                <Badge className={getBadgeClasses(ch.status)}>{ch.status}</Badge>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">Nenhum chamado encontrado.</p>
          )}
        </div>
      </div>
    </FuncionarioLayout>
  );
}
