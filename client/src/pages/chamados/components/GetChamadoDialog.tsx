import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import api from "@/shared/axios.ts"
import { ChamadoInterface, Status } from "@/shared/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import Rating from '@mui/material/Rating';
import { Textarea } from "@/components/ui/textarea"
import AvaliacaoArea from "@/components/avaliacao"

interface ChamadoDialogProps {
    chamado: ChamadoInterface | null
    open: boolean
    onOpenChange: (open: boolean) => void
    atualizarChamado?: () => void
}

const STATUS_MAP: Record<string, Status> = {
  "CONCLUÍDO": "CONCLUÍDO",
  "EM ANDAMENTO": "EM ANDAMENTO",
  PENDENTE: "PENDENTE",
}

const STATUS_COLORS: Record<Status, string> = {
  "CONCLUÍDO": "bg-green-500",
  "EM ANDAMENTO": "bg-blue-500",
  "PENDENTE": "bg-yellow-500",
}

const statusMapping = (apiStatus: string): Status => {
  return STATUS_MAP[apiStatus] || "PENDENTE"
}

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR")
    } catch (e) {
        return dateString
    }
}

export default function GetChamadoDialog({ chamado, open, onOpenChange, atualizarChamado }: ChamadoDialogProps) {
    const [imagemAntes, setImagemAntes] = useState<string | null>(null)
    const [imagemDepois, setImagemDepois] = useState<string | null>(null)

    useEffect(() => {
        let antesObjectUrl: string | null = null
        let depoisObjectUrl: string | null = null

        const fetchImages = async () => {
            try {
                if (chamado?.fotoAntesUrl) {
                    const response = await api.get(chamado.fotoAntesUrl, { responseType: 'blob' })
                    antesObjectUrl = URL.createObjectURL(response.data)
                    setImagemAntes(antesObjectUrl)
                }
                if (chamado?.fotoDepoisUrl) {
                    const response = await api.get(chamado.fotoDepoisUrl, { responseType: 'blob' })
                    depoisObjectUrl = URL.createObjectURL(response.data)
                    setImagemDepois(depoisObjectUrl)
                }
            } catch (error) {
                console.error("Erro ao carregar imagens:", error)
            }
        }

        fetchImages()

        return () => {
            if (imagemAntes) URL.revokeObjectURL(imagemAntes)
            if (imagemDepois) URL.revokeObjectURL(imagemDepois)
        }
    }, [chamado])

    if (!chamado) return null

    const status = statusMapping(chamado.status)
    const hasFotoAntes = Boolean(chamado.fotoAntesUrl)
    const hasFotoDepois = Boolean(chamado.fotoDepoisUrl)
    const hasAnyPhotos = hasFotoAntes || hasFotoDepois

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <ScrollArea className="h-full">
                    <div className="p-6 overflow-y-auto max-h-[80vh]">
                        
                            <DialogHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <DialogTitle className="text-xl">{chamado.titulo}</DialogTitle>
                                    <Badge className={`${STATUS_COLORS[status]} text-white mr-6`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
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

                            <div className="mt-6">
                                <h3 className="text-sm font-medium mb-2">Localização:</h3>
                                {chamado.latitude && chamado.longitude ? (
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${chamado.latitude},${chamado.longitude}&markers=${chamado.latitude},${chamado.longitude}&z=15&output=embed`}
                                        width="100%"
                                        height="300"
                                        className="border rounded-md"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground">Localização não informada</p>
                                )}
                            </div>

                            {(status === "EM ANDAMENTO" || status === "CONCLUÍDO")  && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold font-montserrat mb-2">Devolutiva do servidor público:</h3>
                                    {
                                        chamado.historicos[chamado.historicos.length - 1].observacao.trim().length > 0 ? (
                                            <Textarea className="bg-muted font-lato" readOnly value={ chamado.historicos[chamado.historicos.length - 1].observacao}/>
                                        ):
                                        (
                                            <p className="text-sm text-muted-foreground">Nenhuma devolutiva registrada.</p>
                                        )
                                    }
                                          
                                </div>
                            )}

                            {/* AVALIAÇÂO - SE ESTIVER CONCLUÍDO */}
                            {status === "CONCLUÍDO" && !chamado.avaliacao && (
                                <AvaliacaoArea id={chamado.id} atualizarChamado={() => { atualizarChamado && atualizarChamado(); }} />
                            )}
                            {status === "CONCLUÍDO" && chamado.avaliacao && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold font-montserrat mb-2">Sua avaliação:</h3>
                                    <div className="flex items-center mb-2">
                                        <Rating
                                            name="avaliacao"
                                            value={chamado.avaliacao.estrelas}
                                            readOnly
                                            precision={1}
                                        />
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            {chamado.avaliacao.estrelas} Estrelas
                                        </span>
                                    </div>
                                    {chamado.avaliacao.comentario && (
                                        <Textarea
                                            value={chamado.avaliacao.comentario}
                                            readOnly
                                            className="bg-muted"
                                            rows={5}
                                        />
                                    )}
                                </div>
                            )}

                            {/* HISTÓRICO */}
                        
                    </div>
                    </ScrollArea>


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