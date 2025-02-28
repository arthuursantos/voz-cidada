import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useContext, useState } from "react";

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
        <div className="flex flex-col min-h-screen bg-white md:flex-row">
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

            {/* Imagem (topo em mobile, direita em desktop) */}
            <div className="relative w-full h-40 md:h-auto md:w-1/2 bg-[#689689] rounded-b-[50%] md:rounded-none">
                <img
                    src="/images/login-bg.png"
                    alt="Login visual"
                    className="w-full h-full object-cover object-[center_20%] md:object-center rounded-b-[50%] md:rounded-none"
                />
            </div>

            {/* Formulário de login */}
            <div className="flex items-center justify-center w-full p-8 md:w-1/2">
                <div className="w-full max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#504136]">Bem-vindo de volta</h2>
                        <p className="mt-2 text-sm text-gray-600">Por favor, faça login na sua conta</p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignIn)} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-[#504136]">
                                    Email
                                </Label>
                                <Input
                                    id="login"
                                    {...register('login')}
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="mt-1 border-[#689689]"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-[#504136]">
                                    Senha
                                </Label>
                                <Input
                                    id="password"
                                    {...register('password')}
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 border-[#689689]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-[#504136] hover:bg-[#689689] text-white transition-colors duration-300"
                            >
                                Entrar
                            </Button>
                        </div>
                    </form>
                    <p className="mt-6 text-sm text-center text-gray-600">
                        Não tem uma conta?{" "}
                        <a href="/signup" className="font-medium text-[#689689] hover:text-[#504136] transition-colors duration-300">
                            Registre-se
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}