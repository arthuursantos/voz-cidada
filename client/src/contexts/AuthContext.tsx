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
    numero: string;
    bairro: string;
    complemento?: string;
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

type SignInResponse = AxiosResponse<SignInResponseData>

type SignInResponseData = {
    accessToken: string,
    refreshToken: string;
}

type AuthContextType = {
    isAuthenticated: boolean,
    signIn: (data: SignInData) => Promise<void>,
    user: User | null;
    loading: boolean;
    userRoles: string[] | null;
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
                    .catch((error) => {
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

    async function signIn({ login, password }: SignInData) {
        try {
            const response: SignInResponse = await api.post("/auth/login", {
                login,
                password
            });

            const { accessToken, refreshToken } = response.data;

            setCookie(undefined, "vozcidada.accessToken", accessToken, {
                maxAge: 60 * 60 * 1, // 1h
            });

            setCookie(undefined, "vozcidada.refreshToken", refreshToken, {
                maxAge: 60 * 60 * 24, // 24h
            });

            const decoded = jwtDecode<JWTClaims>(accessToken);
            setUserRoles(decoded.roles);

            const userResponse = await api.get(`/api/usuario/auth/${decoded.sub}`);
            setUser(userResponse.data);

            if (decoded.roles.includes("ROLE_ADMIN")) {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, loading, userRoles }}>
            {children}
        </AuthContext.Provider>
    )
}