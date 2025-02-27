import {useContext, useState} from "react";
import ProgressBar from "@/pages/signUp/components/progressBar";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft} from "lucide-react";
import api from "@/lib/axios.ts";
import {AuthContext} from "@/contexts/AuthContext.tsx";

export default function SignUp() {
    const { signIn } = useContext(AuthContext)
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        birthDate: "",
        cep: "",
        cpf: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        setStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setStep((prev) => prev - 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await api.post(`/auth/register`, {
            login: formData.email,
            password: formData.password,
            role: "USER"
        })
        await api.post(`/api/usuario`, {
            nome: formData.name,
            dataNascimento: formData.birthDate,
            cpf: formData.cpf,
            cep: formData.cep,
            rua: "Rua",
            numero: "N",
            bairro: "Bairro",
            complemento: "Complemento",
            cidade: "Cidada",
            uf: "UF",
            dataCadastro: "datetime"
        })
        await signIn({
            login: formData.email,
            password: formData.password
        })
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

                        <form onSubmit={step === 2 ? handleSubmit : handleNext} className="space-y-6">
                            {step === 0 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#504136]">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
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
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-[#504136]">
                                            Confirmar Senha
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
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
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="João da Silva"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="birthDate" className="text-[#504136]">
                                            Data de Nascimento
                                        </Label>
                                        <Input
                                            id="birthDate"
                                            name="birthDate"
                                            type="date"
                                            required
                                            value={formData.birthDate}
                                            onChange={handleInputChange}
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="cep" className="text-[#504136]">
                                                CEP
                                            </Label>
                                            <Input
                                                id="cep"
                                                name="cep"
                                                required
                                                value={formData.cep}
                                                onChange={handleInputChange}
                                                placeholder="00000-000"
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cpf" className="text-[#504136]">
                                                CPF
                                            </Label>
                                            <Input
                                                id="cpf"
                                                name="cpf"
                                                required
                                                value={formData.cpf}
                                                onChange={handleInputChange}
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