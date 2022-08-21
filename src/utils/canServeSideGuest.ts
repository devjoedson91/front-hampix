// permitidos para usuarios não logados

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// funcão para paginas que so podem ser acessadas por visitantes

export function canServeSideGuest<P>(fn: GetServerSideProps<P>) {

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        // se o usuario tiver um login salvo será redirecionado

        const coockies = parseCookies(ctx);

        if (coockies['@hampix.token']) {

            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false
                }
            }

        }

        return await fn(ctx);

    }

}