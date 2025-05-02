import { useState, useRef, useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

import ProgressBar from "@/components/progressBar/index.tsx"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, Camera, Upload, X } from "lucide-react"
import api from "@/shared/axios"

interface NovoChamadoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function DialogCreateChamado({ open, onOpenChange, onSuccess }: NovoChamadoDialogProps) {
    const [step, setStep] = useState(0)
    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [fotoAntesFile, setFotoAntesFile] = useState<File | null>(null)
    const [fotoPreview, setFotoPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { user } = useContext(AuthContext)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFotoAntesFile(file)

            const reader = new FileReader()
            reader.onload = (event) => {
                setFotoPreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveFoto = () => {
        setFotoAntesFile(null)
        setFotoPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (step === 0) {
            if (!titulo.trim()) {
                toast("Erro", {
                    description: "O título é obrigatório",
                })
                return
            }
            setStep(1)
        }
    }

    const handleBack = () => {
        setStep(0)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!titulo.trim()) {
            toast("Erro", {
                description: "O título é obrigatório",
            })
            return
        }

        try {
            setIsSubmitting(true)

            const formData = new FormData()
            formData.append("titulo", titulo)
            formData.append("descricao", descricao)
            formData.append("usuarioId", user?.id.toString() || "")
            formData.append('status', 'PENDENTE')

            if (fotoAntesFile) {
                formData.append("fotoAntesFile", fotoAntesFile)
            }

            await api.post("/api/chamado/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            toast("Sucesso", {
                description: "Chamado criado com sucesso!",
            })

            setTitulo("")
            setDescricao("")
            setFotoAntesFile(null)
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
            setStep(0)
            setTitulo("")
            setDescricao("")
            setFotoAntesFile(null)
            setFotoPreview(null)
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={step === 0 ? handleNext : handleSubmit}>
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
                                <div className="grid gap-2">
                                    <Label htmlFor="titulo" className="text-teal">
                                        Qual é o assunto da sua solicitação?
                                    </Label>
                                    <Input
                                        id="titulo"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        placeholder="Exemplo: 'Buraco na rua'"
                                        className="border-teal/30 focus-visible:ring-teal"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="descricao" className="text-teal">
                                        Dê mais detalhes sobre sua solicitação.
                                    </Label>
                                    <Textarea
                                        id="descricao"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        placeholder="Descreva o problema ou solicitação"
                                        className="min-h-[100px] border-teal/30 focus-visible:ring-teal"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="grid gap-2 mb-8">
                                <Label className="text-teal">Foto do Problema</Label>

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
                            </div>
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
                                <Button
                                    type="submit"
                                    className="bg-teal hover:bg-teal/90"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Enviando..."
                                        : step === 0
                                            ? "Avançar"
                                            : "Enviar Chamado"}
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
