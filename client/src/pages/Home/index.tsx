import AppLayout from "@/shared/AppLayout.tsx";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ChamadosCarousel from "./components/ReportsCarousel.tsx";

export default function Home() {
    return (
        <AppLayout>
            <div className="container mx-auto py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium tracking-wider text-primary uppercase">SOBRE NÓS</h2>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                            Capacitando cidadãos para <span className={"text-teal/80"}>transformar</span> suas comunidades.
                        </h1>
                        <p className="text-lg text-gray-600 max-w-lg">
                            Voz Cidadã é uma plataforma focada em participação cívica e comunicação comunitária para equipes
                            municipais. Nosso objetivo é trazer cidadãos e comunidades em nossa plataforma para conectar,
                            comunicar e colaborar em iniciativas que geram impacto real.
                        </p>
                        <Link to="/chamados">
                            <Button size="lg" className="mt-4 bg-teal hover:bg-teal/90">
                                Participe agora
                            </Button>
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-full overflow-hidden bg-primary/10 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/20 rounded-full"></div>
                            <img
                                src="https://placehold.co/900"
                                alt="Cidadãos colaborando em uma comunidade"
                                className="object-cover w-full h-full rounded-full"
                            />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full"></div>
                            <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/20 rounded-full"></div>
                        </div>
                        <div className="absolute -z-10 bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto py-20">
                <ChamadosCarousel/>
            </div>
        </AppLayout>
    )
}