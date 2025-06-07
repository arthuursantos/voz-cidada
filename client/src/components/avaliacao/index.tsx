import { z } from 'zod'
import { Textarea } from '../ui/textarea'
import Rating from '@mui/material/Rating'
import { Button } from '../ui/button'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvaliacaoInterface } from '@/shared/types'
import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import avaliacaoService from '@/shared/services/avaliacaoService'
import {toast} from "react-hot-toast";

interface AvaliacaoAreaProps {
  id: number
  atualizarChamado: () => void
}

const AvaliacaoArea = ({ id, atualizarChamado }: AvaliacaoAreaProps) => {
  const [isloading, setIsLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const { user } = useContext(AuthContext)
  const AvaliacaoSchema = z.object({
    avaliacao: z.number(),
    comentario: z.string().optional()
  })

  type AvaliacaoData = z.infer<typeof AvaliacaoSchema>

  const { register, handleSubmit, control } = useForm<AvaliacaoData>({
    resolver: zodResolver(AvaliacaoSchema),
    defaultValues: {
      avaliacao: 3,
    }
  });

  const handleSubmitAvaliacao: SubmitHandler<AvaliacaoData> = async (data) => {  
    console.log("passando aqui antes de validar se usuario existe");
    if (!user) return 
    console.log("passando aqui depois de validar se usuario existe", user)

    const dataAvaliacao = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
    const avaliacao: AvaliacaoInterface = {
        chamadoId: id,
        usuarioId: user?.id,
        estrelas: data.avaliacao,
        comentario: data.comentario === "" ? null : data.comentario,
        dataAvaliacao: dataAvaliacao
    }

    await toast.promise(
      async () => {
        console.log("passando aqui antes de criar a avaliação", avaliacao);
        try {
          setIsLoading(true)
          await avaliacaoService.create(avaliacao)
          atualizarChamado()
          setEnviado(true)
          console.log("passando aqui depois de criar a avaliação");
        } finally {
           setIsLoading(false)
        } 
      },
      {
        loading: 'Enviando avaliação...',
        success: 'Avaliação enviada com sucesso!',
        error:`Houve um erro ao enviar avaliação!`
      },
    );
  }

  return (
    <div className="mt-6">
      <hr className="my-4 bg-black" />
      <h3 className="text-sm text-[--cor-primaria] font-bold font-montserrat mb-2">Deixe sua avaliação!</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Sua opinião é muito importante para nós. Avalie o atendimento e deixe um comentário.
      </p>
      <form onSubmit={handleSubmit(handleSubmitAvaliacao)}>
        <Controller
          control={control}
          name="avaliacao"
          render={({ field }) => (
            <Rating
              {...field}
              value={field.value}
              onChange={(_, value) => field.onChange(value ?? 0)} // garante número
              precision={1}
              readOnly={enviado}
            />
          )}
        />
        <Textarea
          {...register('comentario')}
          className="mt-2 bg-white"
          placeholder="Deixe sua Avaliação"
          rows={5}
          disabled={enviado}
        />
        <Button
          type="submit"
          className="flex text-[--cor-primaria] mt-3 bg-white border border-[--cor-primaria] hover:border-[--cor-primaria2] hover:bg-[--cor-primaria2] hover:text-white justify-self-end"
          disabled={enviado || isloading}
          onLoad={() => setIsLoading(true)}
        >
          Enviar Avaliação
        </Button>
      </form>
    </div>
  )
}

export default AvaliacaoArea
