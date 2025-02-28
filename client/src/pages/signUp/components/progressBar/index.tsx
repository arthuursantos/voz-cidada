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
                    className="h-full rounded-full bg-[--cor-primaria2] transition-all duration-300 ease-in-out"
                    style={{width: `${progress}%`}}
                />
            </div>
            <div className="mt-2 text-sm text-[#504136]/70">
                Etapa {currentStep} de {totalSteps}
            </div>
        </div>
    )
}