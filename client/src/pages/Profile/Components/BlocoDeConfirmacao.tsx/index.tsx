import { Button } from '@/components/ui/button'
import { DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'

interface ConfirmationDialogProps {
  setConfirmation: (value: boolean) => void
  onConfirm: () => void
}

const BlocoConfirmacao = ({ setConfirmation, onConfirm }: ConfirmationDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={setConfirmation}>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirmar alterações</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja salvar as alterações?</p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmation(false)}>
              Cancelar
            </Button>
            <Button type='button' className='bg-[--cor-primaria2] hover:bg-[#1a6283]' onClick={onConfirm}>
              Confirmar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BlocoConfirmacao