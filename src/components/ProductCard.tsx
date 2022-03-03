import { Button, HStack, Input, Image, useNumberInput } from "@chakra-ui/react";
import { useState } from "react";
import { BsCart4 } from "react-icons/bs";
import styles from "../styles/Home.module.css";

type ProductProps = {
    product: Product;
    handleBuy: (productName: string, productPrice: number, quantity: number) => void;
};

type Product = {
    name: string;
    id: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
};

export const ProductCard = ({ product, handleBuy }: ProductProps) => {
    const [quantity, setQuantity] = useState(0);

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 0,
            defaultValue: 1,
            min: 1,
            max: 3,
            precision: 1,
            value: quantity
        });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps({ readOnly: true});

    return (
        <>
            <a key={product.id} className={styles.card}>
                <Image
                    boxSize="100%"
                    height="150px"
                    objectFit="cover"
                    src={product.image}
                    alt={product.name}
                    className={styles.container}
                />
                <h3 key={product.id}>{product.name}</h3>
                <span>{product.description}</span>
                <p>
                    {product.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </p>
                <HStack maxW="350px">
                    <Button size="sm" {...dec} onClick={() => setQuantity(quantity - 1)}>
                        -
                    </Button>
                    <Input
                        size="sm"
                        maxW="40px"
                        {...input}
                        value={quantity}
                    />
                    <Button size="sm" {...inc} onClick={() => setQuantity(quantity + 1)}>
                        +
                    </Button>

                    <Button
                        leftIcon={<BsCart4 color="white" />}
                        colorScheme="blue"
                        size={"sm"}
                        onClick={() => handleBuy(product.name, product.price, quantity)}
                    >
                        Comprar
                    </Button>
                </HStack>
            </a>
        </>
    );
};
