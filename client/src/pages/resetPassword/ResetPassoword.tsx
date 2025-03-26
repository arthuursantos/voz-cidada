import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from '@/contexts/AuthContext';
import { z } from 'zod';
import clsx from 'clsx';
import NotificationError from '@/components/NotificacaoError/Notification';
import NotificationSuccess from '@/components/NotificacaoSucesso/NotificationSuccess';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ResetPassword() {
    const { changePassword } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const ResetPasswordSchema = z.object({
        senha: z.string()
            .nonempty("A senha é obrigatória.")
            .min(6, "A senha deve ter no mínimo 6 caracteres."),
        confirmarSenha: z.string()
            .nonempty("A confirmação de senha é obrigatória.")
    }).refine(data => data.senha === data.confirmarSenha, {
        message: "As senhas não conferem",
        path: ["confirmarSenha"], 
    });

    type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordData>({
        resolver: zodResolver(ResetPasswordSchema), // Integra o esquema zod ao formulário
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleResetPassword: SubmitHandler<ResetPasswordData> = async (data) => {
        setIsLoading(true);
        try {
            const response = await changePassword(data.senha);
            if (response !== undefined) {
                setSuccess("Senha redefinida com sucesso.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao tentar redefinir a senha.");
        } finally {
            setIsLoading(false);
        }
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
            {success && <NotificationSuccess message={success} />}
            {error && <NotificationError message={error} />}
            <div className="flex items-center justify-center w-full p-8 md:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-[--cor-primaria2] font-montserrat">Redefinir Senha</h1>
                        <p className="mt-2 text-lg text-gray-600 font-lato text-[--cor-primaria2]">
                            informe a nova senha para acesso ao sistema
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6 font-lato">
                        
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="senha" className="font-lato text-md">Senha</Label>
                                <Input
                                    {...register('senha', { required: 'Campo obrigatório' })}
                                    id="senha"
                                    type="password"
                                    aria-label="Digite sua nova senha"
                                    placeholder="Digite sua nova senha"
                                    className="mt-1 border-black font-lato"
                                />
                                {errors.senha && (
                                    <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div>
                                <Label htmlFor="confirmarSenha" className="font-lato text-md">Confirmar Senha</Label>
                                <Input
                                    {...register('confirmarSenha', { required: 'Campo obrigatório' })}
                                    id="confirmarSenha"
                                    type="password"
                                    required
                                    placeholder="Confirme sua nova senha"
                                    className="mt-1 border-black font-lato"
                                />
                                 {errors.confirmarSenha && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>
                                )}
                            </div>
                        </div>
                        
                        
                        <div className="flex justify-end space-x-4">
                            <Button type="submit" disabled={isLoading} className={clsx(
                                    "text-sm md:text-md text-white px-8",
                                    isLoading ? "bg-gray-400" : "bg-[--cor-primaria2] hover:bg-[--cor-primaria]"
                            )}>
                                {isLoading ? "Enviando..." : "Enviar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
