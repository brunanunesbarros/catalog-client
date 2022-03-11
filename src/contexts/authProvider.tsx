import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../services/api";
import { authProviderProps } from "../types/authProviderProps";
import { User } from "../types/user";

type AuthProviderData = {
    handleLogin: (email: string, password: string) => void;
    signOut: () => void;
    token: string;
    user: User | undefined;
};

export const AuthContext = createContext({} as AuthProviderData);

export function signOut() {
    destroyCookie(undefined, "catalog-client");

    Router.push("/login");
}

export function AuthProvider({ children }: authProviderProps) {
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<User>();

    useEffect(() => {
        api.get('/api/me')
            .then(response => {
                setUser(response.data)
            })
            .catch(error => {
                if (error.response.status === 401 && error.response.data.message === 'jwt expired') {
                    toast.error("Sessão expirada, faça login novamente!")
                    signOut();
                }
            })
    }, [token])

    function handleLogin(email: string, password: string) {
        api.post("/api/auth", {
            email,
            password,
        })
            .then((response) => {
                setCookie(null, "catalog-client", response.data.token, {
                    maxAge: 30 * 24 * 60,
                    path: "/",
                });
                setToken(response.data.token);
                setUser(response.data);
                Router.push('/listAllProducts')
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <AuthContext.Provider value={{ handleLogin, signOut, token, user }}>
            {children}
            <Toaster />
        </AuthContext.Provider>
    );
}
