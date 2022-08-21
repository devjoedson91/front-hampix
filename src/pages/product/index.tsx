import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";
import styles from './styles.module.scss';
import { Header } from "../../components/Header";

import { canServeSideAuth } from "../../utils/canServeSideAuth";

import { FiUpload } from "react-icons/fi";

import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

// tipagens

type ItemProps = {

    id: string;
    name: string;

}

interface CategoryProps {

    categoryList: ItemProps[];

}

export default function Product({ categoryList }: CategoryProps) {

    const [name, setName] = useState('');

    const [price, setPrice] = useState('');

    const [description, setDescription] = useState('');

    const [categories, setCategories] = useState(categoryList || []);

    const [categorySelected, setCategorySelected] = useState(0);

    const [avatarUrl, setAvatarUrl] = useState('');

    const [imageAvatar, setImageAvatar]  = useState(null);

    function handleFile(event: ChangeEvent<HTMLInputElement>) {

        if (!event.target.files) return;

        const image = event.target.files[0];

        if (!image) return;

        if (image.type === 'image/jpeg' || image.type === 'image/jpg' || image.type === 'image/png') {

            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(event.target.files[0]));

        }

    }

    function handleChangeCategory(event) {

        setCategorySelected(event.target.value);

    }

    async function handleRegister(event: FormEvent) {

        event.preventDefault();

        try {

            const data = new FormData(); // multipart formdata

            if (name === '' || price === '' || description === '' || imageAvatar === null) {

                toast.error('Preencha todos os campos');
                return;

            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            const apiClient = setupAPIClient();

            await apiClient.post('/product', data);

            toast.success('Produto cadastrado com sucesso!');

        } catch(err) {

            console.log(err);
            toast.error('Erro ao cadastrar');
        }


        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');

    }

    return (

        <>

            <Head>
                <title>Novo Produto - Hampix</title>
            </Head>

            <div>
                <Header />

                <main className={styles.container}>

                    <h1>Novo Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        <label className={styles.labelAvatar}>
                            <span><FiUpload size={30} color='#fff'/></span>

                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg" 
                                onChange={handleFile}
                            />

                            {avatarUrl && (

                                <img 
                                    src={avatarUrl} 
                                    alt="foto do produto" 
                                    width={250} 
                                    className={styles.preview}
                                /> 

                            )}

                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map((item, index) => {

                                return (
                                    <option key={item.id} value={index}>{item.name}</option>
                                );

                            })}
                        </select>

                        <input 
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input 
                            type="text"
                            placeholder="Preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder="Descreva seu produto..."
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>

                        <button type="submit" className={styles.buttonAdd}>Cadastrar</button>

                    </form>

                </main>
            </div>

        </>

    );

}

// esse server side será executado antes da pagina ser montada na tela

export const getServerSideProps = canServeSideAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/category');

    return {
        props: {
            categoryList: response.data
        }
    }

});