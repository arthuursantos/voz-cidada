import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

export default function ResetPassword() {
    interface ResetPasswordData {
        email: string;
    }

    const { register, handleSubmit, trigger } = useForm<ResetPasswordData>();
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(0);

    // FUNÇÃO: Integrar a API que envia o e-mail de redefinição
    const handleResetPassword: SubmitHandler<ResetPasswordData> = async (data) => {
        try {
            setError(null);
            // COLOCAR A API que envia o e-mail de redefinição abaixo (ex: com fetch ou axios)
            // Exemplo:
            // const response = await fetch('/api/reset-password', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email: data.email })
            // });
            // if (!response.ok) throw new Error('Erro ao enviar e-mail de redefinição.');
            setStep(1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao tentar redefinir a senha.");
        }
    };

    // ALTERAR: Modificar o onSubmit para chamar handleSubmit(handleResetPassword) e efetivar a integração com a API
    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 0) {
            const isValid = await trigger("email");
            if (isValid) {
                handleSubmit(handleResetPassword)();
            }
        }
    };

    const handleBack = () => {
        setStep(0);
    };

    return (
        <div className="flex flex-col min-h-screen max-h-screen bg-white md:flex-row">
            <div className="relative w-full h-40 md:h-auto md:w-1/2 rounded-b-[50%] md:rounded-none">
                <img
                    src="./images/predios2.png"
                    alt="Redefinir Senha"
                    className="w-full h-full object-cover object-[center_90%] md:object-center rounded-b-[50%] md:rounded-none"
                />
            </div>
            <div className="flex items-center justify-center w-full p-8 md:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-[--cor-primaria2] font-montserrat">Redefinir Senha</h1>
                        <p className="mt-2 text-lg text-gray-600 font-lato text-[--cor-primaria2]">
                            {step === 0
                                ? "Informe seu e-mail para redefinir sua senha."
                                : "Confira seu e-mail para instruções sobre a redefinição de senha."}
                        </p>
                    </div>
                    <form onSubmit={handleNext} className="space-y-6 font-lato">
                        {step === 0 && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email" className="font-lato text-md">E-mail</Label>
                                    <Input
                                        {...register('email')}
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="seu@email.com"
                                        className="mt-1 border-black font-lato"
                                    />
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                </div>
                            </div>
                        )}
                        {step === 1 && (
                            <div className="space-y-4 text-center">
                                <p className="text-lg text-green-500">
                                    E-mail enviado com sucesso! Verifique sua caixa de entrada.
                                </p>
                            </div>
                        )}
                        <div className="flex items-center justify-between space-x-4">
                            <div>
                                {step > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleBack}
                                        className="text-[--cor-primaria2] hover:text-[--cor-primaria] hover:bg-gray-100"
                                    >
                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                        Voltar
                                    </Button>
                                )}
                            </div>
                            <Button type="submit" className="bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white px-8">
                                {step === 0 ? "Enviar E-mail" : "Ok"}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 font-lato">
                            Lembrou a senha?{" "}
                            <Link to="/signin" className="font-medium text-[--cor-primaria2] hover:text-[--cor-primaria] hover:underline">
                                Faça login aqui
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
