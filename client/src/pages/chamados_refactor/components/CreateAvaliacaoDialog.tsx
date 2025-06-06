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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import avaliacaoService from "@/shared/services/avaliacaoService.ts"
import { AuthContext } from "@/contexts/AuthContext.tsx"
import { Star } from "lucide-react"
import {ChamadoInterface} from "@/shared/types.ts";

export default function CreateAvaliacaoDialog({ chamado }: {chamado: ChamadoInterface}) {
    const { user } = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const createAvaliacaoSchema = z.object({
        estrelas: z
            .number()
            .int("Estrelas devem ser um número inteiro.")
            .min(1, "Selecione pelo menos 1 estrela.")
            .max(5, "O número de estrelas não pode ser maior que 5."),
        comentario: z.string().optional(),
    })
    type createAvaliacaoFields = z.infer<typeof createAvaliacaoSchema>

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<createAvaliacaoFields>({
        resolver: zodResolver(createAvaliacaoSchema),
        defaultValues: {
            estrelas: 0,
            comentario: "",
        },
    })

    async function onSubmit(data: createAvaliacaoFields) {
        await avaliacaoService.create({
            ...data,
            chamadoId: chamado.id,
            usuarioId: user?.id,
            dataAvaliacao: new Date().toISOString().slice(0, 19).replace("T", " "),
        })
        reset()
        setRating(0)
        setIsOpen(false)
    }

    const handleStarClick = (starValue: number) => {
        setRating(starValue)
        setValue("estrelas", starValue)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <Star className="h-4 w-4" />
                    Avaliar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Avalie o Atendimento</DialogTitle>
                    <DialogDescription>Como foi o processo de resolução do seu problema?</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-3">
                        <Label>Classificação</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="p-1 hover:scale-110 transition-transform"
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {errors.estrelas && <p className="text-sm text-destructive">{errors.estrelas.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comentario">Comentário (opcional)</Label>
                        <Textarea
                            id="comentario"
                            placeholder="Deixe um comentário sobre o atendimento..."
                            {...register("comentario")}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Enviar Avaliação</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
