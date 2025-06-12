"use client"
import { SVGProps, useState, useEffect, useContext } from "react"
import { ChevronDown, Plus, Search, Trash } from "lucide-react"
import Header from "@/components/header";
import { JSX } from "react/jsx-runtime";
import { AuthContext, JWTClaims } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "@/shared/services/authServices";
import { jwtDecode } from "jwt-decode";
import api from "@/shared/axios";
import funcionarioService from "./funcionarioServices.ts";
import { ChamadoInterface } from "./types.ts";
import FuncionarioDashboard from "../Funcionario/index.tsx";
import toast from "react-hot-toast";
import chamadoService from "@/shared/services/chamadoService.ts";
import SecretariaCard from "./components/secretariaCard.tsx";

// Define the structure of a Funcionario object
interface Funcionario {
    id: number;
    cpf: string;
    cargo: string;
    secretaria: string;
    email?: string;
}

// const funcionariosInventados: Funcionario[] = [
//     {
//         id: 1,
//         cpf: "123.456.789-00",
//         cargo: "Engenheiro Civil",
//         secretaria: "OBRAS",
//         email: "example@example.com"
//     },
//     {
//         id: 2,
//         cpf: "987.654.321-00",
//         cargo: "Arquiteto",
//         secretaria: "URBANISMO",
//         email: "example2@example.com"
//     },
//     {
//         id: 3,
//         cpf: "111.222.333-44",
//         cargo: "Técnico de Obras",
//         secretaria: "OBRAS",
//         email: "example3@example.com"
//     },
//     {
//         id: 4,
//         cpf: "555.666.777-88",
//         cargo: "Planejador Urbano",
//         secretaria: "URBANISMO",
//         email: "example4@example.com"
//     },
//     {
//         id: 5,
//         cpf: "999.888.777-66",
//         cargo: "Coordenador de Projetos",
//         secretaria: "OBRAS",
//         email: "example5@example.com"
//     }  
// ]

