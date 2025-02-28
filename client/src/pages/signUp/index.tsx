import {useContext, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form"
import ProgressBar from "@/pages/signUp/components/progressBar";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft} from "lucide-react";
import {SignUpData} from "@/contexts/AuthContext.tsx";
import {AuthContext} from "@/contexts/AuthContext.tsx";

export default function SignUp() {
    const { signUp } = useContext(AuthContext)
    const { register, handleSubmit } = useForm<SignUpData>()
    const [step, setStep] = useState(0)

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        setStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setStep((prev) => prev - 1)
    }

    const handleSignUp: SubmitHandler<SignUpData> = async (data) => {
        await signUp(data)
    }

    return (
        <div className="flex min-h-screen w-full items-center bg-[url('/grid.svg')] bg-center py-20">
            <div className="mx-auto max-w-xl w-full px-4">
                <div className="relative rounded-xl border bg-background p-8 shadow-2xl">
                    <div className="mb-8">
                        <ProgressBar currentStep={step + 1} totalSteps={3} />
                    </div>

                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-[#504136]">Crie sua conta</h1>
                            <p className="mt-2 text-[#504136]/70">
                                {step === 0
                                    ? "Etapa 1: Informe seu email"
                                    : step === 1
                                        ? "Etapa 2: Crie uma senha segura"
                                        : "Etapa 3: Complete seu cadastro"}
                            </p>
                        </div>

                        <form onSubmit={step === 2 ? handleSubmit(handleSignUp) : handleNext} className="space-y-6">
                            {step === 0 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#504136]">
                                            Email
                                        </Label>
                                        <Input
                                            {...register('email')}
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="seu@email.com"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[#504136]">
                                            Senha
                                        </Label>
                                        <Input
                                            {...register('password')}
                                            id="password"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-[#504136]">
                                            Confirmar Senha
                                        </Label>
                                        <Input
                                            {...register('confirmPassword')}
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[#504136]">
                                            Nome completo
                                        </Label>
                                        <Input
                                            {...register('name')}
                                            id="name"
                                            required
                                            placeholder="João da Silva"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="birthDate" className="text-[#504136]">
                                            Data de Nascimento
                                        </Label>
                                        <Input
                                            {...register('birthDate')}
                                            id="birthDate"
                                            type="date"
                                            required
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="cep" className="text-[#504136]">
                                                CEP
                                            </Label>
                                            <Input
                                                {...register('cep')}
                                                id="cep"
                                                required
                                                placeholder="00000-000"
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cpf" className="text-[#504136]">
                                                CPF
                                            </Label>
                                            <Input
                                                {...register('cpf')}
                                                id="cpf"
                                                required
                                                placeholder="000.000.000-00"
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between space-x-4">
                                <div>
                                    {step > 0 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleBack}
                                            className="text-[#504136] hover:text-[#504136]/90 hover:bg-[#504136]/10"
                                        >
                                            <ArrowLeft className="h-5 w-5 mr-2" />
                                            Voltar
                                        </Button>
                                    )}
                                </div>
                                <Button type="submit" className="bg-[#689689] hover:bg-[#689689]/90 text-white px-8">
                                    {step === 2 ? "Criar conta" : "Avançar"}
                                </Button>
                            </div>
                        </form>

                        <div className="flex justify-end">
                            <p className="text-sm text-[#504136]/70">
                                Já tem uma conta?{" "}
                                <a href="/login" className="text-[#689689] hover:underline">
                                    Faça login aqui
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}