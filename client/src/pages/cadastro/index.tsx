import { Link } from "react-router-dom";
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

const Cadastro = () => {
    interface SignUpData {
        name: string;
        sobrenome: string;
        cpf: string;
        email: string;
        cep: string;
        bairro: string;
        rua: string;
        cidade: string;
        password: string;
        confirmPassword: string;
    }

    const { register, handleSubmit } = useForm<SignUpData>();
    const [error, setError] = useState<string>("");

    const handleSignUp: SubmitHandler<SignUpData> = async (data) => {
        if (data.password !== data.confirmPassword) {
            setError("As senhas não coincidem!");
            return;
        }

        try {
            console.log("Registrando usuário", data);
        } catch (err) {
            setError("Erro ao registrar usuário. Tente novamente.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 p-8">
            <div className="w-full max-w-xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-[--cor-primaria2] font-montserrat">Crie sua conta</h2>
                    <p className="mt-2 text-lg text-gray-600 font-lato text-[--cor-primaria2]">
                        Preencha os campos abaixo para se registrar.
                    </p>
                </div>

                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(handleSignUp)} className="mt-8 space-y-6 font-lato">
                    {/* Linha 1: Nome e Sobrenome */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="name" className="font-lato text-md">Nome</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                type="text"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="Seu nome"
                            />
                        </div>
                        <div>
                            <Label htmlFor="sobrenome" className="font-lato text-md">Sobrenome</Label>
                            <Input
                                id="sobrenome"
                                {...register('sobrenome')}
                                type="text"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="Seu sobrenome"
                            />
                        </div>
                    </div>

                    {/* Linha 2: CPF e E-mail */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="cpf" className="font-lato text-md">CPF</Label>
                            <Input
                                id="cpf"
                                {...register('cpf')}
                                type="text"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="font-lato text-md">E-mail</Label>
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

                    {/* Linha 3: CEP e Bairro */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="cep" className="font-lato text-md">CEP</Label>
                            <Input
                                id="cep"
                                {...register('cep')}
                                type="text"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="00000-000"
                            />
                        </div>
                        <div>
                            <Label htmlFor="bairro" className="font-lato text-md">Bairro</Label>
                            <Input
                                id="bairro"
                                {...register('bairro')}
                                type="text"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="Seu bairro"
                            />
                        </div>
                    </div>

                    {/* Linha 4: Rua e Cidade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="rua" className="font-lato text-md">Rua</Label>
                            <Input
                                id="rua"
                                {...register('rua')}
                                type="text"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="Sua rua"
                            />
                        </div>
                        <div>
                            <Label htmlFor="cidade" className="font-lato text-md">Cidade</Label>
                            <Input
                                id="cidade"
                                {...register('cidade')}
                                type="text"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="Sua cidade"
                            />
                        </div>
                    </div>

                    {/* Linha 5: Senha e Confirmar Senha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="password" className="font-lato text-md">Senha</Label>
                            <Input
                                id="password"
                                {...register('password')}
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword" className="font-lato text-md">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                {...register('confirmPassword')}
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 border-black font-lato"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white hover:duration-150 text-lg md:text-sm">
                            Registrar
                        </Button>
                    </div>
                </form>

                <div className="flex justify-between">
                    <p className="mt-2 text-sm text-center text-gray-600 font-lato hover:underline hover:text-black">
                        <a >
                            Já tem uma conta? Faça login
                        </a>
                    </p>

                    <p className="mt-2 text-sm text-center text-gray-600 font-lato">
                        <Link to="/" className="font-medium text-[--cor-primaria2] hover:text-[--cor-primaria] hover:underline">
                            Voltar para o login
                        </Link>
                    </p>
                </div>

                {/* apenas para ver as paginas */}
                <div className="mt-4 text-center">
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        <Link to="/about" className="text-[--cor-primaria2] hover:underline">About</Link>
                        <Link to="/contact" className="text-[--cor-primaria2] hover:underline">Contact</Link>
                    </div>
                </div>
                {/* apenas para ver as páginas */}
            </div>
        </div>
    );
};

export default Cadastro;
