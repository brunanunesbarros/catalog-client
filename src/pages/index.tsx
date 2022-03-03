import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Image } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { api } from "../services/api";
import { ProductCard } from "../components/ProductCard";

type Product = {
    name: string;
    id: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
};

type PropTypes = {
    products: Product[];
};

const Home = ({ products }: PropTypes) => {
    function handleBuy(
        productName: string,
        productPrice: number,
        quantity: number
    ) {
        const productToBuy = {
            productName,
            productPrice: productPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            quantity,
            precoTotal: (productPrice * quantity).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
        };
        console.log(productToBuy);
        let mensagem = `Olá! Eu gostaria muito de comprar esse produto.\n\n Produto: ${productName}\n Preço: ${productToBuy.productPrice}\n\n Quantidade: ${quantity}\n\n Preço Total: ${productToBuy.precoTotal}`;
        window.open(
            `https://api.whatsapp.com/send?phone=5584987146852&text=${mensagem}`
        );
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Catálogo Amiamor</title>
                <meta
                    name="description"
                    content="Catálogo online de produtos"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Bem vindo ao <a>AmiAmor!</a>
                </h1>

                <p className={styles.description}>
                    Encomende já o seu produto conosco.
                </p>

                <div className={styles.grid}>
                    {products.map((product) => {
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                handleBuy={handleBuy}
                            />
                        );
                    })}
                </div>
            </main>

            <footer className={styles.footer}>
                <span className={styles.logo}>
                    <Image
                        src={
                            "data:image/jpeg;base64,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kv8AntQfnAyjoPUW0fqp7yjSq1sCp7lMAk+6x9fL6njsZr3QensUrdQ3rU2q3jK58NtyKighFDeZAJyfp5TJfZBeE9c0qbff8U/Xw2P/ABNP9nNXwr7UdKpk7KN05QeShyTgfAFTx8YF6iIgIiICIiAiIgIiICIiBEa9pB1ZrcFgq0rhKzDH72wNgf5ip/DKT7ZunrjXLe2qaVSao1M1AwXuAwUjj8M02IGX9LdF3DdL2VK9xSqULvxyrcnbntx2Y8H9ZqERAzr2jdAV+rdUp3lpWRFWnsIcN33E5BA884+nxnfWekbit0RT6WsBRYKqhqtR2Taytu4RUbIPPO4d5fogU72cdM1+ldIewv3pOGfeNm7glQDktjIwq4wB5y4xEDnWBeiyIcEggH0OJWrvQWtfZ4+g23vutsyLjjc209gfVv1lpiBiPs06LvLbU7g6tRaklS3qUsvjkvt7Dz4BzNX6V0ptD6eo6ZXYM1NdpZc4PJPGefOS8QIDrbQ26k6bqaVbMqM5Qhmzj3WDc458pAez7oE9MW9xT1N0qiuqqyhTt2jdkHd3zuIxiX6IGY1fZFTtr8X2hXdW3cNuXgNs+AIKnGMjknjvmW7Q+l6WiaPU0+g7s1XcalVjl3Zxgsfl5D9SSTYIgZd0X7L6nTvU6arcV0daYbaFUgkspXkHgABieCecS59N9OroL3FRXLtcV3rMSuMbjwvc5288+eT2k9EBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERA//Z"
                        }
                        alt="logo"
                        width={50}
                        height={50}
                    />
                </span>
            </footer>
        </div>
    );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
    const result = await api.get("/products");
    const productList = result.data.map((item: any) => {
        return {
            ...item.data,
            id: item.ref["@ref"].id,
        };
    });
    return {
        props: {
            products: productList,
        },
    };
};
