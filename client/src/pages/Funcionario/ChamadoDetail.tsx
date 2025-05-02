"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/shared/axios";
import { AuthContext, JWTClaims } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FuncionarioLayout from "@/shared/FuncionarioLayout";

const statusSchema = z.object({
  status: z.enum(["Em Análise", "Em Andamento", "Finalizado"]),
  observacao: z.string().max(255, "Máximo de 255 caracteres").optional(),
});

type StatusFormData = z.infer<typeof statusSchema>;

interface ChamadoDetail {
  id: number;
  titulo: string;
  descricao: string;
  dataAbertura: string;
  latitude?: number;
  longitude?: number;
  fotoAntesUrl?: string;
  fotoDepoisUrl?: string;
  funcionarioId?: string;
  status: string;
}

export default function ChamadoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [chamado, setChamado] = useState<ChamadoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const jwt = token ? jwtDecode<JWTClaims>(token) : null;
  const funcionarioId = jwt?.sub;

  const { register, handleSubmit, formState: { errors } } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: "Em Análise", observacao: "" },
  });

  const fetchChamado = async () => {
    if (!id) return;
    try {
      const { data } = await api.get<ChamadoDetail>(`/api/chamado/${id}`);
      setChamado(data);
    } catch (error) {
      console.error("Erro ao buscar detalhe do chamado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChamado(); }, [id]);

  const handleAssign = async () => {
    if (!funcionarioId) return;
    setAssigning(true);
    try {
      await api.put("/api/chamado", { ...chamado!, funcionarioId });
      await fetchChamado();
    } catch (error) {
      console.error("Erro ao atribuir chamado:", error);
    } finally {
      setAssigning(false);
    }
  };

  const onSubmit = async (form: StatusFormData) => {
    if (!chamado || !funcionarioId) return;
    try {
      await api.put("/api/chamado", { ...chamado, status: form.status });
      await api.post(`/api/historico`, {
        funcionarioId,
        chamadoId: chamado.id,
        statusAnterior: chamado.status,
        statusNovo: form.status,
        observacao: form.observacao,
      });
      navigate("/funcionario/dashboard");
    } catch (error) {
      console.error("Erro ao salvar devolutiva:", error);
    }
  };

  if (loading) return <p className="p-6">Carregando detalhes...</p>;
  if (!chamado) return <p className="p-6 text-red-500">Chamado não encontrado.</p>;

  const isAssignedToMe = chamado.funcionarioId === funcionarioId;

  return (
    <FuncionarioLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">{chamado.titulo}</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{chamado.descricao}</p>
            <p className="text-sm text-gray-600">
              Aberto em: {new Date(chamado.dataAbertura).toLocaleString()}
            </p>
            {chamado.latitude && chamado.longitude && (
              <a
                href={`https://www.google.com/maps?q=${chamado.latitude},${chamado.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Ver localização
              </a>
            )}
            <div className="grid grid-cols-2 gap-4">
              {chamado.fotoAntesUrl && <img src={chamado.fotoAntesUrl} alt="Antes" className="rounded-md w-full" />}
              {chamado.fotoDepoisUrl && <img src={chamado.fotoDepoisUrl} alt="Depois" className="rounded-md w-full" />}
            </div>
          </CardContent>
        </Card>

        {!isAssignedToMe ? (
          <div className="text-center">
            <Button onClick={handleAssign} disabled={assigning} className="mt-4">
              {assigning ? "Atribuindo..." : "Pegar Chamado"}
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-medium">Devolutiva</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select {...register("status")} className="w-full p-2 border rounded-md">
                    <option value="Em Análise">Em Análise</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Observação</label>
                  <textarea {...register("observacao")} rows={4} className="w-full p-2 border rounded-md" />
                  {errors.observacao && <p className="text-red-500 text-sm mt-1">{errors.observacao.message}</p>}
                </div>

                <Button type="submit">Salvar</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </FuncionarioLayout>
  );
}