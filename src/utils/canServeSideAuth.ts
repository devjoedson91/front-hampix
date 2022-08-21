import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../services/erros/AuthTokenError";

// funcão para paginas que so podem ser acessadas por usuarios logados

export function canServeSideAuth<P>(fn: GetServerSideProps<P>) {

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => { // o resultado dessa função, quando executada, será uma promise

        const coockies = parseCookies(ctx);

        const token = coockies['@hampix.token'];

        if (!token) {

            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }

        }

        try {

            return await fn(ctx);

        } catch(err) {

            if (err instanceof AuthTokenError) {

                destroyCookie(ctx, '@hampix.token');

                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }

            }

        }

    }

}