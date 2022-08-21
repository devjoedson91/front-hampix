import { createContext, ReactNode, useState, useEffect } from "react";

import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';

import { api } from '../services/apiClient';

import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {

    children: ReactNode;

}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {

    try {

        destroyCookie(undefined, '@hampix.token');

        // depois de destruir o token

        Router.push('/'); // manda o usuario para tela de login

    } catch(error) {

        console.log('erro ao deslogar: ', error);

    }

}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>();

    const isAuthenticated = !!user; // convertendo o user em boolean, se user tiver vazio essa variavel será false

    useEffect(() => {

        // tentar pegar o token no cookie

        const { '@hampix.token': token } = parseCookies();

        if (token) {

            api.get('/userinfo')
                .then(response => {

                    const {id, name, email} = response.data;

                    setUser({id, name, email});

                })
                .catch(() => {

                    // se deu erro desloga o usuario

                    signOut();

                })

        }

    }, []);

    async function signIn({ email, password }: SignInProps) {

        try {

            const response = await api.post('/session', { email, password });

            // gerar o cookie

            const {id, name, token } = response.data;

            setCookie(undefined, '@hampix.token', token, {
                maxAge: 60 * 60 * 24 * 30, // esse cookie vai expirar em 1 mes
                path: '/' // quais caminhos terão acesso ao cookie 
            })

            setUser({ id, name, email });

            // passar para as proximas requisiçoes o token

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            // redirecionar o user para o dashboard

            toast.success('Logado com sucesso!');

            Router.push('/dashboard');

        } catch(err) {
            toast.error('Erro ao acessar');
            console.log('Erro ao acessar usuario: ', err);
        }

    }

    async function signUp({name, email, password}: SignUpProps) {

        try {

            const response = await api.post('/users', { name, email, password });

            toast.success('Conta criada com sucesso!');

            Router.push('/');

        } catch(err) {
            toast.error('Erro ao cadastrar');
            console.log('ERRO AO CADASTRAR: ', err);
        }

    }

    return (

        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp } /* tudo que esta dentro desse value qlq componente vai acessar*/} >

            { children  /* o children são as minhas paginas */}

        </AuthContext.Provider>

    );

}