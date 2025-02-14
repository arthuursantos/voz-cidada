import {createContext} from "react";
import api from "@/lib/axios.ts";
import { setCookie } from "nookies";

type AuthContextType = {
    isAuthenticated: boolean;
}

type SignInData = {
    login: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
    const isAuthenticated = false;

    async function signIn({ login, password }: SignInData) {
        const { accessToken, refreshToken } = api.post("/auth/login", {
            login,
            password
        })

        setCookie(undefined, "vozcidada.accessToken", accessToken, {
            maxAge:
        })
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}