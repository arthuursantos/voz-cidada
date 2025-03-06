interface ProgressBarProps {
    currentStep: number,
    totalSteps: number
}

export default function ProgressBar({currentStep, totalSteps}: ProgressBarProps) {
    const progress = (currentStep/totalSteps)*100
    return (
        <div className="w-full">
            <div className="h-2 w-full rounded-full bg-[#504136]/20">
                <div
<<<<<<< HEAD
                    className="h-full rounded-full bg-[--cor-primaria2] transition-all duration-300 ease-in-out"
=======
                    className="h-full rounded-full bg-[#689689] transition-all duration-300 ease-in-out"
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                    style={{width: `${progress}%`}}
                />
            </div>
            <div className="mt-2 text-sm text-[#504136]/70">
                Etapa {currentStep} de {totalSteps}
            </div>
        </div>
    )
}