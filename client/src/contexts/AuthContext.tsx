import {createContext, ReactNode, useEffect, useState} from "react";
import api from "@/lib/axios.ts";
import { setCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";

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

type SignInResponse = {
    accessToken: string,
    refreshToken: string;
}

type AuthContextType = {
    isAuthenticated: boolean,
    signIn: (data: SignInData) => Promise<void>,
    user: User | null;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const isAuthenticated = !!user;

    const navigate = useNavigate();

    useEffect(() => {
        const { "vozcidada.accessToken": accessToken } = parseCookies();
        if (accessToken) {
            try {
                const decoded = jwtDecode<JWTClaims>(accessToken);
                api.get(`/api/usuario/${decoded.sub}`)
                    .then(response => {
                        setUser(response.data)
                    })
                    .catch(() => {
                        setUser(null)
                    })
            } catch (error) {
                setUser(null)
            }
        }
    }, [])

    async function signIn({ login, password }: SignInData) {

        const { accessToken, refreshToken }: SignInResponse = await api.post("/auth/login", {
            login,
            password
        })

        setCookie(undefined, "vozcidada.accessToken", accessToken, {
            maxAge: 60*60*1, // 1h
        })

        setCookie(undefined, "vozcidada.accessToken", refreshToken, {
            maxAge: 60*60*24, // 24h
        })

        navigate("/dashboard")

    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}