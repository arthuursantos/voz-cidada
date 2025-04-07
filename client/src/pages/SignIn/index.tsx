import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useContext, useState } from "react";
import { AlertCircle, Chrome } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from '@react-oauth/google';

export default function SignIn() {

    const SignInSchema = z.object({
        login: z.string()
            .nonempty("O email é obrigatório.")
            .email("Formato de email inválido."),
        password: z.string()
            .nonempty("A senha é obrigatória.")
    })

    type SignInData = z.infer<typeof SignInSchema>;
    const { register, handleSubmit, formState: {errors} } = useForm<SignInData>({
        resolver: zodResolver(SignInSchema)
    });

    const { signIn, oAuthSignIn } = useContext(AuthContext);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn: SubmitHandler<SignInData> = async (data) => {
        try {
            setError(null);
            await signIn(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao fazer login");
        }
    };

    const handleGoogleSignIn = useGoogleLogin({
        onSuccess: async (response) => {
            console.log(response)
            await oAuthSignIn(response);
        }
    })

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
                                {errors.login && <p className="text-red-500 text-sm">{errors.login.message}</p>}
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
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>
                        </div>
                        <div>
                            <Button type="submit" className="w-full bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white hover:duration-150 text-md md:text-sm">
                                Entrar
                            </Button>
                        </div>
                    </form>

                    <div className="mt-4 flex items-center justify-center">
                        <div className="w-full border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 bg-white">ou</span>
                        <div className="w-full border-t border-gray-300"></div>
                    </div>

                    <Button
                        onClick={(e) => {
                            e.preventDefault()
                            handleGoogleSignIn()
                        }}
                        variant="outline"
                        className="w-full mt-4 flex items-center justify-center space-x-2 border-gray-600 text-[#504136] hover:bg-gray-100"
                    >
                        <Chrome className="h-5 w-5 mr-2 "/>
                        Continuar com Google
                    </Button>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Não tem uma conta?{" "}
                        <a href="/signup" className="font-medium text-[--cor-primaria2] hover:text-[--cor-primaria] transition-colors duration-300">
                            Registre-se
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}