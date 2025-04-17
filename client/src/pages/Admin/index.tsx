import authService from "@/shared/services/authServices.tsx";
import funcionarioService from "@/pages/Admin/funcionarioServices.tsx";
import {useContext} from "react";
import {AuthContext, JWTClaims} from "@/contexts/AuthContext.tsx";
import {useForm} from "react-hook-form";
import {jwtDecode} from "jwt-decode";

export default function AdminDashboard() {

    const {userRoles} = useContext(AuthContext)
    const {register, handleSubmit} = useForm()

    const profileFields = [
        { nome: 'cpf', label: 'CPF', type: 'text' },
        { nome: 'cargo', label: 'Cargo', type: 'text' },
        { nome: 'setor', label: 'Setor', type: 'text' },
        { nome: 'email', label: 'Email', type: 'email' },
        { nome: 'password', label: 'Senha', type: 'text' }
    ];

    async function onSubmit(data: any) {
        await authService.registerAdmin({ login: data.email, password: data.password })
        const { data: { accessToken } }: any = await authService.login({ login: data.email, password: data.password })
        const jwt = jwtDecode<JWTClaims>(accessToken);
        await funcionarioService.createAdminProfile({ authId: jwt.sub, cpf: data.cpf, cargo: data.cargo, setor: data.setor  });
    };

    return (
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
        </div>
    );

}