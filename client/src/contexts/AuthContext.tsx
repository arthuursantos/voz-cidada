import {createContext, ReactNode, useEffect, useState} from "react";
import api from "@/shared/axios.ts";
import {setCookie, parseCookies, destroyCookie} from "nookies";
import {useNavigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode";
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
}

export type UpdateUserData = {
    cep: string;
}

export type FuncionarioData = {
    cpf: string;
    cargo: string;
    setor: string;
    email: string;
    senha: string;
}

type Admin = {
    id: number;
    cpf: string;
    cargo: string;
    setor: string;
    dataCadastro: string;
}

export type JWTClaims = {
    sub: string;
    iss: string;
    token_type: string;
    auth_status: string;
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

export type ProfileData = {
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
    user: User | null,
    admin: Admin | null,
    userRoles: string[] | null,
    authStatus: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    signIn: (data: SignInData) => Promise<void>,
    signUp: (data: SignUpData) => Promise<void>,
    signOut: () => void,
    getCepApi: (cep: string) => Promise<any>,
    updateUser: (data: UpdateUserData) => Promise<void>,
    changePassword: (data: any) => Promise<void>,
    oAuthSignIn: (googleData: any) => Promise<void>,
    oAuthSignUp: (profileData: ProfileData) => Promise<void>,
    isGoogleUser: boolean,
    userProfilePicture: string | null,
    criarFuncionario: (data: FuncionarioData) => Promise<void>,
    deletarFuncionario: (id: number) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [admin, setAdmin] = useState<Admin | null>(null)
    const [loading, setLoading] = useState(true)
    const [userRoles, setUserRoles] = useState<string[] | null>(null)
    const [authStatus, setAuthStatus] = useState<string | null>(null)
    const isAuthenticated = !!userRoles;
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const {"vozcidada.accessToken": accessToken} = parseCookies();
        if (accessToken) {
            try {

                const decoded = jwtDecode<JWTClaims>(accessToken);
                setUserRoles(decoded.roles);
                setAuthStatus(decoded.auth_status)

                if (decoded.auth_status === "SIGNIN") {
                    setTimeout(() => {
                        navigate("/signup/oauth");
                    }, 0);
                }

                if (decoded.roles.includes("ROLE_ADMIN")) {
                    api.get(`/api/funcionario/auth/${decoded.sub}`)
                        .then(response => {
                            setAdmin(response.data)
                        })
                        .catch(() => {
                            setAdmin(null)
                            setUserRoles(null)
                        })
                        .finally(() => {
                            setLoading(false)
                        })
                    navigate("/admin/dashboard");
                } else {
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
                    navigate("/home");
                }

            } catch {
                setAdmin(null)
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

    async function signIn({login, password}: SignInData) {
        const response: SignInResponse = await api.post("/auth/login", {
            login,
            password
        });

        const {accessToken, refreshToken} = response.data;
        const decoded = jwtDecode<JWTClaims>(accessToken);

        setUserRoles(decoded.roles);
        setTokens(accessToken, refreshToken)

        if (decoded.roles.includes("ROLE_ADMIN")) {
            api.get(`/api/funcionario/auth/${decoded.sub}`)
                .then(response => {
                    setAdmin(response.data)
                    navigate("/admin/dashboard");

                })
        }

        api.get(`/api/usuario/auth/${decoded.sub}`)
            .then(response => {
                setUser(response.data)
                navigate("/home");
            })
            .catch(() => {
                navigate("/signup/oauth")
            });
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
        setAuthStatus(null);
        setIsGoogleUser(false);
        
        // Redireciona para a página de login
        navigate("/signin");

    }

    async function oAuthSignIn(googleData: any) {
        try {
            const googleresponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${googleData.access_token}`
                }
            });

            setIsGoogleUser(true)

            const response = await api.post("/auth/oauth/google", {
                email: googleresponse.data.email
            });

            setUserProfilePicture(googleresponse.data.picture);

            const {accessToken, refreshToken} = response.data;
            setTokens(accessToken, refreshToken);

            const decoded = jwtDecode<JWTClaims>(accessToken);
            setUserRoles(decoded.roles);
            setAuthStatus(decoded.auth_status)

            setCookie(undefined, "vozcidada.authType", "OAuth", {
                maxAge: 60 * 60 * 1 // 1h
            })

            if (decoded.auth_status !== "SIGNIN") {
                try {

                    if (decoded.roles.includes("ROLE_ADMIN")) {
                        api.get(`/api/funcionario/auth/${decoded.sub}`)
                            .then(response => {
                                setAdmin(response.data)
                            })
                        navigate("/admin/dashboard")
                    }

                    api.get(`/api/usuario/auth/${decoded.sub}`)
                        .then(response => {
                            setUser(response.data)
                        });
                    navigate("/home");

                } catch {
                    console.error("Não foi possível recuperar as informações de usuário.");
                }
            } else {
                setTimeout(() => {
                    navigate("/signup/oauth");
                }, 0);
            }
        } catch {
            console.error("Não foi possível se autenticar com sua conta Google.");
        }
    }

    async function signUp(data: SignUpData) {

        const infoCep = await getCepApi(data.cep)

        console.log(infoCep)

        await api.post("/auth/register", {
            login: data.email,
            password: data.password,
            role: "USER",
            AuthStatus: "SIGNUP",
        })

        console.log("registrando user");
        
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
            navigate("/dashboard");
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

    async function oAuthSignUp(data: ProfileData) {
        const infoCep = await getCepApi(data.cep)

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

        const {"vozcidada.accessToken": tokenBeforeUpdate} = parseCookies();
        const decoded = jwtDecode<JWTClaims>(tokenBeforeUpdate);

        const userResponse = await api.get(`/api/usuario/auth/${decoded.sub}`);
        setUser(userResponse.data);
        setIsGoogleUser(true);
        
        const updateTokens = await api.patch("/auth/updateAuthStatus");
        const {accessToken, refreshToken} = updateTokens.data;
        setTokens(accessToken, refreshToken)
        setCookie(undefined, "vozcidada.authType", "OAuth", {
            maxAge: 60 * 60 * 1 // 1h
        })

        navigate("/dashboard")
    }

    const criarFuncionario = async (data: FuncionarioData) => {

        try {
            await api.post("/auth/register", {
                login: data.email,
                password: data.senha,
                role: "admin",
                AuthStatus: "SIGNUP"
            });

            const dataCadastro = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await api.post('/api/funcionario', {
                cpf: data.cpf,
                cargo: data.cargo,
                setor: data.setor,
                dataCadastro: dataCadastro
            });

        } catch (error) {
            console.error("Erro ao criar funcionário:", error);
            throw new Error("Erro ao criar funcionário. Tente novamente.");
        }
    }

    const deletarFuncionario = async (id: number) => {
        try {
            await api.delete(`/api/funcionario/${id}`);
        } catch (error) {
            console.error("Erro ao deletar funcionário:", error);
            throw new Error("Erro ao deletar funcionário. Tente novamente.");
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                admin,
                userRoles,
                authStatus,
                isAuthenticated,
                loading,
                signIn,
                signUp,
                signOut,
                getCepApi,
                updateUser,
                changePassword,
                oAuthSignIn,
                oAuthSignUp,
                isGoogleUser,
                userProfilePicture,
                criarFuncionario,
                deletarFuncionario
            }}>
            {children}
        </AuthContext.Provider>
    )
}
