"use client"
import { SVGProps, useState, useEffect, useContext } from "react"
import { ChevronDown, Plus, Search, Trash } from "lucide-react"
import Header from "@/components/header";
import { JSX } from "react/jsx-runtime";
import api from "@/lib/axios.ts";
import { AuthContext } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the structure of a Funcionario object
interface Funcionario {
    id: number;
    cpf: string;
    cargo: string;
    setor: string;
}

export default function AdminDashboard() {
    const { criarFuncionario } = useContext(AuthContext);

    const [showNewEmployeeDialog, setShowNewEmployeeDialog] = useState(false);
    const [activeTab, setActiveTab] = useState("sectors");
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]); // Explicitly type the state

    const getAlunos = async () => {
        try {
            const response = await api.get<{ _embedded: { funcionarioDTOList: Funcionario[] } }>('/api/funcionario');
            console.log("Funcionários:", response.data._embedded.funcionarioDTOList);
            setFuncionarios(Array.isArray(response.data._embedded.funcionarioDTOList) ? response.data._embedded.funcionarioDTOList : []); // Ensure response is an array
        } catch (error) {
            console.error("Erro ao Buscar Usuários:", error);
            setFuncionarios([]); // Ensure state is an array even on error
        }
    }

    useEffect(() => {
        const fetchFuncionarios = async () => {
           getAlunos();
        };
        fetchFuncionarios();
    }, []);


    const createFuncionarioSchema = z.object({
        cpf: z.string()
            .nonempty("O CPF é obrigatório.")
            .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido. Use 000.000.000-00 ou 00000000000.")
            .transform(cpf => {
                return cpf.replace(/[^0-9]/g, "");
            }),
        cargo: z.string().nonempty("O cargo é obrigatório."),
        setor: z.enum(["OBRAS", "URBANISMO"], {
            errorMap: () => ({ message: "Selecione um setor válido." })
        }),
        email: z.string()
            .nonempty("O email é obrigatório.")
            .email("Formato de email inválido."),
        senha: z.string()
            .nonempty("A senha é obrigatória.")
            .min(6, "A senha deve ter pelo menos 6 caracteres."),

    })

    type FuncionarioData = z.infer<typeof createFuncionarioSchema>;

    const { register, handleSubmit, formState: {errors} } = useForm<FuncionarioData>({
            resolver: zodResolver(createFuncionarioSchema)
        })

    async function handleSubmitFuncionario(data: FuncionarioData) {
        await criarFuncionario(data)
        setShowNewEmployeeDialog(false)
        getAlunos()
    }

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <Header />

            <main className="flex-1 p-4 md:p-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            className="w-full pl-10 py-2 pr-4 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent"
                            placeholder="Pesquisar setores ou funcionários..."
                        />
                    </div>

                    {/* Tabs */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
                                <button
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "sectors" ? "bg-white text-gray-900 shadow-sm" : ""}`}
                                    onClick={() => setActiveTab("sectors")}
                                >
                                    Setores
                                </button>
                                <button
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "employees" ? "bg-white text-gray-900 shadow-sm" : ""}`}
                                    onClick={() => setActiveTab("employees")}
                                >
                                    Funcionários
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="inline-flex items-center justify-center rounded-md bg-[#1e88e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#1976d2] focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2"
                                    onClick={() => setShowNewEmployeeDialog(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Novo Funcionário
                                </button>
                            </div>
                        </div>

                        {/* Sectors Tab Content */}
                        <div className={activeTab === "sectors" ? "block space-y-4" : "hidden"}>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {/* Sector Cards */}
                                <div className="rounded-lg border bg-white shadow">
                                    <div className="p-4 pb-2 flex flex-row items-center justify-between border-b">
                                        <h3 className="text-lg font-medium">Obras Públicas</h3>
                                        <button className="h-8 w-8 rounded-full hover:bg-gray-100 inline-flex items-center justify-center text-red-500">
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-sm text-gray-500 mb-2">
                                            Responsável por manutenção de vias e obras públicas
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div>
                                                Funcionários: <span className="font-medium">{funcionarios.filter((f) => f.setor === "OBRAS").length}</span>
                                            </div>
                                            <div>
                                                Chamados: <span className="font-medium">47</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-white shadow">
                                    <div className="p-4 pb-2 flex flex-row items-center justify-between border-b">
                                        <h3 className="text-lg font-medium">Urbanismo</h3>
                                        <button className="h-8 w-8 rounded-full hover:bg-gray-100 inline-flex items-center justify-center text-red-500">
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-sm text-gray-500 mb-2">Responsável pelo planejamento do espaço urbano</div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div>
                                                Funcionários: <span className="font-medium">{funcionarios.filter((f) => f.setor === "URBANISMO").length}</span>
                                            </div>
                                            <div>
                                                Chamados: <span className="font-medium">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employees Tab Content */}
                        <div className={activeTab === "employees" ? "block" : "hidden"}>
                            <div className="rounded-lg border bg-white shadow">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b bg-gray-100">
                                                <th className="p-4 text-left font-medium">ID</th>
                                                <th className="p-4 text-left font-medium">CPF</th>
                                                <th className="p-4 text-left font-medium">Cargo</th>
                                                <th className="p-4 text-left font-medium">Setor</th>
                                                <th className="p-4 text-right font-medium">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {funcionarios.map((funcionario) => (
                                                <FuncionariosRow
                                                    key={funcionario.id}
                                                    id={funcionario.id}
                                                    cpf={funcionario.cpf}
                                                    cargo={funcionario.cargo}
                                                    setor={funcionario.setor}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


            {/* Modal para Novo Funcionário */}
            {showNewEmployeeDialog && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <form onSubmit={handleSubmit(handleSubmitFuncionario)} className="flex flex-col p-6">
                            <div className="flex flex-col space-y-1.5 pb-6 border-b">
                                <h2 className="text-lg font-semibold leading-none tracking-tight">Cadastrar Novo Funcionário</h2>
                            </div>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="employee-name" className="text-sm font-medium leading-none">
                                            CPF
                                        </label>
                                        <input
                                            {...register("cpf")}
                                            id="employee-name"
                                            placeholder="123.456.789-00"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf.message}</span>}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="employee-role" className="text-sm font-medium leading-none">
                                            Cargo
                                        </label>
                                        <input
                                            {...register("cargo")}
                                            id="employee-role"
                                            placeholder="Cargo"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        {errors.cargo && <span className="text-red-500 text-sm">{errors.cargo.message}</span>}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="employee-sector" className="text-sm font-medium leading-none">
                                        Setor
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register("setor")}
                                            id="employee-sector"
                                            defaultValue=""
                                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="" disabled>
                                                Selecione o setor
                                            </option>
                                            <option value="OBRAS">Obras Públicas</option>
                                            <option value="URBANISMO">Urbanismo</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
                                        {errors.setor && <span className="text-red-500 text-sm">{errors.setor.message}</span>}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="employee-email" className="text-sm font-medium leading-none">
                                        Email
                                    </label>
                                    <input
                                        {...register("email")}
                                        id="employee-email"
                                        type="email"
                                        placeholder="email@prefeitura.gov.br"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                                </div>
                                <div>
                                    <div className="grid gap-2">
                                        <label htmlFor="employee-password" className="text-sm font-medium leading-none">
                                            Senha
                                        </label>
                                        <input
                                            {...register("senha")}
                                            id="employee-password"
                                            type="password"
                                            placeholder="Senha"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        {errors.senha && <span className="text-red-500 text-sm">{errors.senha.message}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => {
                                        setShowNewEmployeeDialog(false);
                                        errors.cpf = undefined;
                                        errors.cargo = undefined;
                                        errors.setor = undefined;
                                        errors.email = undefined;
                                        errors.senha = undefined;
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="inline-flex items-center justify-center rounded-md bg-[#1e88e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#1976d2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                    type="submit"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Edit icon
function Edit(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    )
}

const FuncionariosRow = (props: Funcionario) => {
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-4 font-medium">{props.id}</td>
            <td className="p-4">{props.cpf}</td>
            <td className="p-4">{props.cargo}</td>
            <td className="p-4">{props.setor}</td>
            <td className="p-4 text-right">
                <button className="h-8 w-8 rounded-full hover:bg-gray-100 inline-flex items-center justify-center">
                    <Edit className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 rounded-full hover:bg-gray-100 inline-flex items-center justify-center text-red-500">
                    <Trash className="h-4 w-4" />
                </button>
            </td>
        </tr>
    )
}