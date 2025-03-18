import { Button } from '@/components/ui/button'
import { DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'

interface ConfirmationDialogProps {
    setConfirmation: (value: boolean) => void
  }

const BlocoConfirmacao = ({setConfirmation}: ConfirmationDialogProps) => {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar alterações</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Tem certeza que deseja salvar as alterações?</p>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={(e) => {
            e.preventDefault()
            setConfirmation(false)
        }}>
            Cancelar
          </Button>
          <Button type='submit'>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BlocoConfirmacao
