import authService from "@/shared/services/authService.tsx";
import chamadoService from "@/shared/services/chamadoService.tsx";
import funcionarioService from "@/pages/Admin/funcionarioService.tsx";
import {useContext, useEffect, useState} from "react";
import {AuthContext, JWTClaims} from "@/contexts/AuthContext.tsx";
import {useForm} from "react-hook-form";
import {jwtDecode} from "jwt-decode";
import {ChamadoInterface} from "@/pages/Admin/types.ts";

export default function AdminDashboard() {

    const {userRoles, admin, loading} = useContext(AuthContext)
    const {register, handleSubmit} = useForm()

    const [chamados, setChamados] = useState<ChamadoInterface[]>([]);
    const [loadingChamados, setLoadingChamados] = useState(true);

    const profileFields = [
        {nome: 'cpf', label: 'CPF', type: 'text'},
        {nome: 'cargo', label: 'Cargo', type: 'text'},
        {nome: 'secretaria', label: 'secretaria', type: 'text'},
        {nome: 'email', label: 'Email', type: 'email'},
        {nome: 'password', label: 'Senha', type: 'text'}
    ];

    async function onSubmit(data: any) {
        await authService.registerAdmin({login: data.email, password: data.password})
        const {data: {accessToken}}: any = await authService.login({login: data.email, password: data.password})
        const jwt = jwtDecode<JWTClaims>(accessToken);
        await funcionarioService.createAdminProfile({
            authId: jwt.sub,
            cpf: data.cpf,
            cargo: data.cargo,
            secretaria: data.secretaria
        });
    };

    async function handleSetSecretaria(data: ChamadoInterface, secretaria: string) {
        const updatedChamado = {...data, secretaria}
        await chamadoService.update(updatedChamado)
    }

    useEffect(() => {
        async function fetchChamados() {
            try {
                if (userRoles?.includes("ROLE_OWNER")) {
                    const {data: {_embedded: {chamadoDTOList}}} = await chamadoService.findAll();
                    setChamados(chamadoDTOList);
                    return
                }
                if (userRoles?.includes("ROLE_ADMIN") && admin?.secretaria) {
                    const {data: {_embedded: {chamadoDTOList}}} = await chamadoService.findBySecretaria({ secretaria: admin?.secretaria });
                    setChamados(chamadoDTOList);
                }
            } finally {
                setLoadingChamados(false)
            }
        }
        fetchChamados();
    }, []);

    if (loading || loadingChamados) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            <div>
                {userRoles?.includes("ROLE_OWNER") &&
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {profileFields.map((field) => (
                                <div key={field.nome}>
                                    <label htmlFor={field.nome}>{field.label}:</label>
                                    <input
                                        type={field.type}
                                        id={field.nome}
                                        {...register(field.nome)}
                                    />
                                </div>
                            ))}
                            <button type="submit">Enviar</button>
                        </form>
                    </div>
                }
                <div>
                    {chamados.map((chamado: ChamadoInterface) => {
                        return (
                            <div key={chamado.id} className="p-10">
                                <p>{chamado.titulo}</p>
                                <p>{chamado.descricao}</p>
                                <p>{chamado.secretaria}</p>
                                <p>{chamado.dataAbertura}</p>
                                <p>{chamado.status}</p>
                                {userRoles?.includes("ROLE_OWNER") &&
                                    <div>
                                        <button className={"block"} onClick={() => handleSetSecretaria(chamado, "OBRAS")}>Encaminhar para Obras</button>
                                        <button className={"block"} onClick={() => handleSetSecretaria(chamado, "URBANISMO")}>Encaminhar para Urbanismo</button>
                                    </div>
                                }
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </>
    );

}