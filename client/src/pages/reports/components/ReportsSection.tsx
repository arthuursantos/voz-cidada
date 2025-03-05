import {useState} from "react"
import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Badge} from "@/components/ui/badge.tsx"
import {FileText, Filter, Plus} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx"

type ReportStatus = "concluído" | "em andamento" | "pendente"
const statusColors: Record<ReportStatus, string> = {
    concluído: "bg-green-500",
    "em andamento": "bg-blue-500",
    pendente: "bg-yellow-500",
}

interface Report {
    id: string
    title: string
    date: string
    status: ReportStatus
}

export default function ReportsSection() {
    const [reports] = useState<Report[]>([
        {
            id: "1",
            title: "Relatório Mensal de Vendas",
            date: "2023-12-01",
            status: "concluído",
        },
        {
            id: "2",
            title: "Pesquisa de Satisfação do Cliente",
            date: "2023-11-15",
            status: "em andamento",
        },
        {
            id: "3",
            title: "Análise de Inventário",
            date: "2023-10-30",
            status: "pendente",
        },
        {
            id: "4",
            title: "Relatório de Desempenho",
            date: "2023-12-05",
            status: "concluído",
        },
        {
            id: "5",
            title: "Análise de Mercado",
            date: "2023-11-20",
            status: "em andamento",
        },
    ])

    const [statusFilter, setStatusFilter] = useState<ReportStatus[]>(["concluído", "em andamento", "pendente"])

    const toggleStatusFilter = (status: ReportStatus) => {
        if (statusFilter.includes(status)) {
            setStatusFilter(statusFilter.filter((s) => s !== status))
        } else {
            setStatusFilter([...statusFilter, status])
        }
    }

    const filteredReports = reports.filter((report) => statusFilter.includes(report.status))

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-lg font-medium tracking-wider text-primary uppercase">Meus Chamados</h2>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-teal text-teal">
                                <Filter className="mr-2 h-4 w-4"/> Filtrar
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

                    <Button className="bg-teal hover:bg-teal/90">
                        <Plus className="mr-1 h-4 w-4"/> Novo Chamado
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-md font-medium">{report.title}</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm text-muted-foreground">Criado em {report.date}</p>
                                <Badge className={`${statusColors[report.status]} text-white`}>
                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                </Badge>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2 w-full text-teal border-teal hover:bg-teal hover:text-white">
                                Abrir Chamado
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredReports.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    Nenhum relatório encontrado com os filtros selecionados.
                </div>
            )}
        </div>
    )
}

