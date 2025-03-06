<<<<<<< HEAD
import {useContext, useState} from "react";
=======
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
import ProgressBar from "@/pages/signUp/components/progressBar";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
<<<<<<< HEAD
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

    const getCepInfo = async (cep: string) => {
        const response = await api.get(`https://viacep.com.br/ws/${cep}/json/`)
        return response.data;
    }

    const [error, setError] = useState<string | null>(null);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, email: e.target.value }))
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, password: e.target.value }))
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, name: e.target.value }))
    }

    const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
    }

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, cep: validNumericInputs(e.target.value) }))
    }

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, cpf: validNumericInputs(e.target.value) }))
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (step === 1 && !passwordMatch()) {
            return
        }
        setStep((prev) => prev + 1)
=======
import {AuthContext} from "@/contexts/AuthContext.tsx";
import {FormEvent, useContext, useState} from "react";
import {ArrowLeft} from "lucide-react";
import {SubmitHandler, useForm} from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";


export default function SignUp() {
    const { signUp } = useContext(AuthContext)
    const [step, setStep] = useState(0)

    const SignUpSchema = z.object({
        email: z.string()
            .nonempty("O email é obrigatório.")
            .email("Formato de email inválido."),
        password: z.string()
            .min(6, "A senha precisa ter no minímo 6 caracteres."),
        confirmPassword: z.string()
            .min(6, "A confirmação de senha é obrigatória."),
        name: z.string()
            .nonempty("O nome completo é obrigatório")
            .transform(name => {
                return name.trim().split(' ').map((word) => {
                    return word[0].toLocaleUpperCase().concat(word.substring(1))
                }).join(' ')
            }),
        birthDate: z.string()
            .nonempty("A data de nascimento é obrigatória."),
        cep: z.string()
            .nonempty("O CEP é obrigatório.")
            .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido. Use 00000-000 ou 00000000.")
            .transform(cep => {
                return cep.replace(/[^0-9]/g, "");
            }),
        cpf: z.string()
            .nonempty("O CPF é obrigatório.")
            .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido. Use 000.000.000-00 ou 00000000000.")
            .transform(cpf => {
                return cpf.replace(/[^0-9]/g, "");
            }),
    })
        .refine(data => data.password === data.confirmPassword, {
            message: "As senham precisam ser iguais.",
            path: ["confirmPassword"]
        })

    type SignUpData = z.infer<typeof SignUpSchema>

    const { register, handleSubmit, formState: {errors}, trigger } = useForm<SignUpData>({
        resolver: zodResolver(SignUpSchema)
    })

    const handleNext = async (e: FormEvent) => {
        e.preventDefault();
        if (step === 0) {
            const isValid = await trigger("email");
            if (isValid) setStep((prev) => prev + 1);
        } else if (step === 1) {
            const isValid = await trigger(["password", "confirmPassword"]);
            if (isValid) setStep((prev) => prev + 1);
        }
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
    }

    const handleBack = () => {
        setStep((prev) => prev - 1)
    }

<<<<<<< HEAD
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await api.post(`/auth/register`, {
            login: formData.email,
            password: formData.password,
            role: "USER"
        })

        const cepInfo = await getCepInfo(formData.cep);

        await api.post(`/api/usuario`, {
            nome: formData.name,
            dataNascimento: formData.birthDate,
            cpf: formData.cpf,
            cep: formData.cep,
            rua: cepInfo.logradouro,
            numero: null,
            bairro: cepInfo.bairro,
            complemento: cepInfo.complemento,
            cidade: cepInfo.localidade,
            uf: cepInfo.uf,
            dataCadastro: "datetime"
        })
        await signIn({
            login: formData.email,
            password: formData.password
        })
    }

    const validNumericInputs = (value: string): string => {
        return value.replace(/[^0-9]/g, '')
    }

    const passwordMatch = () => {
        if(formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem")
            return false
        }
        setError("")
        return true
    }

    return (
        <div className="flex min-h-screen w-full items-center bg-[url('/grid.svg')] bg-center py-20">
=======
    const handleSignUp: SubmitHandler<SignUpData> = async (data) => {
        console.log(data)
        await signUp(data)
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-center">
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
            <div className="mx-auto max-w-xl w-full px-4">
                <div className="relative rounded-xl border bg-background p-8 shadow-2xl">
                    <div className="mb-8">
                        <ProgressBar currentStep={step + 1} totalSteps={3} />
                    </div>

                    <div className="space-y-6">
                        <div className="text-center">
<<<<<<< HEAD
                            <h1 className="text-3xl font-bold font-montserrat text-[#504136]">Crie sua conta</h1>
                            <p className="mt-2 font-lato text-[#504136]/70">
=======
                            <h1 className="text-3xl font-bold text-[#504136]">Crie sua conta</h1>
                            <p className="mt-2 text-[#504136]/70">
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                                {step === 0
                                    ? "Etapa 1: Informe seu email"
                                    : step === 1
                                        ? "Etapa 2: Crie uma senha segura"
                                        : "Etapa 3: Complete seu cadastro"}
                            </p>
                        </div>

<<<<<<< HEAD
                        <form onSubmit={step === 2 ? handleSubmit : handleNext} className="space-y-6">
=======
                        <form onSubmit={step === 2 ? handleSubmit(handleSignUp) : handleNext} className="space-y-6">
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                            {step === 0 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#504136]">
                                            Email
                                        </Label>
                                        <Input
<<<<<<< HEAD
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            placeholder="seu@email.com"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
=======
                                            {...register('email')}
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="seu@email.com"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-4">
<<<<<<< HEAD
                                    <p className="text-[--cor-error] font-lato">{error}</p>
=======
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[#504136]">
                                            Senha
                                        </Label>
                                        <Input
<<<<<<< HEAD
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
=======
                                            {...register('password')}
                                            id="password"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-[#504136]">
                                            Confirmar Senha
                                        </Label>
                                        <Input
<<<<<<< HEAD
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            placeholder="••••••••"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
=======
                                            {...register('confirmPassword')}
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
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
<<<<<<< HEAD
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleNameChange}
                                            placeholder="João da Silva"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
=======
                                            {...register('name')}
                                            id="name"
                                            required
                                            placeholder="João da Silva"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="birthDate" className="text-[#504136]">
                                            Data de Nascimento
                                        </Label>
                                        <Input
<<<<<<< HEAD
                                            id="birthDate"
                                            name="birthDate"
                                            type="date"
                                            required
                                            value={formData.birthDate}
                                            onChange={handleBirthDateChange}
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
=======
                                            {...register('birthDate')}
                                            id="birthDate"
                                            type="date"
                                            required
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="cep" className="text-[#504136]">
                                                CEP
                                            </Label>
                                            <Input
<<<<<<< HEAD
                                                id="cep"
                                                name="cep"
                                                required
                                                value={formData.cep}
                                                onChange={handleCepChange}
                                                maxLength={8}
                                                placeholder="00000-000"
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
=======
                                                {...register('cep')}
                                                id="cep"
                                                required
                                                placeholder="00000-000"
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
                                            {errors.cep && <p className="text-red-500 text-sm">{errors.cep.message}</p>}
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cpf" className="text-[#504136]">
                                                CPF
                                            </Label>
                                            <Input
<<<<<<< HEAD
                                                id="cpf"
                                                name="cpf"
                                                required
                                                value={formData.cpf}
                                                maxLength={11}
                                                onChange={handleCpfChange}
                                                placeholder="000.000.000-00"
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
=======
                                                {...register('cpf')}
                                                id="cpf"
                                                required
                                                placeholder="000.000.000-00"
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
                                            {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
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
<<<<<<< HEAD
                                <Button type="submit" className="bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white px-8">
=======
                                <Button type="submit" className="bg-[#689689] hover:bg-[#689689]/90 text-white px-8">
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
                                    {step === 2 ? "Criar conta" : "Avançar"}
                                </Button>
                            </div>
                        </form>

                        <div className="flex justify-end">
                            <p className="text-sm text-[#504136]/70">
                                Já tem uma conta?{" "}
<<<<<<< HEAD
                                <a href="/login" className="text-[--cor-primaria2] hover:underline">
=======
                                <a href="/login" className="text-[#689689] hover:underline">
>>>>>>> ea3facb650173648446241d7967c2e212ea6eff8
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