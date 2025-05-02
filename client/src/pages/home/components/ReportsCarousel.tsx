"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, Star } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Chamado = {
    id: number
    titulo: string
    descricao: string
    data: string
    status: string
    avaliacao: number
    imagem: string
}

const chamadosMock: Chamado[] = [
    {
        id: 1,
        titulo: "Reparo de calçada na Rua das Flores",
        descricao: "Calçada danificada foi reparada em tempo recorde pela equipe municipal.",
        data: "15/02/2025",
        status: "Concluído",
        avaliacao: 5,
        imagem: "https://i.pinimg.com/236x/a7/02/6a/a7026acccaa4195d4c2b080010c6af35.jpg",
    },
    {
        id: 2,
        titulo: "Iluminação pública na Praça Central",
        descricao: "Substituição de lâmpadas queimadas e instalação de novos postes de luz.",
        data: "28/02/2025",
        status: "Concluído",
        avaliacao: 4,
        imagem: "https://media.istockphoto.com/id/1483109187/pt/foto/man-outdoor-senior-happy-retirement-elderly-portrait-male-active-park-smiling-old-fun-nature.jpg?s=612x612&w=0&k=20&c=EFnXZb3clSx-L-aXv0ssWD3m46AuWsTOhl8eVEtpWjE=",
    },
    {
        id: 3,
        titulo: "Limpeza do Córrego Municipal",
        descricao: "Remoção de lixo e desobstrução do canal para evitar enchentes.",
        data: "05/03/2025",
        status: "Concluído",
        avaliacao: 5,
        imagem: "https://i.pinimg.com/236x/77/d2/7d/77d27d7bfdfadf1bd295c58f067bba66.jpg",
    },
]

export default function ChamadosCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === chamadosMock.length - 1 ? 0 : prevIndex + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? chamadosMock.length - 1 : prevIndex - 1))
    }

    const chamado = chamadosMock[currentIndex]

    return (
        <Card className="h-full overflow-hidden">
            <CardContent className="p-0">
                <div className="grid md:grid-cols-2 grid-cols-1 min-h-[500px]">
                    {/* Lado direito - Título chamativo (aparece primeiro em telas pequenas) */}
                    <div className="bg-teal text-black flex flex-col justify-center items-center p-6 relative overflow-hidden min-h-[250px] md:order-2 order-1">
                        <div className="absolute top-0 right-0 w-32 h-32 text-black/80 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 text-black/80 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <h2 className="text-3xl font-bold text-center mb-4 relative z-10 text-[--cor-primaria]">Chamados Concluídos</h2>
                        <p className="text-center text-black/80 mb-6 relative z-10">
                            Veja como estamos transformando nossa cidade com a participação dos cidadãos
                        </p>

                        <div className="flex justify-center items-center gap-4 relative z-10">
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={prevSlide}
                                className="h-8 w-8 rounded-full bg-[--cor-primaria] border-[--cor-primaria] hover:bg-[--cor-primaria2] hover:border-none hover:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Anterior</span>
                            </Button>
                            <div className="text-sm text-black/80">
                                {currentIndex + 1} de {chamadosMock.length}
                            </div>
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={nextSlide}
                                className="h-8 w-8 rounded-full bg-[--cor-primaria] border-[--cor-primaria] hover:bg-[--cor-primaria2] hover:text-white"
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Próximo</span>
                            </Button>
                        </div>
                    </div>

                    {/* Lado esquerdo - Informações (aparece segundo em telas pequenas) */}
                    <div className="p-6 flex flex-col md:justify-center justify-between h-full md:order-1 order-2">
                        <div className="max-w-sm mx-auto">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-teal px-2 py-1 rounded-full bg-teal/10">
                                  {chamado.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{chamado.titulo}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{chamado.descricao}</p>

                            {/* Informações agrupadas */}
                            <div className="space-y-4">
                                {/* Data acima da avaliação */}
                                <div className="text-sm text-gray-500">{chamado.data}</div>

                                <div className="flex items-center">
                                    <span className="text-sm mr-2">Avaliação:</span>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < chamado.avaliacao ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full text-[--cor-primaria] border-[--cor-primaria] hover:border-none hover:bg-[--cor-primaria2] hover:text-white">
                                            <Eye className="mr-2 h-4 w-4 " />
                                            Ver foto do problema
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>{chamado.titulo}</DialogTitle>
                                            <DialogDescription>Foto do problema antes da resolução</DialogDescription>
                                        </DialogHeader>
                                        <div className="relative w-full" style={{aspectRatio: '9/16'}}>
                                            <img
                                                src={chamado.imagem || "/placeholder.svg"}
                                                alt={`Imagem do chamado: ${chamado.titulo}`}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}