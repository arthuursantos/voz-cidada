import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import api from "@/shared/axios.ts"
<<<<<<< HEAD

type Status = "concluído" | "em andamento" | "pendente"

interface Chamado {
    id: number
    titulo: string
    descricao: string
    dataAbertura: string
    status: string
    fotoAntesUrl: string | null
    fotoDepoisUrl: string | null
}
=======
import {ChamadoInterface, Status} from "@/shared/types.ts";
>>>>>>> 4931cac6137d4399027aa7b7a8ee01620d56b035

interface ChamadoDialogProps {
    chamado: ChamadoInterface | null
    open: boolean
    onOpenChange: (open: boolean) => void
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
    } catch (e) {
        return dateString
    }
}

export default function GetChamadoDialog({ chamado, open, onOpenChange }: ChamadoDialogProps) {
    const [imagemAntes, setImagemAntes] = useState<string | null>(null)
    const [imagemDepois, setImagemDepois] = useState<string | null>(null)

    useEffect(() => {
        let antesObjectUrl: string | null = null
        let depoisObjectUrl: string | null = null

        const fetchImages = async () => {
            if (chamado?.fotoAntesUrl) {
                try {
                    const response = await api.get(chamado.fotoAntesUrl, { responseType: 'blob' })
                    antesObjectUrl = URL.createObjectURL(response.data)
                    setImagemAntes(antesObjectUrl)
                } catch (error) {
                    console.error("Erro ao carregar imagem antes:", error)
                }
            }

            if (chamado?.fotoDepoisUrl) {
                try {
                    const response = await api.get(chamado.fotoDepoisUrl, { responseType: 'blob' })
                    depoisObjectUrl = URL.createObjectURL(response.data)
                    setImagemDepois(depoisObjectUrl)
                } catch (error) {
                    console.error("Erro ao carregar imagem depois:", error)
                }
            }
        }

        fetchImages()

        return () => {
            if (antesObjectUrl) URL.revokeObjectURL(antesObjectUrl)
            if (depoisObjectUrl) URL.revokeObjectURL(depoisObjectUrl)
        }
    }, [chamado])

    if (!chamado) return null

    const statusColor = STATUS_COLORS[chamado.status]
    const hasFotoAntes = Boolean(chamado.fotoAntesUrl)
    const hasFotoDepois = Boolean(chamado.fotoDepoisUrl)
    const hasAnyPhotos = hasFotoAntes || hasFotoDepois

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <div className="p-6 overflow-y-auto max-h-[80vh]">
                        <DialogHeader>
                            <div className="flex items-center justify-between mb-2">
                                <DialogTitle className="text-xl">{chamado.titulo}</DialogTitle>
                                <Badge className={`${statusColor} text-white mr-6`}>
                                    {chamado.status.charAt(0).toUpperCase() + chamado.status.slice(1)}
                                </Badge>
                            </div>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Chamado #{chamado.id} • Aberto em {formatDate(chamado.dataAbertura)}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium mb-2">Descrição</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{chamado.descricao}</p>
                        </div>

                        {chamado.historicos.map((historico) => {
                            return (
                                <div key={historico.id}>
                                    <p>{historico.dataModificacao}</p>
                                    <p>Atualizado para {historico.statusNovo}</p>
                                    <p>{historico.observacao}</p>
                                </div>
                            )
                        })}
                    </div>

                    {hasAnyPhotos ? (
                        <div className="bg-muted border-l h-full flex flex-col">
                            <Tabs defaultValue={hasFotoAntes ? "antes" : "depois"} className="h-full flex flex-col">
                                <div className="px-6 pt-6 pb-2">
                                    <h3 className="text-sm font-medium mb-2">Fotos</h3>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="antes" disabled={!hasFotoAntes}>
                                            Antes
                                        </TabsTrigger>
                                        <TabsTrigger value="depois" disabled={!hasFotoDepois}>
                                            Depois
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <div className="flex-1 px-6 pb-6 overflow-y-auto">
                                    {hasFotoAntes && imagemAntes && (
                                        <TabsContent value="antes" className="h-full overflow-auto">
                                            <div className="relative w-full rounded-md flex items-center justify-center">
                                                <img
                                                    src={imagemAntes}
                                                    alt="Foto antes"
                                                    className="max-w-full object-contain max-h-[70vh]"
                                                />
                                            </div>
                                        </TabsContent>
                                    )}
                                    {hasFotoDepois && imagemDepois && (
                                        <TabsContent value="depois" className="h-full overflow-auto">
                                            <div className="relative w-full rounded-md flex items-center justify-center">
                                                <img
                                                    src={imagemDepois}
                                                    alt="Foto depois"
                                                    className="max-w-full object-contain max-h-[70vh]"
                                                />
                                            </div>
                                        </TabsContent>
                                    )}
                                </div>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="bg-muted border-l flex items-center justify-center p-6">
                            <p className="text-muted-foreground text-center">Nenhuma foto disponível para este chamado</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}