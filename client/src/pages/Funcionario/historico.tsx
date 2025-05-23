"use client"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, CheckCircle, Clock, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import chamadoService from "@/shared/services/chamadoService";
import { ChamadoInterface } from "@/shared/types";
import uploadService from "@/shared/services/uploadService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"
import api from "@/shared/axios";

export default function HistoricoChamados() {
  const { admin } = useContext(AuthContext);
  const [chamados, setChamados] = useState<ChamadoInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageDialog, setImageDialog] = useState({
    open: false,
    url: null as string | null
  });
  const [selectedChamado, setSelectedChamado] = useState<ChamadoInterface | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userNames, setUserNames] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchChamadosConcluidos = async () => {
      try {
        setLoading(true);
        if (!admin?.secretaria) return;
        const response = await chamadoService.findBySecretaria({ secretaria: admin?.secretaria });
        const chamadosData = response.data._embedded?.chamadoDTOList || [];
        setChamados(chamadosData);
        
        // Prefetch user names
        const names: Record<number, string> = {};
        await Promise.all(chamadosData.map(async (chamado: ChamadoInterface) => {
          try {
            const chamadoResponse = await chamadoService.findById(chamado.id);
            const userResponse = await api.get(`/api/usuario/${chamadoResponse.data.usuarioId}`);
            names[chamado.id] = userResponse.data.nome;
          } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            names[chamado.id] = "Usuário não encontrado";
          }
        }));
        setUserNames(names);
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

  async function handleOpenImageDialog(filename: string) {
    try {
      const response = await uploadService.getImage(filename);
      const url = URL.createObjectURL(response.data);
      setImageDialog({ open: true, url });
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      setImageDialog({ open: true, url: null });
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "PENDENTE":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="w-3 h-3 mr-1" /> Pendente
          </Badge>
        );
      case "EM ANDAMENTO":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="w-3 h-3 mr-1" /> Em andamento
          </Badge>
        );
      case "CONCLUÍDO":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" /> Concluído
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertTriangle className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
    }
  }

  const handleRowClick = (chamado: ChamadoInterface) => {
    setSelectedChamado(chamado);
    setDialogOpen(true);
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
          <CardTitle>Selecione o chamado para obter o histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead>Foto do Chamado</TableHead>
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
                    <TableRow 
                      key={chamado.id} 
                      onClick={() => handleRowClick(chamado)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">{chamado.titulo}</TableCell>
                      <TableCell>{formatDate(chamado.dataAbertura)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {chamado.fotoAntesUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenImageDialog(chamado.fotoAntesUrl?.split("/").pop() || "");
                            }}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(chamado.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Image Dialog */}
      <Dialog open={imageDialog.open} onOpenChange={(open) => setImageDialog({...imageDialog, open})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Foto do chamado</DialogTitle>
            <DialogDescription>Imagem enviada pelo cidadão</DialogDescription>
          </DialogHeader>
          {imageDialog.url ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <img
                src={imageDialog.url}
                alt="Foto do chamado"
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <p className="text-gray-500">Não foi possível recuperar a imagem.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Histórico Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Histórico do Chamado:</span>
              <span className="truncate max-w-[300px]">{selectedChamado?.titulo}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {selectedChamado && getStatusBadge(selectedChamado.status)}
              <div className="text-sm text-gray-500">
                Aberto em: {selectedChamado && formatDate(selectedChamado.dataAbertura)}
              </div>
              <div className="text-sm text-gray-500">
                Solicitante: {selectedChamado && userNames[selectedChamado.id]}
              </div>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {selectedChamado?.historicos?.length ? (
                  selectedChamado.historicos.map((item, index) => {
                    const [date, time] = item.dataModificacao.split(" ");
                    return (
                      <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4 relative">
                        <div className="absolute w-3 h-3 bg-cyan-600 rounded-full -left-[7px] top-0"></div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {time}
                            <span className="text-gray-400"> (modificado)</span>
                          </div>
                        </div>
                        <p className="font-medium">{item.observacao}</p>
                        <p className="text-sm text-gray-500">
                          Por: {userNames[selectedChamado.id] || "Carregando..."}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Nenhum histórico registrado para este chamado
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}