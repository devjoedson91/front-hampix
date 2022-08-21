import '../../styles/globals.scss';
import { AppProps } from 'next/app'; // importando appProps para tipar as propriedades da função myapp
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {

  return (

    <AuthProvider>

        <Component {...pageProps} />

        <ToastContainer autoClose={3000}/>

    </AuthProvider>

  ) // pageProps é todas as paginas do projeto

}

export default MyApp
