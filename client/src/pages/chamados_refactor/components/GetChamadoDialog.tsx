"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import api from "@/shared/axios.ts"
import type { ChamadoInterface } from "@/shared/types.ts"
import { Eye, Calendar, Star } from "lucide-react"

export default function GetChamadoDialog({ chamado }: { chamado: ChamadoInterface }) {
    const [isOpen, setIsOpen] = useState(false)
    const hasFotoAntes = Boolean(chamado.fotoAntesUrl)
    const hasFotoDepois = Boolean(chamado.fotoDepoisUrl)

    const [imagemAntes, setImagemAntes] = useState<string | null>(null)
    const [imagemDepois, setImagemDepois] = useState<string | null>(null)

    useEffect(() => {
        const fetchImages = async () => {
            if (chamado?.fotoAntesUrl) {
                const response = await api.get(chamado.fotoAntesUrl, { responseType: "blob" })
                const antesObjectUrl = URL.createObjectURL(response.data)
                setImagemAntes(antesObjectUrl)
            }
            if (chamado?.fotoDepoisUrl) {
                const response = await api.get(chamado.fotoDepoisUrl, { responseType: "blob" })
                const depoisObjectUrl = URL.createObjectURL(response.data)
                setImagemDepois(depoisObjectUrl)
            }
        }
        fetchImages()
    }, [chamado])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDENTE":
                return "bg-yellow-100 text-yellow-800"
            case "EM_ANDAMENTO":
                return "bg-blue-100 text-blue-800"
            case "CONCLUÍDO":
                return "bg-green-100 text-green-800"
            default:
                return ""
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    Acompanhar
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-xl">{chamado.titulo}</DialogTitle>
                            <DialogDescription className="mt-2">{chamado.descricao}</DialogDescription>
                        </div>
                        <Badge className={getStatusColor(chamado.status)}>{chamado.status.replace("_", " ")}</Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {(hasFotoAntes || hasFotoDepois) && (
                        <div className="space-y-4">
                            <h3 className="font-semibold">Fotos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {hasFotoAntes && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Antes</p>
                                        <img
                                            src={imagemAntes || ""}
                                            alt="Foto antes"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                                {hasFotoDepois && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Depois</p>
                                        <img
                                            src={imagemDepois || ""}
                                            alt="Foto depois"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {chamado.historicos && chamado.historicos.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold">Histórico de Atualizações</h3>
                            <div className="space-y-3">
                                {chamado.historicos.map((historico) => (
                                    <Card key={historico.id}>
                                        <CardContent className="pt-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium">Atualizado para {historico.statusNovo}</p>
                                                    <p className="text-sm text-muted-foreground">{historico.dataModificacao}</p>
                                                    {historico.observacao && <p className="text-sm">{historico.observacao}</p>}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {chamado.avaliacao && (
                        <div className="space-y-4">
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-3">Sua Avaliação</h3>
                                <Card>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{chamado.avaliacao.estrelas} estrelas</span>
                                        </div>
                                        {chamado.avaliacao.comentario && (
                                            <p className="text-sm text-muted-foreground">{chamado.avaliacao.comentario}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
