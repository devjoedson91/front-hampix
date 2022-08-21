import { useContext } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';

import { FiLogOut } from 'react-icons/fi';

import { AuthContext } from '../../contexts/AuthContext';

export function Header() {

    const { signOut } = useContext(AuthContext);

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>

                <Link href='/dashboard'>
                    <img src="/logo.png" width={190} height={50}  />
                </Link>

                <nav className={styles.menuNav}>
                    <Link href='/category'>
                        <a>Categoria</a>
                    </Link>

                    <Link href='/product'>
                        <a>Cardapio</a>
                    </Link>

                    <div className={`${styles.animation} ${styles.startHome}`}></div>

                    <button onClick={signOut}>
                        <FiLogOut color='#fff' size={23} />
                    </button>
                </nav>

            </div>
        </header>
    );

}