"use client"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import chamadoService from "@/shared/services/chamadoService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HistoricoChamados() {
  const { admin } = useContext(AuthContext);
  const [chamados, setChamados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChamadosConcluidos = async () => {
      try {
        setLoading(true);
        const response = await chamadoService.findBySecretariaAndStatus({
          secretaria: admin?.secretaria || "",
          status: "CONCLUÍDO"
        });
        setChamados(response.data._embedded?.chamadoDTOList || []);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      } finally {
        setLoading(false);
      }
    };

    if (admin?.secretaria) {
      fetchChamadosConcluidos();
    }
  }, [admin?.secretaria]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Carregando histórico...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Chamados Concluídos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead>Data Conclusão</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chamados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum chamado concluído encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  chamados.map((chamado) => (
                    <TableRow key={chamado.id}>
                      <TableCell className="font-medium">{chamado.titulo}</TableCell>
                      <TableCell>{formatDate(chamado.dataAbertura)}</TableCell>
                      <TableCell>{formatDate(chamado.dataConclusao)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> Concluído
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => navigate("/funcionario/dashboard")}
        >
          Voltar para Chamados
        </Button>
      </div>
    </div>
  );
}