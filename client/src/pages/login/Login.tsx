import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useContext } from "react";

export default function LoginForm() {
    interface SignInData {
        login: string;
        password: string;
    }

    const { register, handleSubmit } = useForm<SignInData>();
    const { signIn } = useContext(AuthContext);

    const handleSignIn: SubmitHandler<SignInData> = async (data) => {
        await signIn(data);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white md:flex-row">
            <div className="relative w-full h-40 md:h-auto md:w-1/2 bg-[#689689] rounded-b-[50%] md:rounded-none">
                <img
                    src="src/pages/login/login-bg.png"
                    alt="Login visual"
                    className="w-full h-full object-cover object-[center_20%] md:object-center rounded-b-[50%] md:rounded-none"
                />
            </div>

            <div className="flex items-center justify-center w-full p-8 md:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#504136] font-montserrat">Bem-vindo!</h2>
                        <p className="mt-2 text-sm text-gray-600 font-lato">Por favor, faça login na sua conta</p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignIn)} className="mt-8 space-y-6 font-lato">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="login" className="text-[#504136]">
                                    Login
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
                            <Button type="submit" className="w-full bg-[#504136] hover:bg-[#689689] text-white">
                                Entrar
                            </Button>
                        </div>
                    </form>

                    <p className="mt-2 text-sm text-center text-gray-600 font-lato">
                        Não tem uma conta?{" "}
                        <a href="#" className="font-medium text-[#689689] hover:text-[#504136]">
                            Registre-se
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}