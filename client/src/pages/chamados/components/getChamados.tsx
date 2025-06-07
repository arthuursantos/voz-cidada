
import { AuthContext } from "@/contexts/AuthContext.tsx"
import DialogChamados from "./dialogGetChamado.tsx"
import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { FileText, Filter, Plus } from "lucide-react"
import DialogCreateChamado from "./dialogCreateChamado.tsx"
import api from "@/shared/axios.ts"

type Status = "concluído" | "em andamento" | "pendente"

const statusColors: Record<Status, string> = {
    concluído: "bg-green-500",
    "em andamento": "bg-blue-500",
    pendente: "bg-yellow-500",
}

const statusMapping = (apiStatus: string): Status => {
    const statusMap: Record<string, Status> = {
        CONCLUIDO: "concluído",
        EM_ANDAMENTO: "em andamento",
        PENDENTE: "pendente",
    }
    return statusMap[apiStatus] || "pendente"
}

type Chamado = {
    id: number
    titulo: string
    descricao: string
    dataAbertura: string
    status: string
    fotoAntesUrl: string | null
    fotoDepoisUrl: string | null
}

type ApiResponse = {
    _embedded: {
        chamadoDTOList: Chamado[]
    }
    page: {
        totalElements: number
    }
}

export default function GetUserChamados() {
    const [chamados, setChamados] = useState<Chamado[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<Status[]>(["concluído", "em andamento", "pendente"])
    const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [novoChamadoDialogOpen, setNovoChamadoDialogOpen] = useState(false)

    const { user } = useContext(AuthContext)

    useEffect(() => {
        const fetchChamados = async () => {
            try {
                setLoading(true)
                const response = await api.get<ApiResponse>(`/api/chamado/user/${user?.id}`)
                if (response.data._embedded && response.data._embedded.chamadoDTOList) {
                    setChamados(response.data._embedded.chamadoDTOList)
                } else {
                    setChamados([])
                }
            } catch (err) {
                setError("Erro ao carregar chamados")
                console.error("Erro ao buscar chamados:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchChamados()
    }, [user?.id])

    const toggleStatusFilter = (status: Status) => {
        if (statusFilter.includes(status)) {
            setStatusFilter(statusFilter.filter((s) => s !== status))
        } else {
            setStatusFilter([...statusFilter, status])
        }
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("pt-BR")
        } catch (e) {
            return dateString
        }
    }

    const filteredChamados = chamados.filter((chamado) => statusFilter.includes(statusMapping(chamado.status)))

    if (loading) {
        return (
            <div className="container py-8 max-w-7xl">
                <div className="flex items-center justify-center min-h-[300px]">
                    <p>Carregando chamados...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container py-8 max-w-7xl">
                <div className="flex items-center justify-center min-h-[300px]">
                    <p className="text-red-500">Erro: {error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <h2 className="text-lg font-medium tracking-wider text-primary uppercase">Meus Chamados</h2>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-teal text-teal">
                                <Filter className="mr-2 h-4 w-4" /> Filtrar
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem
                                checked={statusFilter.includes("concluído")}
                                onCheckedChange={() => toggleStatusFilter("concluído")}
                            >
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                    Concluído
                                </div>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={statusFilter.includes("em andamento")}
                                onCheckedChange={() => toggleStatusFilter("em andamento")}
                            >
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                    Em andamento
                                </div>
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={statusFilter.includes("pendente")}
                                onCheckedChange={() => toggleStatusFilter("pendente")}
                            >
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                                    Pendente
                                </div>
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button className="bg-teal hover:bg-teal/90" onClick={() => setNovoChamadoDialogOpen(true)}>
                        <Plus className="mr-1 h-4 w-4" /> Novo Chamado
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredChamados.map((chamado) => (
                    <Card key={chamado.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-md font-medium">{chamado.titulo}</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm text-muted-foreground">Criado em {formatDate(chamado.dataAbertura)}</p>
                                <Badge className={`${statusColors[statusMapping(chamado.status)]} text-white`}>
                                    {statusMapping(chamado.status).charAt(0).toUpperCase() + statusMapping(chamado.status).slice(1)}
                                </Badge>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full text-teal border-teal hover:bg-teal hover:text-white"
                                onClick={() => {
                                    setSelectedChamado(chamado)
                                    setDialogOpen(true)
                                }}
                            >
                                Abrir Chamado
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredChamados.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    Nenhum chamado encontrado com os filtros selecionados.
                </div>
            )}
            <DialogChamados chamado={selectedChamado} open={dialogOpen} onOpenChange={setDialogOpen} />
            <DialogCreateChamado
                open={novoChamadoDialogOpen}
                onOpenChange={setNovoChamadoDialogOpen}
                onSuccess={() => {
                    const fetchChamados = async () => {
                        try {
                            setLoading(true)
                            const response = await api.get<ApiResponse>(`/api/chamado/user/${user?.id}`)
                            if (response.data._embedded && response.data._embedded.chamadoDTOList) {
                                setChamados(response.data._embedded.chamadoDTOList)
                            } else {
                                setChamados([])
                            }
                        } catch (err) {
                            setError("Erro ao carregar chamados")
                            console.error("Erro ao buscar chamados:", err)
                        } finally {
                            setLoading(false)
                        }
                    }
                    fetchChamados()
                }}
            />
        </div>
    )
}
