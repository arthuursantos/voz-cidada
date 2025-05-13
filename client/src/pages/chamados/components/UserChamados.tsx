import api from "@/shared/axios.ts"
import { AuthContext } from "@/contexts/AuthContext"
import CreateChamadoDialog from './CreateChamadoDialog'
import GetChamadoDialog from "./GetChamadoDialog"
import { useState, useEffect, useContext, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ChamadoInterface, Status} from "@/shared/types.ts";
import { FileText, Filter, Plus } from "lucide-react"

interface ApiResponse {
    _embedded: {
        chamadoDTOList: ChamadoInterface[]
    }
    page: {
        totalElements: number
    }
}

const STATUS_COLORS: Record<Status, string> = {
    "CONCLUÍDO": "bg-green-500",
    "EM ANDAMENTO": "bg-blue-500",
    "PENDENTE": "bg-yellow-500",
}

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR")
    } catch {
        return dateString
    }
}

export default function UserChamados() {
    const [chamados, setChamados] = useState<ChamadoInterface[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<Status[]>(["CONCLUÍDO", "EM ANDAMENTO", "PENDENTE"])
    const [selectedChamado, setSelectedChamado] = useState<ChamadoInterface | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [novoChamadoDialogOpen, setNovoChamadoDialogOpen] = useState(false)

    const { user } = useContext(AuthContext)

    const fetchChamados = useCallback(async () => {
        if (!user?.id) return

        try {
            setLoading(true)
            const response = await api.get<ApiResponse>(`/api/chamado/user/${user.id}`)
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
    }, [user?.id])

    useEffect(() => {
        fetchChamados()
    }, [fetchChamados])

    const toggleStatusFilter = (status: Status) => {
        if (statusFilter.includes(status)) {
            setStatusFilter(statusFilter.filter((s) => s !== status))
        } else {
            setStatusFilter([...statusFilter, status])
        }
    }

    const filteredChamados = chamados.filter((chamado) =>
        statusFilter.includes(chamado.status as Status)
    )

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
                            {(Object.keys(STATUS_COLORS) as Status[]).map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={statusFilter.includes(status)}
                                    onCheckedChange={() => toggleStatusFilter(status)}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]} mr-2`}></div>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </div>
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button className="bg-teal hover:bg-teal/90" onClick={() => setNovoChamadoDialogOpen(true)}>
                        <Plus className="mr-1 h-4 w-4" /> Novo Chamado
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredChamados.map((chamado) => {
                    return (
                        <Card key={chamado.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-md font-medium">{chamado.titulo}</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-muted-foreground">
                                        Criado em {formatDate(chamado.dataAbertura)}
                                    </p>
                                    <Badge className={`${STATUS_COLORS[chamado.status as Status]} text-white`}>
                                        {chamado.status.charAt(0).toUpperCase() + chamado.status.slice(1)}
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
                    )
                })}
            </div>

            {filteredChamados.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    Nenhum chamado encontrado com os filtros selecionados.
                </div>
            )}

            <GetChamadoDialog
                chamado={selectedChamado}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />

            <CreateChamadoDialog
                open={novoChamadoDialogOpen}
                onOpenChange={setNovoChamadoDialogOpen}
                onSuccess={fetchChamados}
            />
        </div>
    )
}