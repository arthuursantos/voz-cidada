import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AuthContext} from "@/contexts/AuthContext.tsx";
import {ArrowLeft} from "lucide-react";
import {SubmitHandler, useForm} from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useContext, useState } from "react";
import ProgressBar from "@/components/progressBar";
import toast from "react-hot-toast";

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
            .nonempty("A data de nascimento é obrigatória.")
            .refine((dateStr) => {
              const birth = new Date(dateStr);
              const today = new Date();
              const age = today.getFullYear() - birth.getFullYear();
              const isBirthdayPassed = today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
              return age > 18 || (age === 18 && isBirthdayPassed);
            }, {
              message: "Você precisa ter mais de 18 anos.",
            }),          
        cep: z.string()
            .nonempty("O CEP é obrigatório.")
            .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido. Use 00000-000 ou 00000000.")
            .transform((cep) => cep.replace(/[^0-9]/g, "")),
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
    }

    const handleBack = () => {
        setStep((prev) => prev - 1)
    }

    function validateCPF(cpf: string) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += +cpf[i] * (10 - i);
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== +cpf[9]) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) sum += +cpf[i] * (11 - i);
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        return rev === +cpf[10];
    }

    const handleSignUp: SubmitHandler<SignUpData> = async (data) => {
        const cepResponse = await fetch(`https://viacep.com.br/ws/${data.cep}/json/`);
        const cepData = await cepResponse.json();
        if (!cepData || cepData.erro) {
            toast.error("CEP inválido ou não encontrado.");
            return;
        }

        const isValidCpf = validateCPF(data.cpf);
        if (!isValidCpf) {
            toast.error("CPF inválido.");
            return;
        }
        await toast.promise(
            async () => {
                await signUp(data);
            },
            {
                loading: "Criando conta...",
                success: "Conta criada com sucesso!",
                error: (err) => {
                    return err instanceof Error ? err.message : "Erro ao criar conta.";
                }
            }
        )
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-center">
            <div className="mx-auto max-w-xl w-full px-4">
                <div className="relative rounded-xl border bg-background p-8 shadow-2xl">
                    <div className="mb-8">
                        <ProgressBar currentStep={step + 1} totalSteps={3} />
                    </div>

                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold font-montserrat text-[#504136]">Crie sua conta</h1>
                            <p className="mt-2 font-lato text-[#504136]/70">
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
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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
                                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
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
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
                                        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
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
                                                accept="number"
                                                maxLength={9}
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
                                            <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target='_blank' className='text-[--cor-primaria2] text-sm hover:underline w-fit'>Esqueceu o CEP?</a>
                                            {errors.cep && <p className="text-red-500 text-sm">{errors.cep.message}</p>}
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
                                                maxLength={14}
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
                                            
                                            {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
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
                                <Button type="submit" className="bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white px-8">
                                    {step === 2 ? "Criar conta" : "Avançar"}
                                </Button>
                            </div>
                        </form>

                        <div className="flex justify-end">
                            <p className="text-sm text-[#504136]/70">
                                Já tem uma conta?{" "}
                                <a href="/login" className="text-[--cor-primaria2] hover:underline">
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