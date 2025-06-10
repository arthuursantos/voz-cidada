"use client"
import Header from "@/components/header";
import { useContext, useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { ImageIcon, ClipboardList, CheckCircle, Clock, AlertTriangle, Calendar, History, Upload, X } from "lucide-react"
//import authService from "@/shared/services/authService.ts"
import chamadoService from "@/shared/services/chamadoService.ts"
import uploadService from "@/shared/services/uploadService.ts"
import historicoService from "@/pages/Funcionario/historicoService.ts"
import { AuthContext } from "@/contexts/AuthContext.tsx"
import type { ChamadoInterface, HistoricoInterface } from "@/shared/types.ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label.tsx"
import api from "@/shared/axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import HistoricoChamado from "@/components/HistoricoChamado";
import toast from "react-hot-toast";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../Chamados/components/CreateChamadoDialog";

const chamadosInventados: ChamadoInterface[] = [
  {
    id: 1,
    usuarioId: 1,
    titulo: "Problema com a internet",
    descricao: "A internet está muito lenta.",
    secretaria: "URBANISMO",
    dataAbertura: "2023-10-01 10:00:00",
    status: "EM ANDAMENTO",
    latitude: null,
    longitude: null,
    fotoAntesUrl: "https://t2.gstatic.com/images?q=tbn:ANd9GcTBLkUokRWxieS2uNcbZzQXKk8vXCHIF9JAhTcv2AXkfcIv5PhO",
    fotoDepoisUrl: null,
    avaliacao: null,
    historicos: [
      {
        id: 1,
        chamadoId: 1,
        funcionarioId: 1,
        dataModificacao: "2023-10-01 11:00:00",
        observacao: "Chamado aberto.",
        statusAnterior: "PENDENTE",
        statusNovo: "EM ANDAMENTO"
      },
      {
        id: 2,
        chamadoId: 1,
        funcionarioId: 1,
        dataModificacao: "2023-10-02 12:00:00",
        observacao: "Técnico agendado para amanhã.",
        statusAnterior: "EM ANDAMENTO",
        statusNovo: "EM ANDAMENTO"
      }
    ]
  },
  {
    id: 2,
    usuarioId: 1,
    titulo: "Buraco na rua",
    descricao: "Há um buraco grande na rua principal.",
    secretaria: "INFRAESTRUTURA",
    dataAbertura: "2023-10-02 11:00:00",
    status: "CONCLUÍDO",
    latitude: null,
    longitude: null,
    fotoAntesUrl: "https://t2.gstatic.com/images?q=tbn:ANd9GcTBLkUokRWxieS2uNcbZzQXKk8vXCHIF9JAhTcv2AXkfcIv5PhO",
    fotoDepoisUrl: null,
    avaliacao: null,
    historicos: []
  },
  {
    id: 3,
    usuarioId: 1,
    titulo: "Lixo acumulado",
    descricao: "Há lixo acumulado na esquina da minha rua",
    secretaria: "SAÚDE",
    dataAbertura: "2023-10-03 12:00:00",
    status: "CONCLUÍDO",
    latitude: null,
    longitude: null,
    fotoAntesUrl: null,
    fotoDepoisUrl: null,
    avaliacao: {
      id: 1,
      chamadoId: 3,
      usuarioId: 1,
      estrelas: 5,
      comentario: "Ótimo atendimento!",
      dataAvaliacao: "2023-10-04 13:00:00"
    },
    historicos: [
        {
            id: 1,
            chamadoId: 3,
            funcionarioId: 1,
            dataModificacao: "2023-10-03 13:00:00",
            observacao: "Chamado concluído.",
            statusAnterior: "EM ANDAMENTO",
            statusNovo: "CONCLUÍDO"
        }
    ]
  },
]

export function formatDate(dateString: string) {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

export function getStatusBadge(status: string) {
    switch (status) {
        case "PENDENTE":
            return (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                    <Clock className="w-3 h-3 mr-1" /> Pendente
                </Badge>
            )
        case "EM ANDAMENTO":
            return (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" /> Em andamento
                </Badge>
            )
        case "CONCLUÍDO":
            return (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" /> Concluído
                </Badge>
            )
        default:
            return (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                    <AlertTriangle className="w-3 h-3 mr-1" /> {status}
                </Badge>
            )
    }
}

export default function FuncionarioDashboard() {
    const { userRoles, admin, loading } = useContext(AuthContext)

    const [chamados, setChamados] = useState<ChamadoInterface[]>([...chamadosInventados])//

    const [filteredChamados, setFilteredChamados] = useState<ChamadoInterface[]>([])//
    const [activeFilter, setActiveFilter] = useState("todos") //

    const [page, setPage] = useState({
        totalElements: 0,
        totalPages: 0,
        number: 0,
    })
    const [imageAntesUrl, setImageAntesUrl] = useState<string | null>(null)

    const [isOpen, setIsOpen] = useState(false)
    const [loadingChamados, setLoadingChamados] = useState(true)
    const [selectedChamado, setSelectedChamado] = useState<ChamadoInterface | null>(null)

    const updateChamadoForm = useForm({
        defaultValues: {
            statusNovo: "",
            observacao: "",
            fotoDepoisUrl: null as File | null, 
        },
    })
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userNames, setUserNames] = useState<Record<number, string>>({});
    const [isloading, setIsLoading] = useState(false)
    const [fotoDepoisPreview, setFotoDepoisPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)


    async function handleOpenImageDialog(filename: string) {
        try {
            const response = await uploadService.getImage(filename)
            const url = URL.createObjectURL(response.data)
            setImageAntesUrl(url)
        } catch (error) {
            console.error("Erro ao carregar imagem:", error)
            setImageAntesUrl(null)
        }
    }

    async function handleUpdateChamado(formData: any) {
        await toast.promise(
            async () => {
                try {
                    if (!selectedChamado) return
    
                    let fotoDepoisUrl = null
                    
                    // Se houver uma nova imagem, faça o upload
                    if (formData.fotoDepoisUrl instanceof File) {
                        const imageFormData = new FormData()
                        imageFormData.append("image", formData.fotoDepoisUrl, formData.fotoDepoisUrl.name)
                        const { data: uploadedUrl } = await uploadService.saveImage(imageFormData)
                        fotoDepoisUrl = uploadedUrl
                    }
    
                    const historicoData: HistoricoInterface = {
                        chamadoId: selectedChamado.id,
                        funcionarioId: admin?.id,
                        dataModificacao: new Date().toISOString().slice(0, 19).replace("T", " "),
                        statusAnterior: selectedChamado.status,
                        statusNovo: formData.statusNovo,
                        observacao: formData.observacao,
                    }
    
                    await chamadoService.update({ 
                        ...selectedChamado, 
                        status: formData.statusNovo,
                        fotoDepoisUrl: fotoDepoisUrl || selectedChamado.fotoDepoisUrl // Mantém a existente se não houver nova
                    })
                    
                    await historicoService.create(historicoData)
    
                    if (userRoles?.includes("ROLE_ADMIN") && admin?.secretaria) {
                        const {
                            data: {
                                _embedded: { chamadoDTOList },
                            },
                        } = await chamadoService.findBySecretaria({ secretaria: admin.secretaria })
                        setChamados(chamadoDTOList)
                        applyFilter(chamadoDTOList)
                    }
    
                    setSelectedChamado((prev) => (prev ? { 
                        ...prev, 
                        status: formData.statusNovo,
                        fotoDepoisUrl: fotoDepoisUrl || prev.fotoDepoisUrl 
                    } : null))
                    setIsOpen(false)
                    fetchChamados()
                    updateChamadoForm.reset()
                    setFotoDepoisPreview(null)
                } catch (error) {
                    console.error("Erro ao atualizar chamado:", error)
                } finally {
                    setIsLoading(false)
                }
            },
            {
                loading: "Atualizando chamado...",
                success: "Chamado atualizado com sucesso!",
                error: "Erro ao atualizar chamado.",
            }
        )
    }
    //
    function applyFilter(chamadosList: ChamadoInterface[]) {
        if (activeFilter === "todos") {
            setFilteredChamados(chamadosList)
        } else {
            const statusMap: Record<string, string> = {
                pendentes: "PENDENTE",
                andamento: "EM ANDAMENTO",
                concluidos: "CONCLUÍDO",
            }
            const filteredStatus = statusMap[activeFilter]
            setFilteredChamados(chamadosList.filter((chamado) => chamado.status === filteredStatus))
        }
    }

    useEffect(() => {
        applyFilter(chamados)
    }, [activeFilter, chamados])


    async function fetchChamados() {
        try {

            if (userRoles?.includes("ROLE_ADMIN") && !loading && admin?.secretaria) {
                const response = await chamadoService.findBySecretaria({ secretaria: admin.secretaria })
                const {
                    _embedded: { chamadoDTOList },
                    page: pageData,
                } = response.data
                setChamados(chamadoDTOList)
                setFilteredChamados(chamadoDTOList)
                setPage({
                    totalElements: pageData.totalElements,
                    totalPages: pageData.totalPages,
                    number: pageData.number,
                })
            }

            if (!admin?.secretaria) return;
                    const response = await chamadoService.findBySecretaria({ secretaria: admin?.secretaria });
                    const chamadosData = response.data._embedded?.chamadoDTOList || [];
                    setChamados(chamadosData);
                    
                    // Prefetch user names
                    const names: Record<number, string> = {};
                    await Promise.all(chamadosData.map(async (chamado: ChamadoInterface) => {
                      try {
                        const userResponse = await api.get(`/api/usuario/${chamado.usuarioId}`);
                        names[chamado.id] = userResponse.data.nome;
                      } catch (error) {
                        console.error("Erro ao buscar usuário:", error);
                        names[chamado.id] = "Usuário não encontrado";
                      }
                    }));
                    setUserNames(names);
        } catch (error) {
            console.error("Erro ao buscar chamados:", error)
        } finally {
            setLoadingChamados(false)
        }
    }

    //
    useEffect(() => {       
        fetchChamados()
    }, [userRoles, loading, admin, page.number])
    

    const handleRowClick = (chamado: ChamadoInterface) => {
        setSelectedChamado(chamado);
        setDialogOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
    
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Arquivo deve ter no máximo 5MB")
            return
        }
    
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error("Apenas JPG, PNG e WebP são aceitos")
            return
        }
    
        updateChamadoForm.setValue("fotoDepoisUrl", file)
        const reader = new FileReader()
        reader.onload = (event) => setFotoDepoisPreview(event.target?.result as string)
        reader.readAsDataURL(file)
    }

    const handleRemoveFoto = () => {
        updateChamadoForm.setValue("fotoDepoisUrl", null)
        setFotoDepoisPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    if (loading || loadingChamados) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-6">
                    <Skeleton className="h-12 w-[250px]" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Skeleton className="h-[200px] rounded-lg" />
                        <Skeleton className="h-[200px] rounded-lg" />
                        <Skeleton className="h-[200px] rounded-lg" />
                    </div>
                    <Skeleton className="h-[400px] rounded-lg" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="container mx-auto p-4 md:p-6">

                <div className="space-y-8">
                        
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <Card className="lg:col-span-3">
                                    <CardHeader>
                                        <CardTitle>Lista de Chamados</CardTitle>
                                        <CardDescription>Selecione um chamado para ver detalhes

                                        </CardDescription>

                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <Tabs
                                                defaultValue="todos"
                                                value={activeFilter}
                                                onValueChange={setActiveFilter}
                                                className="w-full"
                                            >
                                                <TabsList className="grid grid-cols-4 w-full">
                                                    <TabsTrigger value="todos">Todos</TabsTrigger>
                                                    <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                                                    <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
                                                    <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </div>

                                        <div className="rounded-md border overflow-auto h-[500px]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Título</TableHead>
                                                        <TableHead className="hidden md:table-cell">Data</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="hidden md:table-cell">Secretaria</TableHead>
                                                        <TableHead className="hidden md:table-cell">Imagem</TableHead>
                                                        <TableHead className="hidden md:table-cell">Histórico</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {chamados.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                                                Nenhum chamado encontrado
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredChamados.map((chamado) => (
                                                            <TableRow
                                                                key={chamado.id}
                                                                onClick={() => setSelectedChamado(chamado)}
                                                                className={`cursor-pointer hover:bg-gray-50 ${selectedChamado?.id === chamado.id ? "bg-gray-50" : ""}`}
                                                            >
                                                                <TableCell className="font-medium">
                                                                    <div className="flex flex-col">
                                                                        <span className="truncate max-w-[200px]">{chamado.titulo}</span>
                                                                        <span className="text-xs text-gray-500 md:hidden">
                                                                            {formatDate(chamado.dataAbertura)}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="hidden md:table-cell">
                                                                    {formatDate(chamado.dataAbertura)}
                                                                </TableCell>
                                                                <TableCell>{getStatusBadge(chamado.status)}</TableCell>
                                                                <TableCell className="hidden md:table-cell">
                                                                    <Badge variant="outline" className="bg-gray-100">
                                                                        {chamado.secretaria || "Não atribuído"}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="hidden md:table-cell">  
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleOpenImageDialog(chamado.fotoAntesUrl ? chamado.fotoAntesUrl.split("/").pop() || "" : "")
                                                                                }}
                                                                            >
                                                                                <ImageIcon className="h-4 w-4" />
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Foto do chamado</DialogTitle>
                                                                                <DialogDescription>Imagem enviada pelo cidadão</DialogDescription>
                                                                            </DialogHeader>
                                                                            {chamado.fotoAntesUrl === null || !chamado.fotoAntesUrl ? (
                                                                                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                                                                                    <p className="text-gray-500">Não foi possível recuperar a imagem.</p>
                                                                                </div>
                                                                                
                                                                            ) : (
                                                                                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                                                                    <img
                                                                                        src={chamado.fotoAntesUrl}
                                                                                        alt="Foto do chamado"
                                                                                        className="object-cover w-full h-full"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </DialogContent>
                                                                    </Dialog>                                                                      
                                                                </TableCell>
                                                                <TableCell className="hidden md:table-cell">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() => {
                                                                            handleRowClick(chamado)
                                                                        }}
                                                                    >
                                                                        <History className="h-4 w-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={page.number === 0}
                                                onClick={() => setPage({ ...page, number: page.number - 1 })}
                                                className="flex items-center gap-1"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-chevron-left"
                                                >
                                                    <path d="m15 18-6-6 6-6" />
                                                </svg>
                                                Anterior
                                            </Button>
                                            <span className="text-sm text-gray-500">
                                                Página {page.number + 1} de {page.totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={page.number + 1 >= page.totalPages}
                                                onClick={() => setPage({ ...page, number: page.number + 1 })}
                                                className="flex items-center gap-1"
                                            >
                                                Próxima
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-chevron-right"
                                                >
                                                    <path d="m9 18 6-6-6-6" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Detalhes do Chamado</CardTitle>
                                        <CardDescription>
                                            {selectedChamado ? `Chamado #${selectedChamado.id}` : "Selecione um chamado para ver detalhes"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedChamado ? (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-lg">{selectedChamado.titulo}</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {getStatusBadge(selectedChamado.status)}
                                                        <Badge variant="outline" className="bg-gray-100">
                                                            {selectedChamado.secretaria || "Não atribuído"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-gray-500">Descrição</p>
                                                    <p className="text-sm">{selectedChamado.descricao}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-gray-500">Data de Abertura</p>
                                                    <p className="text-sm">{formatDate(selectedChamado.dataAbertura)}</p>
                                                </div>

                                                {selectedChamado.fotoAntesUrl ? (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-gray-500">Imagem</p>
                                                        <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-full flex items-center justify-center gap-2"
                                                                        onClick={() =>
                                                                            handleOpenImageDialog(selectedChamado.fotoAntesUrl ? selectedChamado.fotoAntesUrl.split("/").pop() || "" : "")
                                                                        }
                                                                    >
                                                                        <ImageIcon className="h-4 w-4" />
                                                                        <span>Visualizar imagem</span>
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Foto do chamado</DialogTitle>
                                                                        <DialogDescription>Imagem enviada pelo cidadão</DialogDescription>
                                                                    </DialogHeader>
                                                                    {imageAntesUrl ? (
                                                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                                                            <img
                                                                                src={imageAntesUrl || "/placeholder.svg"}
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
                                                        
                                                    </div>
                                                ): (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-gray-500">Imagem</p>
                                                        <p className="text-sm text-gray-500">Nenhuma imagem enviada</p>
                                                    </div>
                                                )}

                                                <p className="text-sm font-medium text-gray-500 mt-2">Histórico</p>
                                                        <Dialog>
                                                            <div>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-full flex items-center justify-center gap-2"
                                                                        onClick={() =>
                                                                            handleOpenImageDialog(selectedChamado.fotoAntesUrl ? selectedChamado.fotoAntesUrl.split("/").pop() || "" : "")
                                                                        }
                                                                    >
                                                                        <History className="h-4 w-4" />
                                                                        <span>Histórico</span>
                                                                    </Button>
                                                                </DialogTrigger>
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
                                                                        {selectedChamado?.historicos?.length > 0 ? (
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
                                                                                    Status Anterior: {getStatusBadge(item.statusAnterior)}
                                                                                </p>
                                                                                <p className="text-sm text-gray-500">
                                                                                    Status Modificado: {getStatusBadge(item.statusNovo)}
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
                                                            </div>
                                                        </Dialog>

                                                <div className="pt-4 space-y-4">
                                                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button className="w-full bg-[--cor-primaria2] hover:bg-[--cor-primaria21]">
                                                                Alterar situação do chamado
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle className="text-[--cor-primaria]">Alterar situação do chamado</DialogTitle>
                                                                <DialogDescription>
                                                                    Altere o status e adicione observações para informar o usuário sobre o andamento.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <form onSubmit={updateChamadoForm.handleSubmit(handleUpdateChamado)} className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="statusNovo">Novo Status</Label>
                                                                    <Select
                                                                        onValueChange={(value: string) => updateChamadoForm.setValue("statusNovo", value)}
                                                                        defaultValue={updateChamadoForm.getValues("statusNovo")}
                                                                        disabled={isloading}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione um status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="PENDENTE">Pendente</SelectItem>
                                                                            <SelectItem value="EM ANDAMENTO">Em andamento</SelectItem>
                                                                            <SelectItem value="CONCLUÍDO">Concluído</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="observacao">Observação</Label>
                                                                    <Textarea
                                                                        id="observacao"
                                                                        placeholder="Descreva as ações tomadas ou informações adicionais"
                                                                        {...updateChamadoForm.register("observacao")}
                                                                        rows={4}
                                                                        disabled={isloading}
                                                                    />
                                                                </div>

                                                                <div className="flex flex-col space-y-2">
                                                                    <Label htmlFor="fotoDepois">Foto do Chamado (opcional)</Label>
                                                                    
                                                                    {fotoDepoisPreview || selectedChamado?.fotoDepoisUrl ? (
                                                                        <div className="relative">
                                                                            <img
                                                                                src={fotoDepoisPreview || selectedChamado?.fotoDepoisUrl || ""}
                                                                                alt="Foto do chamado resolvido"
                                                                                className="w-full h-48 object-cover rounded-md border"
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="icon"
                                                                                className="absolute top-2 right-2"
                                                                                onClick={handleRemoveFoto}
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex flex-col sm:flex-row gap-2">
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                className="flex-1 text-[--cor-primaria] bg-white border-[--cor-primaria] hover:border-white hover:bg-[--cor-primaria2] hover:text-white"
                                                                                onClick={() => fileInputRef.current?.click()}
                                                                            >
                                                                                <Upload className="mr-2 h-4 w-4" />
                                                                                Selecionar arquivo
                                                                            </Button>
                                                                            
                                                                            <input
                                                                                {...updateChamadoForm.register("fotoDepoisUrl")}
                                                                                type="file"
                                                                                ref={fileInputRef}
                                                                                onChange={handleFileChange}
                                                                                accept="image/*"
                                                                                className="hidden"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex justify-end gap-2">
                                                                    <Button type="button" variant="outline" className="text-[--cor-error] bg-white border-[--cor-error] hover:border-white hover:bg-[--cor-error] hover:text-white" onClick={() => setIsOpen(false)}>
                                                                        Cancelar
                                                                    </Button>
                                                                    <Button type="submit" disabled={isloading} className="text-[--cor-primaria] bg-white border-[--cor-primaria] hover:border-none hover:bg-[--cor-primaria2] hover:text-white" onLoad={() => setIsLoading(true)}>
                                                                        Salvar Alterações
                                                                    </Button>
                                                                </div>
                                                            </form>
                                                        </DialogContent>
                                                    </Dialog>


                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                                <ClipboardList className="h-12 w-12 text-gray-300 mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900">Nenhum chamado selecionado</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Clique em um chamado na tabela para ver seus detalhes
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                        <HistoricoChamado
                            dialogOpen={dialogOpen}
                            setDialogOpen={setDialogOpen}
                            selectedChamado={selectedChamado}
                            userNames={userNames[selectedChamado?.id || 0] || ""}
                        />
                </div>
            </div>
        </div>
    )
}
