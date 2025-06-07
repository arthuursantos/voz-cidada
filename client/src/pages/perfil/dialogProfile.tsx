import { useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import api from "@/shared/axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {AlertCircle, Users} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UpdateUserData = {
    nome: string;
    cpf: string;
    dataNascimento: string;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
}

type PasswordData = {
    currentPassword: string,
    newPassword: string
}

const profileSchema = z.object({
    nome: z.string().nonempty("O nome é obrigatório.").min(3, "Nome deve ter pelo menos 3 caracteres"),
    cpf: z.string()
        .nonempty("O CPF é obrigatório.")
        .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido. Use 000.000.000-00 ou 00000000000.")
        .transform(cpf => {
            return cpf.replace(/[^0-9]/g, "");
        }),
    dataNascimento: z.string().nonempty("A data de nascimento é obrigatória."),
    cep: z.string()
        .nonempty("O CEP é obrigatório.")
        .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido. Use 00000-000 ou 00000000.")
        .transform(cep => {
            return cep.replace(/[^0-9]/g, "");
        }),
    rua: z.string().nonempty("A rua é obrigatória.").min(3, "Rua deve ter pelo menos 3 caracteres"),
    bairro: z.string().nonempty("O bairro é obrigatório.").min(2, "Bairro deve ter pelo menos 2 caracteres"),
    cidade: z.string().nonempty("A cidade é obrigatória.").min(2, "Cidade deve ter pelo menos 2 caracteres"),
    uf: z.string().nonempty("A UF é obrigatória.").length(2, "UF deve ter exatamente 2 caracteres")
});

const passwordSchema = z.object({
    currentPassword: z.string().nonempty("A senha atual é obrigatória.").min(6, "Senha atual deve ter pelo menos 6 caracteres"),
    newPassword: z.string().nonempty("A nova senha é obrigatória.").min(6, "Nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().nonempty("A confirmação de senha é obrigatória.").min(6, "Confirme a nova senha")
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
});

export function ProfileDialog({ collapsed }: { collapsed: boolean }) {
    const { user, userRoles } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nome: user?.nome || "",
            cpf: user?.cpf || "",
            dataNascimento: user?.dataNascimento?.split(" ")[0] || "",
            cep: user?.cep || "",
            rua: user?.rua || "",
            bairro: user?.bairro || "",
            cidade: user?.cidade || "",
            uf: user?.uf || ""
        }
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    useState(() => {
        if (user) {
            profileForm.reset({
                nome: user.nome,
                cpf: user.cpf,
                dataNascimento: user.dataNascimento?.split(" ")[0],
                cep: user.cep,
                rua: user.rua,
                bairro: user.bairro,
                cidade: user.cidade,
                uf: user.uf
            });
        }
    });

    const onProfileSubmit = async (data: UpdateUserData) => {
        try {
            setLoading(true);
            setError("");

            await api.put(`/api/usuario`, {
                ...data,
                id: user?.id,
                dataCadastro: user?.dataCadastro
            });

        } catch (err) {
            setError("Erro ao atualizar perfil. Tente novamente.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordData) => {
        try {
            setLoading(true);
            setError("");

            await api.patch("/auth/changePassword", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });

            setOpenPasswordDialog(false);
            passwordForm.reset();

        } catch (err) {
            setError("Erro ao alterar senha. Verifique se a senha atual está correta.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/10 h-10">
                        <Users className="h-5 w-5"/>
                        {!collapsed && <span>Perfil</span>}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Perfil do Usuário</DialogTitle>
                    </DialogHeader>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={profileForm.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={profileForm.control}
                                    name="cpf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={profileForm.control}
                                    name="dataNascimento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Nascimento</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={profileForm.control}
                                    name="cep"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CEP</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="12345-678"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={profileForm.control}
                                    name="rua"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Rua</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={profileForm.control}
                                    name="bairro"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bairro</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={profileForm.control}
                                    name="cidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cidade</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={profileForm.control}
                                    name="uf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>UF</FormLabel>
                                            <FormControl>
                                                <Input {...field} maxLength={2} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {userRoles && (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Tipo de Usuário</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={userRoles.includes("ROLE_ADMIN") ? "Administrador" : "Usuário"}
                                                disabled
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenPasswordDialog(true)}
                                >
                                    Alterar Senha
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Alterar Senha</DialogTitle>
                        <DialogDescription>
                            Insira sua senha atual e a nova senha para confirmar a alteração.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha atual</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nova senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirme sua nova senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Alterando..." : "Alterar Senha"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}