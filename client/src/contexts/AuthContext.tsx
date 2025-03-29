import {createContext, ReactNode, useEffect, useState} from "react";
import api from "@/lib/axios.ts";
import { setCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import axios, {AxiosResponse} from "axios";

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
    signInWithGoogle: (googleData: any) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [userRoles, setUserRoles] = useState<string[] | null>(null)
    const isAuthenticated = !!userRoles;

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
                        console.log("entrou no catch do context")
                        setUser(null)
                        setUserRoles(null)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } catch {
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

    async function signInWithGoogle(googleData: any) {
        const googleresponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${googleData.access_token}`
            }
        })
        console.log(googleresponse)
        const response = await api.post("/auth/oauth/google", {
            email: googleresponse.data.email
        })
        console.log(response)
        const {accessToken, refreshToken} = response.data;
        setTokens(accessToken, refreshToken)
        const decoded = jwtDecode<JWTClaims>(accessToken);
        setUserRoles(decoded.roles);
        console.log(decoded.roles)
        if (decoded.roles.includes("ROLE_ADMIN")) {
            navigate("/admin/dashboard");
        } else {
            console.log("/home")
            navigate("/home");
        }
    }

    async function signUp(data: SignUpData) {

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
        <AuthContext.Provider value={{ user, userRoles,  isAuthenticated, loading, signIn, signUp, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}