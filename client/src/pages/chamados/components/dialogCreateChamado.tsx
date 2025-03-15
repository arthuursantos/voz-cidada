import { useState, useRef, useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import api from "@/lib/axios"
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
import { Camera, Upload, X } from "lucide-react"

interface NovoChamadoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function DialogCreateChamado({ open, onOpenChange, onSuccess }: NovoChamadoDialogProps) {
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
            formData.append('status', 'PENDENTE');

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

            // Reset form
            setTitulo("")
            setDescricao("")
            setFotoAntesFile(null)
            setFotoPreview(null)

            // Close dialog
            onOpenChange(false)

            // Refresh chamados list if callback provided
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-teal">Novo Chamado</DialogTitle>
                        <DialogDescription>Preencha os campos abaixo para abrir um novo chamado.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="titulo" className="text-teal">
                                Título
                            </Label>
                            <Input
                                id="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Digite o título do chamado"
                                className="border-teal/30 focus-visible:ring-teal"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="descricao" className="text-teal">
                                Descrição
                            </Label>
                            <Textarea
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Descreva o problema ou solicitação"
                                className="min-h-[100px] border-teal/30 focus-visible:ring-teal"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-teal">Foto</Label>

                            {fotoPreview ? (
                                <div className="relative mt-2 rounded-md overflow-hidden border border-teal/30">
                                    <img
                                        src={fotoPreview || "/placeholder.svg"}
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
                                        onClick={() => {
                                            fileInputRef.current?.click()
                                        }}
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
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-teal hover:bg-teal/90" disabled={isSubmitting}>
                            {isSubmitting ? "Enviando..." : "Enviar Chamado"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

