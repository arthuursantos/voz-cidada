import {createContext, ReactNode, useEffect, useState} from "react";
import api from "@/lib/axios.ts";
import { setCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import {AxiosResponse} from "axios";

type User = {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    dataCadastro: string;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
}

type JWTClaims = {
    sub: string;
    iss: string;
    token_type: string;
    roles: string[];
    exp: number;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInData = {
    login: string,
    password: string;
}

export type SignUpData = {
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    birthDate: string,
    cep: string,
    cpf: string
}

type SignInResponse = AxiosResponse<SignInResponseData>

type SignInResponseData = {
    accessToken: string,
    refreshToken: string;
}

type AuthContextType = {
    user: User | null;
    userRoles: string[] | null;
    isAuthenticated: boolean,
    loading: boolean;
    signIn: (data: SignInData) => Promise<void>,
    signUp: (data: SignUpData) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [userRoles, setUserRoles] = useState<string[] | null>(null)
    const isAuthenticated = !!user;

    const navigate = useNavigate();

    useEffect(() => {
        const { "vozcidada.accessToken": accessToken } = parseCookies();
        if (accessToken) {
            try {
                const decoded = jwtDecode<JWTClaims>(accessToken);
                setUserRoles(decoded.roles);

                api.get(`/api/usuario/auth/${decoded.sub}`)
                    .then(response => {
                        setUser(response.data)
                    })
                    .catch(() => {
                        setUser(null)
                        setUserRoles(null)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } catch (error) {
                setUser(null)
                setUserRoles(null)
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }, [])

    const setTokens = (accessToken: string, refreshToken: string) => {
        setCookie(undefined, "vozcidada.accessToken", accessToken, {
            maxAge: 60 * 60 * 1, // 1h
        });

        setCookie(undefined, "vozcidada.refreshToken", refreshToken, {
            maxAge: 60 * 60 * 24, // 24h
        });
    }

    async function signIn({ login, password }: SignInData) {
        const response: SignInResponse = await api.post("/auth/login", {
            login,
            password
        });

        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken)

        const decoded = jwtDecode<JWTClaims>(accessToken);
        setUserRoles(decoded.roles);

        const userResponse = await api.get(`/api/usuario/auth/${decoded.sub}`);
        setUser(userResponse.data);

        if (decoded.roles.includes("ROLE_ADMIN")) {
            navigate("/admin/dashboard");
        } else {
            navigate("/home");
        }
    }

    const getCepApi = async (cep: string) =>{
        return fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar CEP');
                }
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    throw new Error('CEP não encontrado.');
                }
                return data; // Retorna apenas o JSON
            });
    }

    async function signUp(data: SignUpData) {

        const infoCep = await getCepApi(data.cep)

        await api.post("/auth/register", {
            login: data.email,
            password: data.password,
            role: "USER"
        })

        const response = await api.post("/auth/login", {
            login: data.email,
            password: data.password
        })

        const {accessToken, refreshToken} = response.data
        setTokens(accessToken, refreshToken)

        const dataCadastro = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await api.post("/api/usuario", {
            nome: data.name,
            dataNascimento: data.birthDate,
            cpf: data.cpf,
            cep: data.cep,
            rua: infoCep.logradouro,
            bairro: infoCep.bairro,
            cidade: infoCep.localidade,
            uf: infoCep.uf,
            dataCadastro: dataCadastro
        })

        const decoded = jwtDecode<JWTClaims>(accessToken);
        setUserRoles(decoded.roles);
        const userResponse = await api.get(`/api/usuario/auth/${decoded.sub}`);
        setUser(userResponse.data);

        if (decoded.roles.includes("ROLE_ADMIN")) {
            navigate("/admin/dashboard");
        } else {
            navigate("/home");
        }

    }

    return (
        <AuthContext.Provider value={{ user, userRoles,  isAuthenticated, loading, signIn, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}