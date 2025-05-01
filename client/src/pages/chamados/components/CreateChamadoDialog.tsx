import { useState, useRef, useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import api from "@/shared/axios.ts"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import ProgressBar from "@/components/ProgressStepsBar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, Camera, Upload, X } from "lucide-react"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const detailsFormSchema = z.object({
    titulo: z.string().min(1, "O título é obrigatório"),
    descricao: z.string().min(1, "A descrição é obrigatória"),
})

const photoFormSchema = z.object({
    foto: z
        .instanceof(File)
        .refine(file => file.size <= MAX_FILE_SIZE, "Arquivo deve ter no máximo 5MB")
        .refine(
            file => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Apenas JPG, PNG e WebP são aceitos"
        )
        .optional(),
})

const chamadoFormSchema = detailsFormSchema.merge(photoFormSchema)
type ChamadoFormValues = z.infer<typeof chamadoFormSchema>

interface CreateChamadoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function CreateChamadoDialog({ open, onOpenChange, onSuccess }: CreateChamadoDialogProps) {
    const [step, setStep] = useState(0)
    const [fotoPreview, setFotoPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user } = useContext(AuthContext)

    const form = useForm<ChamadoFormValues>({
        resolver: zodResolver(step === 0 ? detailsFormSchema : chamadoFormSchema),
        defaultValues: {
            titulo: "",
            descricao: "",
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]

            // Validate file size and type
            if (file.size > MAX_FILE_SIZE) {
                toast("Erro", { description: "Arquivo deve ter no máximo 5MB" })
                return
            }

            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast("Erro", { description: "Apenas JPG, PNG e WebP são aceitos" })
                return
            }

            form.setValue("foto", file)

            const reader = new FileReader()
            reader.onload = (event) => {
                setFotoPreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveFoto = () => {
        form.setValue("foto", undefined)
        setFotoPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleNext = async () => {
        const result = await form.trigger(["titulo", "descricao"])
        if (result) {
            setStep(1)
        }
    }

    const handleBack = () => {
        setStep(0)
    }

    const onSubmit = async (values: ChamadoFormValues) => {
        try {
            setIsSubmitting(true)

            const formData = new FormData()
            formData.append("titulo", values.titulo)
            formData.append("descricao", values.descricao || "")
            formData.append("usuarioId", user?.id.toString() || "")
            formData.append("status", "PENDENTE")

            if (values.foto) {
                formData.append("fotoAntesFile", values.foto)
            }

            await api.post("/api/chamado/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            toast("Sucesso", {
                description: "Chamado criado com sucesso!",
            })

            form.reset()
            setFotoPreview(null)
            setStep(0)
            onOpenChange(false)

            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error("Erro ao criar chamado:", error)
            toast("Erro", {
                description: "Não foi possível criar o chamado. Tente novamente.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            form.reset()
            setFotoPreview(null)
            setStep(0)
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[500px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle className="tracking-wider text-primary uppercase">Novo Chamado</DialogTitle>
                            <DialogDescription>
                                {step === 0 ? "O que está acontecendo?" : "Tirou alguma foto do problema? Envie pra gente."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="my-6">
                            <ProgressBar currentStep={step + 1} totalSteps={2} />
                        </div>

                        <div className="grid gap-8 py-4">
                            {step === 0 ? (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="titulo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-teal">
                                                    Qual é o assunto da sua solicitação?
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Exemplo: 'Buraco na rua'"
                                                        className="border-teal/30 focus-visible:ring-teal"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="descricao"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-teal">
                                                    Dê mais detalhes sobre sua solicitação.
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Descreva o problema ou solicitação"
                                                        className="min-h-[100px] border-teal/30 focus-visible:ring-teal"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="foto"
                                    render={() => (
                                        <FormItem className="mb-8">
                                            <FormLabel className="text-teal">Foto do Problema</FormLabel>
                                            <FormControl>
                                                {fotoPreview ? (
                                                    <div className="relative mt-2 rounded-md overflow-hidden border border-teal/30">
                                                        <img
                                                            src={fotoPreview}
                                                            alt="Preview"
                                                            className="w-full h-auto max-h-[200px] object-contain"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                            onClick={handleRemoveFoto}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-4">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="border-teal text-teal hover:bg-teal hover:text-white"
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            <Upload className="mr-2 h-4 w-4" />
                                                            Selecionar arquivo
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="border-teal text-teal hover:bg-teal hover:text-white"
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            <Camera className="mr-2 h-4 w-4" />
                                                            Tirar foto
                                                        </Button>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={handleFileChange}
                                                            accept="image/*"
                                                            className="hidden"
                                                        />
                                                    </div>
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <DialogFooter>
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    {step === 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleBack}
                                            className="text-teal hover:text-teal/90 hover:bg-teal/10"
                                        >
                                            <ArrowLeft className="h-5 w-5 mr-2" />
                                            Voltar
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleDialogClose(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    {step === 0 ? (
                                        <Button
                                            type="button"
                                            className="bg-teal hover:bg-teal/90"
                                            onClick={handleNext}
                                            disabled={isSubmitting}
                                        >
                                            Avançar
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="bg-teal hover:bg-teal/90"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Enviando..." : "Enviar Chamado"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}