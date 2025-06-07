// "use client"

// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { z } from "zod"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import uploadService from "@/shared/services/uploadService.ts"
// import { useContext, useState } from "react"
// import { AuthContext } from "@/contexts/AuthContext.tsx"
// import ProgressBar from "@/components/ProgressStepsBar";
// import { Plus, ArrowRight, ArrowLeft, Upload } from "lucide-react"
// import chamadoService from "@/shared/services/chamadoService.ts";

// export default function CreateChamadoDialog() {
//     const { user } = useContext(AuthContext)
//     const [isOpen, setIsOpen] = useState(false)
//     const [currentStep, setCurrentStep] = useState(1)
//     const totalSteps = 2

//     const createChamadoSchema = z.object({
//         titulo: z.string().min(1, "O título é obrigatório"),
//         descricao: z.string().min(1, "A descrição é obrigatória"),
//         fotoAntesFile: z.any().refine((files) => files?.length === 1, "A foto é obrigatória"),
//     })
//     type CreateChamadoFields = z.infer<typeof createChamadoSchema>

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//         watch,
//         trigger,
//     } = useForm<CreateChamadoFields>({
//         resolver: zodResolver(createChamadoSchema),
//         defaultValues: {
//             titulo: "",
//             descricao: "",
//         },
//     })

//     const watchedFields = watch()

//     async function onSubmit(data: CreateChamadoFields) {


//         const imageFormData = new FormData()
//         imageFormData.append("image", data.fotoAntesFile[0])
//         const { data: fotoAntesUrl } = await uploadService.saveImage(imageFormData)
//         await chamadoService.create({
//             usuarioId: user?.id,
//             titulo: data.titulo,
//             descricao: data.descricao,
//             status: "PENDENTE",
//             fotoAntesUrl: fotoAntesUrl,
//         })

//         reset()
//         setCurrentStep(1)
//         setIsOpen(false)
//     }

//     const handleNextStep = async () => {
//         const isStep1Valid = await trigger(["titulo", "descricao"])
//         if (isStep1Valid) {
//             setCurrentStep(2)
//         }
//     }

//     const handlePrevStep = () => {
//         setCurrentStep(1)
//     }

//     const handleClose = () => {
//         setIsOpen(false)
//         setCurrentStep(1)
//         reset()
//     }

//     return (
//         <Dialog open={isOpen} onOpenChange={(open) => {
//             setIsOpen(open);
//             if (!open) {
//                 handleClose();
//             }
//         }}>
//             <DialogTrigger asChild>
//                 <Button>
//                     <Plus className="h-4 w-4" />
//                     Criar Chamado
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                     <DialogTitle>Criar novo chamado</DialogTitle>
//                     <DialogDescription>
//                         {currentStep === 1 ? "Descreva o problema ou solicitação" : "Adicione uma foto para ilustrar o problema"}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-6">
//                     <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         {currentStep === 1 && (
//                             <div className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="titulo">Título do Chamado</Label>
//                                     <Input id="titulo" type="text" placeholder="Ex: Buraco na rua" {...register("titulo")} />
//                                     {errors.titulo && <p className="text-sm text-destructive">{errors.titulo.message}</p>}
//                                 </div>

//                                 <div className={"space-y-2"}>
//                                     <Label htmlFor="descricao">Descrição</Label>
//                                     <Textarea
//                                         id="descricao"
//                                         placeholder="Descreva detalhadamente o problema ou solicitação"
//                                         className="min-h-[100px]"
//                                         {...register("descricao")}
//                                     />
//                                     {errors.descricao && <p className="text-sm text-destructive">{errors.descricao.message}</p>}
//                                 </div>

//                                 <div className="flex justify-end">
//                                     <Button
//                                         type="button"
//                                         onClick={handleNextStep}
//                                         disabled={!watchedFields.titulo || !watchedFields.descricao}
//                                     >
//                                         Próxima Etapa
//                                         <ArrowRight className="h-4 w-4 ml-2" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         )}

//                         {currentStep === 2 && (
//                             <div className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="fotoAntesFile">Foto do Problema</Label>
//                                     <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
//                                         <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
//                                         <Input
//                                             id="fotoAntesFile"
//                                             type="file"
//                                             accept="image/*"
//                                             className="cursor-pointer"
//                                             {...register("fotoAntesFile")}
//                                         />
//                                         <p className="text-sm text-muted-foreground mt-2">Selecione uma imagem que ilustre o problema</p>
//                                     </div>
//                                     {errors.fotoAntesFile && <p className="text-sm text-destructive">{errors.fotoAntesFile.message}</p>}
//                                 </div>

//                                 <div className="flex justify-between">
//                                     <Button type="button" variant="outline" onClick={handlePrevStep}>
//                                         <ArrowLeft className="h-4 w-4 mr-2" />
//                                         Voltar
//                                     </Button>
//                                     <Button type="submit">Criar Chamado</Button>
//                                 </div>
//                             </div>
//                         )}
//                     </form>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }
