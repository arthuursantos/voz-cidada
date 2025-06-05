// "use client"

// import AppLayout from "@/shared/AppLayout.tsx"
// import { useContext, useEffect, useState } from "react"
// import { AuthContext } from "@/contexts/AuthContext.tsx"
// import chamadoService from "@/shared/services/chamadoService.ts"
// import type { ChamadoInterface, PageInfoInterface } from "@/shared/types.ts"
// import CreateChamadoDialog from "@/pages/chamados_refactor/components/CreateChamadoDialog.tsx"
// import GetChamadoDialog from "@/pages/chamados_refactor/components/GetChamadoDialog.tsx"
// import CreateAvaliacaoDialog from "@/pages/chamados_refactor/components/CreateAvaliacaoDialog.tsx"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight, FileText } from "lucide-react"

// export default function Chamados() {
//     const { user, loading } = useContext(AuthContext)

//     const [currentPage, setCurrentPage] = useState(0)
//     const [pageable, setPageable] = useState<PageInfoInterface>({
//         totalPages: 0,
//         totalElements: 0,
//     })
//     const [chamados, setChamados] = useState<ChamadoInterface[]>()

//     useEffect(() => {
//         async function getChamados() {
//             if (!loading) {
//                 const response = await chamadoService.findByUserId({ userId: user?.id, page: currentPage })
//                 const {
//                     _embedded: { chamadoDTOList },
//                     page: pageData,
//                 } = response.data
//                 setChamados(chamadoDTOList)
//                 setPageable({
//                     totalElements: pageData.totalElements,
//                     totalPages: pageData.totalPages,
//                 })
//                 return
//             }
//         }

//         getChamados()
//     }, [loading, currentPage])

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case "PENDENTE":
//                 return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
//             case "EM_ANDAMENTO":
//                 return "bg-blue-100 text-blue-800 hover:bg-blue-200"
//             case "CONCLUÍDO":
//                 return "bg-green-100 text-green-800 hover:bg-green-200"
//             default:
//                 return ""
//         }
//     }

//     return (
//         <AppLayout>
//             <div className="container mx-auto p-6 space-y-6">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-3xl font-bold tracking-tight">Meus chamados</h1>
//                         <p className="text-muted-foreground">Gerencie e acompanhe seus chamados de serviço</p>
//                     </div>
//                     <CreateChamadoDialog />
//                 </div>

//                 {chamados && chamados.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {chamados.map((chamado) => (
//                             <Card key={chamado.id} className="hover:shadow-md transition-shadow">
//                                 <CardHeader className="pb-3">
//                                     <div className="flex items-start justify-between">
//                                         <div className="space-y-1">
//                                             <CardTitle className="text-lg">{chamado.titulo}</CardTitle>
//                                             <CardDescription className="line-clamp-2">{chamado.descricao}</CardDescription>
//                                         </div>
//                                         <Badge variant="secondary" className={getStatusColor(chamado.status)}>
//                                             {chamado.status.replace("_", " ")}
//                                         </Badge>
//                                     </div>
//                                 </CardHeader>
//                                 <CardContent className="pt-0">
//                                     <div className="flex items-center gap-2">
//                                         <GetChamadoDialog chamado={chamado} />
//                                         {chamado.status === "CONCLUÍDO" && !chamado.avaliacao && (
//                                             <CreateAvaliacaoDialog chamado={chamado} />
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 ) : (
//                     <Card className="text-center py-12">
//                         <CardContent>
//                             <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                             <h3 className="text-lg font-semibold mb-2">Nenhum chamado encontrado</h3>
//                             <p className="text-muted-foreground mb-4">
//                                 Você ainda não possui chamados. Crie seu primeiro chamado para começar.
//                             </p>
//                             <CreateChamadoDialog />
//                         </CardContent>
//                     </Card>
//                 )}

//                 {pageable.totalPages > 1 && (
//                     <div className="flex items-center justify-between">
//                         <Button variant="outline" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
//                             <ChevronLeft className="h-4 w-4 mr-2" />
//                             Página Anterior
//                         </Button>

//                         <span className="text-sm text-muted-foreground">
//               Página {currentPage + 1} de {pageable.totalPages}
//             </span>

//                         <Button
//                             variant="outline"
//                             onClick={() => setCurrentPage(currentPage + 1)}
//                             disabled={currentPage + 1 >= pageable.totalPages}
//                         >
//                             Próxima Página
//                             <ChevronRight className="h-4 w-4 ml-2" />
//                         </Button>
//                     </div>
//                 )}
//             </div>
//         </AppLayout>
//     )
// }
