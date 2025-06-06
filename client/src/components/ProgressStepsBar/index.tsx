interface ProgressBarProps {
    currentStep: number
    totalSteps: number
}

export default function ProgressBar({currentStep, totalSteps}: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Etapa {currentStep} de {totalSteps}
                </span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-full rounded-full transition-all bg-[--cor-primaria2] duration-300 ease-in-out" style={{width: `${progress}%`}}/>
            </div>
        </div>
    )
}
