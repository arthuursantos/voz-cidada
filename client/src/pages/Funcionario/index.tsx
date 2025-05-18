"use client"
import Historico from "./historico"; //vitor

import Header from "@/components/header";
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ImageIcon, ClipboardList, CheckCircle, Clock, AlertTriangle } from "lucide-react"
//import authService from "@/shared/services/authService.ts"
import chamadoService from "@/shared/services/chamadoService.ts"
import uploadService from "@/shared/services/uploadService.ts"
import historicoService from "@/pages/Funcionario/historicoService.ts"
import { AuthContext, type JWTClaims } from "@/contexts/AuthContext.tsx"
import type { ChamadoInterface, HistoricoInterface } from "@/shared/types.ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label.tsx"

export default function FuncionarioDashboard() {
    const { userRoles, admin, loading } = useContext(AuthContext)

    const [chamados, setChamados] = useState<ChamadoInterface[]>([])

    const [filteredChamados, setFilteredChamados] = useState<ChamadoInterface[]>([])//
    const [activeFilter, setActiveFilter] = useState("todos") //

    const [statusCount, setStatusCount] = useState({
        PENDENTE: 0,
        "EM ANDAMENTO": 0,
        CONCLUÍDO: 0,
    })
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
        },
    })


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
        try {
            if (!selectedChamado) return

            const historicoData: HistoricoInterface = {
                chamadoId: selectedChamado.id,
                funcionarioId: admin?.id,
                dataModificacao: new Date().toISOString().slice(0, 19).replace("T", " "),
                statusAnterior: selectedChamado.status,
                statusNovo: formData.statusNovo,
                observacao: formData.observacao,
            }

            await chamadoService.update({ ...selectedChamado, status: formData.statusNovo })
            await historicoService.create(historicoData)

            if (userRoles?.includes("ROLE_ADMIN") && admin?.secretaria) {
                const {
                    data: {
                        _embedded: { chamadoDTOList },
                    },
                } = await chamadoService.findBySecretaria({ secretaria: admin.secretaria })
                setChamados(chamadoDTOList)
                applyFilter(chamadoDTOList)//
            }

            setSelectedChamado((prev) => (prev ? { ...prev, status: formData.statusNovo } : null))
            setIsOpen(false)
            updateChamadoForm.reset()
        } catch (error) {
            console.error("Erro ao atualizar chamado:", error)
        }
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


    //
    useEffect(() => {
        async function fetchChamados() {
            try {
                const { data } = await chamadoService.findAllStatus()
                const count = { PENDENTE: 0, "EM ANDAMENTO": 0, CONCLUÍDO: 0 }
                data.forEach((status: "PENDENTE" | "EM ANDAMENTO" | "CONCLUÍDO") => {
                    if (count[status] !== undefined) {
                        count[status]++
                    }
                })
                setStatusCount(count)


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
            } catch (error) {
                console.error("Erro ao buscar chamados:", error)
            } finally {
                setLoadingChamados(false)
            }
        }

        fetchChamados()
    }, [userRoles, loading, admin, page.number])

    function getStatusBadge(status: string) {
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

    function formatDate(dateString: string) {
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


                    <Tabs defaultValue="chamados" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="chamados">Chamados</TabsTrigger>
                            <TabsTrigger value="historico">Histórico</TabsTrigger>
                        </TabsList>

                        <TabsContent value="chamados" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="bg-teal-600 text-white text-center">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold">Total de Chamados</CardTitle>
                                        <CardDescription className="text-white">Todos os chamados registrados</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white">{page.totalElements}</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-amber-500 text-white text-center">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold">Pendentes</CardTitle>
                                        <CardDescription className="text-white">Chamados aguardando atendimento</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white">{statusCount["PENDENTE"]}</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-green-600 text-white text-center">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold">Respondidos</CardTitle>
                                        <CardDescription className="text-white">Chamados finalizados ou em andamento</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white">
                                            {statusCount["CONCLUÍDO"] + statusCount["EM ANDAMENTO"]}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

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
                                                                    {chamado.fotoAntesUrl && (
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        handleOpenImageDialog(chamado.fotoAntesUrl.split("/").pop() || "")
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
                                                                    )}
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

                                                {selectedChamado.fotoAntesUrl && (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-gray-500">Imagem</p>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full flex items-center justify-center gap-2"
                                                                    onClick={() =>
                                                                        handleOpenImageDialog(selectedChamado.fotoAntesUrl.split("/").pop() || "")
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
                                                )}

                                                <div className="pt-4 space-y-4">
                                                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button className="w-full bg-teal-600 hover:bg-teal-700">
                                                                Alterar situação do chamado
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Alterar situação do chamado</DialogTitle>
                                                                <DialogDescription>
                                                                    Altere o status e adicione observações para informar o usuário sobre o andamento.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <form onSubmit={updateChamadoForm.handleSubmit(handleUpdateChamado)} className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="statusNovo">Novo Status</Label>
                                                                    <Select
                                                                        onValueChange={(value) => updateChamadoForm.setValue("statusNovo", value)}
                                                                        defaultValue={updateChamadoForm.getValues("statusNovo")}
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
                                                                    />
                                                                </div>

                                                                <div className="flex justify-end gap-2">
                                                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                                                        Cancelar
                                                                    </Button>
                                                                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
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
                        </TabsContent>
                        <TabsContent value="historico">
                            <Historico /> {/* 👈 componente ou conteúdo da página historico.tsx */}
                        </TabsContent>


                    </Tabs>
                </div>
            </div>
        </div>
    )
}
