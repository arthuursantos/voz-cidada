import {createContext, ReactNode, useEffect, useState} from "react";
import api from "@/lib/axios.ts";
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import { parseCookies, setCookie, destroyCookie } from "nookies";
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
    email: string;
    picture: string;
}

export type UpdateUserData = {
    cep: string;
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
    signUp: (data: SignUpData) => Promise<void>,
    signOut: () => void,
    getCepApi: (cep: string) => Promise<any>,
    updateUser: (data: UpdateUserData) => Promise<void>,
    changePassword: (data: any) => Promise<void>,
    signInWithGoogle: (googleData: any) => Promise<void>,
    isGoogleUser: boolean
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [userRoles, setUserRoles] = useState<string[] | null>(null)
    const isAuthenticated = !!userRoles;
    const [isGoogleUser, setIsGoogleUser] = useState(true);

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
        try {
            const response: SignInResponse = await api.post("/auth/login", {
                login,
                password
            });

            const { accessToken, refreshToken } = response.data;
            setTokens(accessToken, refreshToken);

            const decoded = jwtDecode<JWTClaims>(accessToken);
            setUserRoles(decoded.roles);

            const userResponse = await api.get(`/api/usuario/auth/${decoded.sub}`);
            setUser(userResponse.data);
            setIsGoogleUser(false)

            if (decoded.roles.includes("ROLE_ADMIN")) {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        }
        catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Erro ao fazer login. Verifique suas credenciais e tente novamente.");
        }
    }

    const getCepApi = async (cep: string) =>{
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error("Erro ao buscar CEP");

            const data = await response.json();
            if (data.erro) throw new Error("CEP não encontrado");

            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.warn(error.message);
            } else {
                console.warn("Unknown error occurred");
            }
            return null;
        }
    }

    // Dentro do AuthContext
    async function signOut() {
        // Remove os cookies de acesso
        destroyCookie(null, "vozcidada.accessToken");
        destroyCookie(null, "vozcidada.refreshToken");
        
        // Limpa o estado do usuário e roles
        setUser(null);
        setUserRoles(null);
        setIsGoogleUser(false)
        // Redireciona para a página de login
        navigate("/signin");
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
        setUser({
            id: 0,
            nome: googleresponse.data.name,
            cpf: "00000000000",
            dataNascimento: "0000-00-00",
            dataCadastro: new Date().toISOString().slice(0, 19).replace('T', ' '),
            cep: "00000000",
            rua: "Rua Google",
            bairro: "Bairro Google",
            cidade: "Cidade Google",
            uf: "UF",
            email: googleresponse.data.email,
            picture: googleresponse.data.picture
        })
        setIsGoogleUser(true);
        if (decoded.roles.includes("ROLE_ADMIN")) {
            navigate("/admin/dashboard");
        } else {
            console.log("/home")
            navigate("/home");
        }
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

    async function updateUser(data: UpdateUserData) {

        const novoEndereco = await getCepApi(data.cep);

        const userAtualizado = {
            id: user?.id,
            nome: user?.nome,
            cpf: user?.cpf,
            dataNascimento: user?.dataNascimento,
            dataCadastro: user?.dataCadastro,
            cep: data.cep,
            rua: novoEndereco.logradouro,
            bairro: novoEndereco.bairro,
            cidade: novoEndereco.localidade,
            uf: novoEndereco.uf
        }

        try {      
            const response = await api.put("/api/usuario", userAtualizado);
    
            setUser(response.data);
        }
        catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert("Erro ao atualizar usuário. Tente novamente.");
        }
    }

    async function changePassword(data: any) {

        const updatePasswordData = {
            currentPassword: data.senhaAtual,
            newPassword: data.senha
        }

        try {
            await api.patch("/auth/changePassword", updatePasswordData);
        } catch (error) {
            throw new Error("Erro ao tentar redefinir a senha.");
        }
    }

    return (
        <AuthContext.Provider value={{ user, userRoles,  isAuthenticated, loading, signIn, signUp, signInWithGoogle, getCepApi, updateUser, changePassword, signOut, isGoogleUser }}>
            {children}
        </AuthContext.Provider>
    )
}