export default function AdminDashboard() {
    const { userRoles, user } = useContext(AuthContext);
    
    const [showNewEmployeeDialog, setShowNewEmployeeDialog] = useState(false);
    const [showEditChamado, setShowEditChamado] = useState(false);
    const [activeTab, setActiveTab] = useState("menu");
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [chamados, setChamados] = useState<ChamadoInterface[]>([]);
    const [editingChamado, setEditingChamado] = useState<ChamadoInterface | null>(null);
    const [isloading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [chamadosObras, setChamadosObras] = useState({
        PENDENTE: 0,
        EM_ANDAMENTO: 0,
        CONCLUIDO: 0,
        TOTAL: 0
    });
    const [chamadosUrbanismo, setChamadosUrbanismo] = useState({
        PENDENTE: 0,
        EM_ANDAMENTO: 0,
        CONCLUIDO: 0,
        TOTAL: 0
    });

    const getFuncionarios = async () => {
        try {
            const response = await api.get<{ _embedded: { funcionarioDTOList: Funcionario[] } }>('/api/funcionario');
            console.log("Funcionários:", response.data._embedded.funcionarioDTOList);
            setFuncionarios(Array.isArray(response.data._embedded.funcionarioDTOList) ? response.data._embedded.funcionarioDTOList : []);
        } catch (error) {
            console.error("Erro ao Buscar Usuários:", error);
            setFuncionarios([]);
        }
    }

    const getChamados = async () => {
        try {
            const response = await chamadoService.findAll({page: 0, size: 100, sort: "id,desc"});
            console.log("Chamados:", response.data._embedded.chamadoDTOList);
            const chamadosSecretariaNull = response.data._embedded.chamadoDTOList.filter((chamado: ChamadoInterface) => {
                return chamado.secretaria === null;
            })
            setChamados(Array.isArray(chamadosSecretariaNull) ? chamadosSecretariaNull : []);
        } catch (error) {
            console.error("Erro ao Buscar Chamados:", error);
        }
    }

    const getChamadosCountByStatus = async (secretaria: string) => {
        try {
            const response = await chamadoService.countBySecretaria(secretaria);
            // Inicializa com valores padrão 0
            const counts = {
                PENDENTE: 0,
                EM_ANDAMENTO: 0,
                CONCLUIDO: 0
            };
            
            // Mapeia os dados da resposta
            if (Array.isArray(response.data)) {
                response.data.forEach(([status, count]) => {
                    if (typeof status === 'string') {
                        const normalizedStatus = status.toUpperCase().trim();
                        if (normalizedStatus.includes('PENDENTE')) {
                            counts.PENDENTE = Number(count) || 0;
                        } else if (normalizedStatus.includes('EM ANDAMENTO') || normalizedStatus.includes('EM_ANDAMENTO')) {
                            counts.EM_ANDAMENTO = Number(count) || 0;
                        } else if (normalizedStatus.includes('CONCLUÍDO') || normalizedStatus.includes('CONCLUIDO')) {
                            counts.CONCLUIDO = Number(count) || 0;
                        }
                    }
                });
            }
            
            return {
                ...counts,
                TOTAL: counts.PENDENTE + counts.EM_ANDAMENTO + counts.CONCLUIDO
            };
        } catch (error) {
            console.error(`Erro ao contar chamados em ${secretaria}:`, error);
            return {
                PENDENTE: 0,
                EM_ANDAMENTO: 0,
                CONCLUIDO: 0,
                TOTAL: 0
            };
        }
    };

    // Atualize o useEffect para buscar as contagens
    useEffect(() => {
        const fetchCounts = async () => {
            const obrasData = await getChamadosCountByStatus("OBRAS");
            setChamadosObras(obrasData);
            
            const urbanismoData = await getChamadosCountByStatus("URBANISMO");
            setChamadosUrbanismo(urbanismoData);
        };
        fetchCounts();
    }, []);

    useEffect(() => {
        const fetchFuncionarios = async () => {
           getFuncionarios();
        };
        fetchFuncionarios();
    }, []);

    useEffect(() => {
        const fetchChamados = async () => {
            getChamados();
        };
        fetchChamados();
    }, []);

    const createFuncionarioSchema = z.object({
        cpf: z.string()
            .nonempty("O CPF é obrigatório.")
            .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido. Use 000.000.000-00 ou 00000000000.")
            .transform(cpf => {
                return cpf.replace(/[^0-9]/g, "");
            }),
        cargo: z.string().nonempty("O cargo é obrigatório."),
        secretaria: z.enum(["OBRAS", "URBANISMO"], {
            errorMap: () => ({ message: "Selecione uma secretaria válido." })
        }),
        email: z.string()
            .nonempty("O email é obrigatório.")
            .email("Formato de email inválido."),
        senha: z.string()
            .nonempty("A senha é obrigatória.")
            .min(6, "A senha deve ter pelo menos 6 caracteres."),
    });

    type FuncionarioData = z.infer<typeof createFuncionarioSchema>;

    const { register, handleSubmit, reset, formState: {errors} } = useForm<FuncionarioData>({
        resolver: zodResolver(createFuncionarioSchema)
    });

    const editChamadoSchema = z.object({
        secretaria: z.enum(["OBRAS", "URBANISMO"], {
            errorMap: () => ({ message: "Selecione uma secretaria válida." })
        }).optional(),
    });

    type ChamadoData = z.infer<typeof editChamadoSchema>;

    const { 
        register: registerChamado, 
        handleSubmit: handleSubmitChamado, 
        reset: resetChamado,
        formState: { errors: errorsChamado },
        setValue
    } = useForm<ChamadoData>({
        resolver: zodResolver(editChamadoSchema)
    });

    async function handleSubmitFuncionario(data: FuncionarioData) {
        await authService.registerAdmin({ login: data.email, password: data.senha });
        const { data: { accessToken } }: any = await authService.login({ login: data.email, password: data.senha });
        const jwt = jwtDecode<JWTClaims>(accessToken);
        await funcionarioService.createAdminProfile({ authId: jwt.sub, cpf: data.cpf, cargo: data.cargo, secretaria: data.secretaria });
        await getFuncionarios();
        setShowNewEmployeeDialog(false);
        reset({
            cpf: "",
            cargo: "",
            secretaria: undefined,
            email: "",
            senha: ""
        });
    }

    async function handleSubmitChamadoEdit(data: ChamadoData) {
        if (!editingChamado) return;
        
        try {
            const updatedChamado = {
                ...editingChamado,
                secretaria: data.secretaria || editingChamado.secretaria,
            };

            console.log("Chamado atualizado:", updatedChamado);
            
            if (typeof user?.authUserId !== "number") {
                throw new Error("authUserId is required and must be a number");
            }
            await chamadoService.update(updatedChamado);
            console.log("Chamado atualizado com sucesso:", data);
            await getChamados();
            setShowEditChamado(false);
            setEditingChamado(null);
        } catch (error) {
            console.error("Erro ao atualizar chamado:", error);
        }
    }

    async function handleDeleteFuncionario(id: number): Promise<void> {    
            await toast.promise(
                async () => {
                    await funcionarioService.deleteById(id)
                        .catch(error => {
                            console.error("Erro ao excluir funcionário:", error);
                        });
                    await getFuncionarios();
                },
                {
                    loading: "Excluindo funcionário...",
                    success: "Funcionário excluído com sucesso!",
                    error: (error) => `Erro ao excluir funcionário: ${error.message || "Erro desconhecido"}`
                }
            );
    }

    function handleEditChamado(chamado: ChamadoInterface): void {
        setEditingChamado(chamado);
        if (chamado.secretaria) {
            setValue("secretaria", chamado.secretaria as "OBRAS" | "URBANISMO");
        }
        setShowEditChamado(true);
    }

    let funcionarioFiltered = funcionarios.filter((f) => f.secretaria === "OBRAS" || f.secretaria === "URBANISMO");

    if (searchTerm) {
        funcionarioFiltered = funcionarioFiltered.filter((f) => 
            f.cpf.includes(searchTerm) || 
            f.cargo.toLowerCase().includes(searchTerm.toLowerCase()) || 
            f.secretaria.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (userRoles?.includes("ROLE_OWNER")) return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <Header />

            <main className="flex-1 p-4 md:p-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className={`relative mb-6 ${activeTab === "employees" ? "" : "hidden"}`}>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            className="w-full pl-10 py-2 pr-4 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent"
                            placeholder="Pesquisar setores ou funcionários..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Tabs */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
                                <button
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "menu" ? "bg-white text-gray-900 shadow-sm" : ""}`}
                                    onClick={() => setActiveTab("menu")}
                                >
                                    Menu
                                </button>
                                <button
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "employees" ? "bg-white text-gray-900 shadow-sm" : ""}`}
                                    onClick={() => setActiveTab("employees")}
                                >
                                    Funcionários
                                </button>
                                <button
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "chamados" ? "bg-white text-gray-900 shadow-sm" : ""}`}
                                    onClick={() => setActiveTab("chamados")}
                                >
                                    Chamados
                                </button>
                            </div>

                            <div className={`flex gap-2 ${activeTab === "employees" ? "" : "hidden"}`}>
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
                        <div className={activeTab === "menu" ? "block space-y-4" : "hidden"}>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {/* menu Cards */}

                                <div className="rounded-lg border bg-white shadow">
                                    <div className="p-4 pb-2 flex flex-row items-center justify-between border-b">
                                        <h3 className="text-lg font-medium">Dashboard</h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-sm text-gray-500 mb-2">
                                            Veja aqui as estatísticas gerais do sistema
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div>
                                                Chamados sem atribuição: <span className="font-medium">{chamados.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <SecretariaCard
                                    title="Obras Públicas"
                                    description="Gerencie os funcionários e chamados relacionados às obras públicas."
                                    funcionariosCount={funcionarios.filter(f => f.secretaria === "OBRAS").length}
                                    chamadosData={chamadosObras} // TODO: fetch and store real data in state, then pass here
                                />

                                <SecretariaCard
                                    title="Urbanismo"
                                    description="Gerencie os funcionários e chamados relacionados ao urbanismo."
                                    funcionariosCount={funcionarios.filter(f => f.secretaria === "URBANISMO").length}
                                    chamadosData={chamadosUrbanismo} // TODO: fetch and store real data in state, then pass here
                                />

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
                                                <th className="p-4 text-left font-medium">Secretaria</th>
                                                <th className="p-4 text-right font-medium">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                            funcionarioFiltered.length === 0 ? (
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td colSpan={5} className="p-4 text-center text-gray-500">Nenhum funcionário encontrado.</td>
                                                </tr>
                                            ) :
                                            
                                            funcionarioFiltered.map((funcionario) => (
                                            <tr key={funcionario.id} className="border-b hover:bg-gray-50">
                                                <td className="p-4 font-medium">{funcionario.id}</td>
                                                <td className="p-4">{funcionario.cpf}</td>
                                                <td className="p-4">{funcionario.cargo}</td>
                                                <td className="p-4">{funcionario.secretaria}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => toast.custom(
                                                        (t) => (
                                                            <div className={`bg-white p-4 rounded shadow-md ${t.visible ? "animate-enter" : "animate-leave"}`}>
                                                                <p className="text-sm text-gray-700">Tem certeza que deseja excluir este funcionário?</p>
                                                                <div className="mt-4 flex justify-end space-x-2">
                                                                    <button 
                                                                        onClick={async () => {
                                                                            await handleDeleteFuncionario(funcionario.id);
                                                                            toast.dismiss(t.id);
                                                                        }} 
                                                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                                    >
                                                                        Sim
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => toast.dismiss(t.id)} 
                                                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                                                    >
                                                                        Não
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )
                                                    )} className="h-8 w-8 rounded-full hover:bg-gray-100 inline-flex items-center justify-center text-red-500">
                                                        <Trash className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Chamados Tab content */}
                        <div className={activeTab === "chamados" ? "block" : "hidden"}>
                            <h1 className="font-montserrat font-bold text-center text-2xl text-[--cor-primaria]">CHAMADOS NÃO ATRIBUÍDOS:</h1>
                            <div className="rounded-lg border font-lato bg-white shadow">
                                {chamados.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">Nenhum chamado atribuído.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b bg-gray-100">
                                                    <th className="p-4 text-left font-medium">ID</th>
                                                    <th className="p-4 text-left font-medium">Título</th>
                                                    <th className="p-4 text-left font-medium">Descrição</th>
                                                    <th className="p-4 text-left font-medium">Status</th>
                                                    <th className="p-4 text-left font-medium">Secretaria</th>
                                                    <th className="p-4 text-left font-medium">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {chamados.map((chamado: ChamadoInterface) => (
                                                    <tr key={chamado.id} className="border-b hover:bg-gray-50">
                                                        <td className="p-4 font-medium">{chamado.id}</td>
                                                        <td className="p-4">{chamado.titulo}</td>
                                                        <td className="p-4">{chamado.descricao}</td>
                                                        <td className="p-4">{chamado.status}</td>
                                                        <td className="p-4">{chamado.secretaria || "Não atribuído"}</td>
                                                        <td className="p-4">
                                                            <button 
                                                                onClick={() => handleEditChamado(chamado)} 
                                                                className="h-8 w-8 rounded-full hover:bg-gray-100 inline-flex items-center justify-center"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal para Novo Funcionário */}
            {showNewEmployeeDialog && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(handleSubmitFuncionario)
                            }
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(handleSubmitFuncionario)(e);
                            }
                        }}
                         className="flex flex-col p-6">
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
                                            disabled={isloading}
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
                                            disabled={isloading}
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
                                            {...register("secretaria")}
                                            id="employee-sector"
                                            defaultValue=""
                                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={isloading}
                                        >
                                            <option value="" disabled>
                                                Selecione o setor
                                            </option>
                                            <option value="OBRAS">Obras Públicas</option>
                                            <option value="URBANISMO">Urbanismo</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
                                        {errors.secretaria && <span className="text-red-500 text-sm">{errors.secretaria.message}</span>}
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
                                        disabled={isloading}
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
                                            disabled={isloading}
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
                                        reset();
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="inline-flex items-center justify-center rounded-md bg-[#1e88e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#1976d2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                    type="submit"
                                    disabled={isloading}
                                    onLoad={() => setIsLoading(true)}
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Editar Chamado */}
            {showEditChamado && editingChamado && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <form onSubmit={handleSubmitChamado(handleSubmitChamadoEdit)} className="flex flex-col p-6">
                            <div className="flex flex-col space-y-1.5 pb-6 border-b">
                                <h2 className="text-lg font-semibold leading-none tracking-tight">Editar Chamado #{editingChamado.id}</h2>
                            </div>
                            <div className="grid gap-4 py-4">
                                
                                <div className="grid gap-2">
                                    <label htmlFor="chamado-secretaria" className="text-sm font-medium leading-none">
                                        Secretaria
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...registerChamado("secretaria")}
                                            id="chamado-secretaria"
                                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            defaultValue={editingChamado.secretaria || ""}
                                        >
                                            <option value="" disabled>Selecione uma Secretaria</option>
                                            <option value="OBRAS">Obras Públicas</option>
                                            <option value="URBANISMO">Urbanismo</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
                                        {errorsChamado.secretaria && <span className="text-red-500 text-sm">{errorsChamado.secretaria.message}</span>}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none">
                                        Detalhes
                                    </label>
                                    <div className="p-3 border rounded-md bg-gray-50">
                                        <p className="text-sm"><strong>Título:</strong> {editingChamado.titulo}</p>
                                        <p className="text-sm mt-1"><strong>Descrição:</strong> {editingChamado.descricao}</p>
                                        <p className="text-sm mt-1"><strong>Data Abertura:</strong> {new Date(editingChamado.dataAbertura).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => {
                                        setShowEditChamado(false);
                                        setEditingChamado(null);
                                        resetChamado();
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md bg-[#1e88e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#1976d2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <FuncionarioDashboard />
    )
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