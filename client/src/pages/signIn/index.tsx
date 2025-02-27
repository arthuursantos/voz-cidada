import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useContext, useState } from "react";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';


export default function SignIn() {
    interface SignInData {
        login: string;
        password: string;
    }

    const { register, handleSubmit } = useForm<SignInData>();
    const { signIn } = useContext(AuthContext);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn: SubmitHandler<SignInData> = async (data) => {
        try {
            setError(null);
            await signIn(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao fazer login");
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

            <div className="relative w-full h-40 md:h-auto md:w-1/2 bg-[#689689] rounded-b-[50%] md:rounded-none">
                <img
                    src="./images/predios.png"
                    alt="Login visual"
                    className="w-full h-full object-cover object-[center_90%] md:object-center rounded-b-[50%] md:rounded-none"
                />
            </div>

            <div className="flex items-center justify-center w-full p-8 md:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-[--cor-primaria2] font-montserrat">Bem-vindo!</h2>
                        <p className="mt-2 text-lg text-gray-600 font-lato text-[--cor-primaria2]">Realize o login pra continuar!</p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignIn)} className="mt-8 space-y-6 font-lato">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="login" className='font-lato text-md'>
                                    Login
                                </Label>
                                <Input
                                    id="login"
                                    {...register('login')}
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="mt-1 border-black font-lato"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className='font-lato text-md'>
                                    Senha
                                </Label>
                                <Input
                                    id="password"
                                    {...register('password')}
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 border-black font-lato"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div>
                            <Button type="submit" className="w-full bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white hover:duration-150 text-lg md:text-sm">
                                Entrar
                            </Button>
                        </div>
                    </form>

    
                    <div className='flex justify-between'>
                        <p className='mt-2 text-sm text-center text-gray-600 font-lato hover:underline hover:text-black'>
                        <Link
                                to="/resetPassword"
                                className="font-medium text-[--cor-primaria2] hover:text-[--cor-primaria] hover:underline"
                            >
                                Esqueceu a senha?
                            </Link>
                        </p>

                        <p className="mt-2 text-sm text-center text-gray-600 font-lato">
                            Não tem conta?{" "}
                            <Link
                                to="/cadastro"
                                className="font-medium text-[--cor-primaria2] hover:text-[--cor-primaria] hover:underline"
                            >
                                Registre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}