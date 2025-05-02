import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { MapPin } from "lucide-react"

export default function MapSection() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-xl font-bold text-brown">
                    <MapPin className="mr-2 h-5 w-5" />
                    Mapa de Ocorrências
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                        Visualize todas as ocorrências registradas pela cidade.
                    </p>
                </div>
                <div className="flex items-center justify-center bg-muted h-[350px] rounded-md">
                    <div className="text-center">
                        <MapPin className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Mapa será carregado aqui</p>
                        <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">
                            Utilize o mapa para visualizar pontos de interesse, rotas e áreas de cobertura. Você pode adicionar novos
                            pontos, editar existentes ou remover localizações.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}