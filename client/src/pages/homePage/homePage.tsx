"use client";

import { Search} from 'lucide-react';
import Header from "@/components/header";
import BotaoChamado from '@/components/botaoChamado';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/shared/axios';
import CreateChamadoDialog from '../Chamados/components/CreateChamadoDialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import GetChamadoDialog from '../Chamados/components/GetChamadoDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, Filter } from "lucide-react"
import ChamadosCarousel from '../Home/Components/ReportsCarousel';


type Status = "concluído" | "em andamento" | "pendente"

interface Chamado {
  id: number
  titulo: string
  descricao: string
  dataAbertura: string
  status: string
  fotoAntesUrl: string | null
  fotoDepoisUrl: string | null
  latitude: number | null
  longitude: number | null
}

interface ApiResponse {
  _embedded: {
      chamadoDTOList: Chamado[]
  }
  page: {
      totalElements: number
  }
}

// const chamadosAleatorios = [
//   {
//     id: 1,
//     titulo: "Buraco na rua",
//     descricao: "Descrição do chamado 1",
//     dataAbertura: "2023-10-01",
//     status: "PENDENTE",
//     fotoAntesUrl: null,
//     fotoDepoisUrl: null,
//   },
//   {
//     id: 2,
//     titulo: "Mato alto no Parque Pet",
//     descricao: "Descrição do chamado 2",
//     dataAbertura: "2023-10-02",
//     status: "EM_ANDAMENTO",
//     fotoAntesUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRUREvlCvHREdbT-Xsf2L2dmgO7AulT-6hqeDRUThJvVKKQwYuPwNatanNGyJiXSwubdlC8iTQHCPxOrsM-uuUCfg",
//     fotoDepoisUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Bra-Cos_%281%29_%28cropped%29.jpg/640px-Bra-Cos_%281%29_%28cropped%29.jpg",
//   }
// ]

const formatDate = (dateString: string): string => {
  try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR")
  } catch (e) {
      return dateString
  }
}

const STATUS_MAP: Record<string, Status> = {
  CONCLUIDO: "concluído",
  EM_ANDAMENTO: "em andamento",
  PENDENTE: "pendente",
}

const STATUS_COLORS: Record<Status, string> = {
  concluído: "bg-green-500",
  "em andamento": "bg-blue-500",
  pendente: "bg-yellow-500",
}

const statusMapping = (apiStatus: string): Status => {
  return STATUS_MAP[apiStatus] || "pendente"
}

export default function Dashboard() {

  const { user } = useContext(AuthContext)
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<Status[]>(["concluído", "em andamento", "pendente"])
  const [novoChamadoDialogOpen, setNovoChamadoDialogOpen] = useState(false)
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  const filteredChamados = chamados.filter((chamado) =>
    statusFilter.includes(statusMapping(chamado.status))
  )

  const toggleStatusFilter = (status: Status) => {
    if (statusFilter.includes(status)) {
        setStatusFilter(statusFilter.filter((s) => s !== status))
    } else {
        setStatusFilter([...statusFilter, status])
    }
}

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>
    
    {error?  (
     <div className="container py-8 max-w-7xl">
      <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-red-500">Erro: {error}</p>
      </div>
    </div>
    )
    :
      
    <>
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Pesquisar ocorrências..."
            className="w-full pl-10 font-lato pr-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mt-4">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-teal font-lato text-teal">
                      <Filter className="mr-2 font-lato h-4 w-4" /> Filtrar
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
        </div>
      </div>

      {
        loading ? (
          <div className="container py-8 max-w-7xl">
                <div className="flex items-center justify-center min-h-[300px]">
                    <p>Carregando chamados...</p>
                </div>
            </div>
        ) : (
          <>

            {/* List Cards */}
            <h1 className='text-center text-2xl font-montserrat text-[--cor-primaria]'>SEUS CHAMADOS</h1>
            <div className="max-w-7xl mx-auto font-lato p-4 space-y-3">
              {
                filteredChamados.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <p className="text-gray-500">Nenhum chamado encontrado.</p>
                    </div>
                )
              : 
              filteredChamados.map((chamado) => {
                    const status = statusMapping(chamado.status)
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
                                    <Badge className={`${STATUS_COLORS[status]} text-white`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Badge>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 w-full text-[--cor-primaria2] border-teal hover:bg-teal hover:text-[--cor-primaria]"
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
          </>
        )
      }
      
      <div className="container mx-auto py-10 mb-10">
      <h1 className='text-center text-2xl font-montserrat mb-3 text-[--cor-primaria]'>SAIBA MAIS SOBRE NOSSAS MELHORIAS:</h1>
        <ChamadosCarousel/>
      </div>

      {/* Open Call Button */}
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center p-4 ">
            <BotaoChamado onClick={() => setNovoChamadoDialogOpen(true)}/>
      </div>

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

    </>
    }
      
    </div>
  );
}