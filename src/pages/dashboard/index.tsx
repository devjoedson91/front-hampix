import { useState } from "react";
import Head from "next/head";
import { canServeSideAuth } from "../../utils/canServeSideAuth";
import styles from './styles.module.scss';

import { Header } from "../../components/Header";
import { FiRefreshCcw } from "react-icons/fi";

import { setupAPIClient } from "../../services/api";

import Modal from 'react-modal';

import { ModalOrder } from '../../components/ModalOrder';

type OrderItem = {
    id: string;
    num_table: string | number;
    delivery: boolean;
    status: boolean;
    draft: boolean;
    name: string | null;
    updated_at: string;
}

interface HomeProps {

    orders: OrderItem[];

}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: {
        id: string;
        num_table: number;
        delivery: boolean;
        status: boolean;
        name: string | null;
    }
}

export default function Dashboard({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders || []);

    const [modalItem, setModalItem] = useState<OrderItemProps[]>();

    const [modalVisible, setModalVisible] = useState(false);

    function handleCloseModal() {

        setModalVisible(false);

    }

    async function handleOpenModalView(id: string) {

        const apiClient = setupAPIClient();

        const response = await apiClient.get('/order/detail', {
            params: {
                order_id: id
            }
        })

        setModalItem(response.data);
        setModalVisible(true);

    }

    async function handleFinishItem(id: string) {

        const apiClient = setupAPIClient();

        await apiClient.put('/order/finish', { order_id: id });

        const response = await apiClient.get('/orders');

        setOrderList(response.data);

        setModalVisible(false);

    }

    async function handleRefreshOrders() {

        const apiClient = setupAPIClient();

        const response = await apiClient.get('/orders');

        setOrderList(response.data);

    }

    Modal.setAppElement('#__next'); // __next div principal do doc html do projeto

    return (
        <>
            <Head>
                <title>Painel - Hampix</title>
            </Head>

            <div>
                <Header />
                
                <main className={styles.container}>

                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>

                        <button className={styles.rotation} onClick={handleRefreshOrders}>
                            <FiRefreshCcw size={25} color='#3fffa3' />
                        </button>

                    </div>

                    <article className={styles.listOrders}>

                        {orderList.length === 0 && (
                            <span className={styles.emptyList}>
                                Sem novos pedidos até o momento...
                            </span>
                        )}

                        {orderList.map(item => (

                            <section className={styles.orderItem} key={item.id}>

                                <button onClick={() => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>
                                        {item.delivery ? 'Pedido para delivery' : `Mesa ${item.num_table}`} 
                                    </span>
                                </button>

                                <span>
                                    Data do Pedido: {new Date(item.updated_at).toLocaleDateString()} as {new Date(item.updated_at).toLocaleTimeString()}
                                </span>

                            </section>

                        ))}

                    </article>

                </main>

                {modalVisible && ( 
                    <ModalOrder 
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        order={modalItem}
                        handleFinishOrder={handleFinishItem}
                    />                
                )}

            </div>
        </>
    );

}

// Server side

export const getServerSideProps = canServeSideAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/orders');

    return {
        props: {
            orders: response.data
        }
    }

});