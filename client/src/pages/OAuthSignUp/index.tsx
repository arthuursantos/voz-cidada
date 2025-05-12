import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import ProgressBar from "@/components/ProgressStepsBar";
import {AuthContext, ProfileData} from "@/contexts/AuthContext.tsx";
import {useContext} from "react";
import {z} from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormField {
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
    gridCols: number;
}

const formFields: FormField[] = [
    {
        id: "name",
        name: "name",
        label: "Nome completo",
        type: "text",
        required: true,
        placeholder: "João da Silva",
        gridCols: 1,
    },
    {
        id: "birthDate",
        name: "birthDate",
        label: "Data de Nascimento",
        type: "date",
        required: true,
        gridCols: 1,
    },
    {
        id: "cep",
        name: "cep",
        label: "CEP",
        type: "text",
        required: true,
        placeholder: "00000-000",
        gridCols: 0.5,
    },
    {
        id: "cpf",
        name: "cpf",
        label: "CPF",
        type: "text",
        required: true,
        placeholder: "000.000.000-00",
        gridCols: 0.5,
    }
];

const SignUpSchema = z.object({
    name: z.string()
        .nonempty("O nome completo é obrigatório")
        .transform(name => {
            return name.trim().split(' ').map((word) => {
                return word[0].toLocaleUpperCase().concat(word.substring(1))
            }).join(' ')
        }),
    birthDate: z.string()
        .nonempty("A data de nascimento é obrigatória."),
    cep: z.string()
        .nonempty("O CEP é obrigatório.")
        .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido. Use 00000-000 ou 00000000.")
        .transform(cep => {
            return cep.replace(/[^0-9]/g, "");
        }),
    cpf: z.string()
        .nonempty("O CPF é obrigatório.")
        .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido. Use 000.000.000-00 ou 00000000000.")
        .transform(cpf => {
            return cpf.replace(/[^0-9]/g, "");
        }),
})

export default function OAuthSignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileData>({
        resolver: zodResolver(SignUpSchema)
    });
    const { oAuthSignUp } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignUp = async (data: ProfileData) => {
        await toast.promise(
            async () => {
                await oAuthSignUp(data);
                navigate("/dashboard", { replace: true });
            },
            {
                loading: "Salvando...",
                success: "Salvo!",
                error: "Algo deu errado."
            },
        );
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-center">
            <div className="mx-auto max-w-xl w-full px-4">
                <div className="relative rounded-xl border bg-background p-8 shadow-2xl">
                    <div className="mb-8">
                        <ProgressBar currentStep={1} totalSteps={1} />
                    </div>

                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-[#504136]">Complete seu cadastro</h1>
                            <p className="mt-2 text-[#504136]/70">
                                Precisamos de algumas informações adicionais antes de continuar
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(handleSignUp)} className="space-y-6">
                            <div className="space-y-4">
                                {formFields.map((field, index) => {
                                    if (field.gridCols < 1) {
                                        return null;
                                    }
                                    return (
                                        <div key={index} className="space-y-2">
                                            <Label htmlFor={field.id} className="text-[#504136]">
                                                {field.label}
                                            </Label>
                                            <Input
                                                {...register(field.name as "name")}
                                                id={field.id}
                                                type={field.type}
                                                required={field.required}
                                                placeholder={field.placeholder}
                                                className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                            />
                                            {errors[field.name as "name"] && (
                                                <p className="text-red-500 text-sm">{errors[field.name as "name"]?.message?.toString()}</p>
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {formFields
                                        .filter(field => field.gridCols < 1)
                                        .map((field, index) => (
                                            <div key={index} className="space-y-2">
                                                <Label htmlFor={field.id} className="text-[#504136]">
                                                    {field.label}
                                                </Label>
                                                <Input
                                                    {...register(field.name as "name")}
                                                    id={field.id}
                                                    type={field.type}
                                                    required={field.required}
                                                    placeholder={field.placeholder}
                                                    className="border-[#504136]/20 focus:border-[#689689] focus:ring-[#689689]"
                                                />
                                                {errors[field.name as "name"] && (
                                                    <p className="text-red-500 text-sm">{errors[field.name as "name"]?.message?.toString()}</p>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4">
                                <Button type="submit" className="bg-[--cor-primaria2] hover:bg-[--cor-primaria] text-white px-8">
                                    Continuar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}