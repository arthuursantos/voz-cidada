import AppLayout from "@/shared/AppLayout.tsx";
import chamadoService from "@/shared/services/chamadoService.ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import ProgressBar from "@/components/ProgressStepsBar";
import {Input} from "@/components/ui/input.tsx";

export default function ChamadosRefactor() {

    const [createChamadoStep, setCreateChamadoStep] = useState(0);

    return (
        <AppLayout>
            <div>

                <Dialog>
                    <DialogTrigger>
                        <button>Criar chamado</button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crie um novo chamado</DialogTitle>
                            {createChamadoStep === 0 ? "O que está acontecendo?" : "Tirou alguma foto do problema? Envie pra gente."}
                        </DialogHeader>
                        <div className="my-6">
                            <ProgressBar currentStep={createChamadoStep + 1} totalSteps={2}/>
                        </div>
                        <form>
                            {createChamadoStep === 0 ? (
                                <div>
                                    <Input
                                        id="title"
                                        type="text"
                                        required
                                        placeholder="Exemplo: 'Buraco na rua'"
                                    />
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </AppLayout>
    )
}