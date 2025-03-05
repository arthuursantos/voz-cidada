import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {ChevronLeft, ChevronRight, ClipboardCheck, Star} from "lucide-react"

const denuncias = [
    {
        id: 1,
        titulo: "Buraco na Rua Principal",
        descricao: "Buraco grande na via pública que foi reparado em 3 dias.",
        avaliacao: 5,
        data: "10/04/2024",
        imagem: "https://placehold.co/400",
    },
    {
        id: 2,
        titulo: "Iluminação Pública Defeituosa",
        descricao: "Poste com lâmpada queimada que foi substituída em 5 dias.",
        avaliacao: 4,
        data: "15/04/2024",
        imagem: "https://placehold.co/400",
    },
    {
        id: 3,
        titulo: "Lixo Acumulado",
        descricao: "Lixo acumulado na praça central que foi removido em 2 dias.",
        avaliacao: 5,
        data: "20/04/2024",
        imagem: "https://placehold.co/400",
    },
]

export default function ReportsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % denuncias.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + denuncias.length) % denuncias.length)
    }

    const denuncia = denuncias[currentIndex]

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl font-bold text-brown">
                    <ClipboardCheck className="mr-2 h-5 w-5"/>
                    Denúncias Concluídas
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-[calc(100%-5rem)]">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="flex items-center justify-center">
                        <div className="relative w-full h-[120px] sm:h-[180px] rounded-md overflow-hidden">
                            <img
                                src={denuncia.imagem || "/placeholder.svg"}
                                alt={`Imagem da denúncia: ${denuncia.titulo}`}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                Antes da resolução
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 truncate">{denuncia.titulo}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                            {denuncia.descricao}
                        </p>
                        <div className="flex items-center mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm mr-1 sm:mr-2">Avaliação:</span>
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 sm:h-4 sm:w-4 ${i < denuncia.avaliacao ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Concluída em: {denuncia.data}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="icon" onClick={prevSlide} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Anterior</span>
                    </Button>
                    <div className="text-xs text-muted-foreground">
                        {currentIndex + 1} de {denuncias.length}
                    </div>
                    <Button variant="outline" size="icon" onClick={nextSlide} className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Próximo</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}