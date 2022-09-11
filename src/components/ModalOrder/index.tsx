import Modal from 'react-modal';
import styles from './styles.module.scss';
import { formatPrice } from '../../utils/format';
import { FiX } from 'react-icons/fi';

import { OrderItemProps } from '../../pages/dashboard';

interface ModalOrderProps {

    isOpen: boolean;
    onRequestClose: () => void;
    order: OrderItemProps[];
    handleFinishOrder: (id: string) => void;

}

export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {

    const total = formatPrice(
        order.reduce((sumTotal, item) => {
            return sumTotal += parseFloat(item.product.price) * item.amount;
        }, 0)
    )

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            backgroundColor: '#1d1d2e',
            transform: 'translate(-50%, -50%)'
        }
    }

    console.log(order);

    const orderName = order[0].order.name;
    const orderTable = order[0].order.num_table;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >

            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{background: 'transparent', border: 0}}
            >
                <FiX size={35} color='#f34748'/>
            </button>

            <div className={styles.container}>

                <h2>Detalhes do Pedido</h2>
                <span className={styles.table}>
                    {order[0].order.delivery ? '' : `Mesa: ${orderTable}`}
                </span>

                <span className={styles.table}>
                    Nome do cliente: <strong style={{color: '#fff'}}>{ orderName === '' ? 'Não informado' : orderName }</strong>
                </span>

                {order.map(item => (
                    <section key={item.id} className={styles.containerItem}>

                        <span>{item.amount} - <strong>{item.product.name}</strong></span>
                        <span className={styles.description}>{item.product.description}</span>
                        
                    </section>
                ))}

                <span className={styles.table}>Total</span>
                <span className={styles.description}>{total}</span>
                
                <button 
                    className={styles.buttonOrder} 
                    onClick={() => handleFinishOrder(order[0].order_id)}
                >
                    Concluir Pedido
                </button>

            </div>
            
        </Modal>
    );

}