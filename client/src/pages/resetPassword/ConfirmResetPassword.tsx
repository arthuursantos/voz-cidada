import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import ProgressBar from "@/pages/signUp/components/progressBar";

export default function ConfirmResetPassword() {
    interface ResetPasswordData {
        password: string;
        confirmPassword: string;
    }

    const { register, handleSubmit, watch } = useForm<ResetPasswordData>();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            // [MUDAR AQUI] Exibir erro ou redirecionar se o token for inválido ou expirado.
            setError("Token inválido ou expirado.");
        }
    }, [token]);

    const handleResetPassword: SubmitHandler<ResetPasswordData> = async (data) => {
        if (data.password !== data.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        try {
            setError(null);
            // [MUDAR AQUI] Substitua o console.log abaixo por uma chamada real à API para redefinir a senha.
            // Exemplo usando fetch:
            // const response = await fetch('/api/confirm-reset-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ token, password: data.password })
            // });
            // if (!response.ok) throw new Error('Erro ao redefinir a senha.');
            console.log("Enviando nova senha para a API", { token, password: data.password });
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao redefinir a senha.");
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-center">
            <div className="mx-auto max-w-xl w-full px-4">
                <div className="relative rounded-xl border bg-background p-8 shadow-2xl">
                    <div className="mb-8">
                        <ProgressBar currentStep={2} totalSteps={2} />
                    </div>
                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold font-montserrat text-[#504136]">Redefinir senha</h1>
                            <p className="mt-2 font-lato text-[#504136]/70">
                                {success
                                    ? "Senha redefinida com sucesso! Agora você pode fazer login."
                                    : "Digite sua nova senha abaixo."}
                            </p>
                        </div>

                        {!success ? (
                            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[#504136]">
                                            Nova Senha
                                        </Label>
                                        <Input
                                            {...register('password', { required: true })}
                                            id="password"
                                            type="password"
                                            placeholder="Digite sua nova senha"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-[#504136]">
                                            Confirmar Senha
                                        </Label>
                                        <Input
                                            {...register('confirmPassword', { required: true })}
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Repita a nova senha"
                                            className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                </div>
                                <Button type="submit" className="bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white px-8 w-full">
                                    Redefinir Senha
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <Link to="/signin" className="text-[--cor-primaria2] hover:underline text-lg">
                                    Ir para Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
