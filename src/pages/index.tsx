import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from '../../styles/home.module.scss';

import logoImg from '../../public/logo.png';
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

import Link from "next/link"; // componente de navegação

import { AuthContext } from "../contexts/AuthContext";

import { toast } from 'react-toastify';

import { canServeSideGuest } from "../utils/canServeSideGuest";

export default function Home() {

    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    async function handleLogin(event: FormEvent) {

        event.preventDefault();

        // verificando o usuario passou alguma coisa

        if (email === '' || password === '') {
            toast.warning('Preencha todos os campos');
            return;
        }

        setLoading(true);

        let data = { email, password };

        await signIn(data);

        setLoading(false);

    }

    return (
        <>
            <Head>
                <title>Hampix - login</title>
            </Head>

            <div className={styles.containerCenter}>

                <Image src={logoImg} alt='Logo hampix' />

                <div className={styles.login}>

                    <form onSubmit={handleLogin}>

                        <Input 
                            placeholder="Digite seu email" 
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input 
                            placeholder="Sua senha" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button type='submit' loading={loading}>Acessar</Button>

                    </form>

                    <Link href='/signup'>
                        <a className={styles.text}>Não possui uma conta? Cadastre-se</a>
                    </Link>

                </div>
                
            </div>

        </>
    );
}


// estrutura de serve-side, a interface será exibida apos passar por ela

export const getServerSideProps = canServeSideGuest(async (ctx) => {

    return {
        props: {}
    }

})

