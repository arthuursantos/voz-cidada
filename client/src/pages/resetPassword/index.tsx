import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Bell, LogOut, User } from 'lucide-react';

export default function ResetPassword() {
    interface ResetPasswordData {
        email: string;
    }

    const { register, handleSubmit } = useForm<ResetPasswordData>();
    const [error, setError] = useState<string | null>(null);

    const handleResetPassword: SubmitHandler<ResetPasswordData> = async (data) => {
        try {
            setError(null);
            // Simulação de envio de e-mail para redefinição de senha
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao tentar redefinir a senha.");
        }
    };

    return (
        
        
        
        <div className="flex flex-col min-h-screen max-h-screen bg-white md:flex-row">
            
            {/* Container do alerta de erro */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                {error && (
                    <Alert
                        variant="destructive"
                        className="border-red-500 bg-red-50 animate-in fade-in slide-in-from-top duration-300 shadow-lg"
                    >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="relative w-full h-40 md:h-auto md:w-1/2  rounded-b-[50%] md:rounded-none">
                <img
                    src="./images/predios2.png"
                    alt="Redefinir Senha"
                    className="w-full h-full object-cover object-[center_90%] md:object-center rounded-b-[50%] md:rounded-none"
                />
            </div>

            <div className="flex items-center justify-center w-full p-8 md:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-[--cor-primaria2] font-montserrat">Redefinir senha!</h2>
                        <p className="mt-2 text-lg text-gray-600 font-lato text-[--cor-primaria2]">Informe o E-mail de cadastro para redefinir a senha.</p>
                    </div>

                    <form onSubmit={handleSubmit(handleResetPassword)} className="mt-8 space-y-6 font-lato">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className='font-lato text-md'>
                                    E-mail
                                </Label>
                                <Input
                                    id="email"
                                    {...register('email')}
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 border-black font-lato"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <Button type="submit" className="w-full bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white hover:duration-150 text-lg md:text-sm">
                                Redefinir senha
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 font-lato">
                            <Link
                                to="/login"
                                className="font-medium text-[--cor-primaria2] hover:text-[--cor-primaria] hover:underline"
                            >
                                Voltar para o login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
