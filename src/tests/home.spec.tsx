import { render, screen, fireEvent, getByText } from "@testing-library/react";
import AxiosMock from 'axios-mock-adapter';
import Home, { getStaticProps } from "../pages/";
import { api } from "../services/api";
import { mocked } from "jest-mock";

type Product = {
    name: string;
    id: string;
    description: string;
    price: number;
    image: string;
};

type PropTypes = {
    products: Product[];
};

const products = [
    {
        name: "Bordado",
        id: '1',
        description: "Bordado de borboleta 23 cm",
        price: 80,
        image: "https://img.elo7.com.br/product/original/35D9272/bordado-em-bastidor-borboleta-azul-bordado-livre.jpg",
    },
    {
        name: "Toalha",
        id: '2',
        description: "Toalha com ponto cruz",
        price: 100,
        image: "https://img.elo7.com.br/product/zoom/19F735B/toalha-de-lavabo-flores-primavera-lavabo.jpg",
    },
];

/* Dica: testar o que o usuário irá ver, não o que você implementou...

* 1- verificar se há produtos para o usuário ver
  2- verificar se os produtos estão com todas as informações
  3- verificar se a função está sendo chamada para comprar o produto
  4- verificar se o objeto está correto antes de enviar a mensagem para o whatsapp
  5- verificar se a api do whatsapp abriu
*/
const apiMock = new AxiosMock(api);

const mockedData = [
    {
        ref: { "@ref": { id: "324245074031411792" } },
        data: {
            name: "Bordado",
            description: "Bordado de borboleta 23 cm",
            price: 80,
            image: "https://img.elo7.com.br/product/original/35D9272/bordado-em-bastidor-borboleta-azul-bordado-livre.jpg",
        },
    },
    {
        ref: {"@ref": { id: "324245074031411793" }},
        data: {
            name: "Toalha",
            description: "Toalha com ponto cruz",
            price: 100,
            image: "https://img.elo7.com.br/product/zoom/19F735B/toalha-de-lavabo-flores-primavera-lavabo.jpg",
        },
    },
]

describe("Home page", () => {
    it("Should load initial products in getStaticProps", async () => {
        apiMock.onGet('products').reply(200, mockedData);

        const response = await getStaticProps({});
        
        const expectedResultData = mockedData.map((item) => {
            return {
                ...item.data,
                id: item.ref["@ref"].id,
            }
        })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    products: expectedResultData
                }
            })
        )
    });

    it("Should correctly render all products received via props", () => {
        render(<Home products={products} />)

        for (let product of products) {
            expect(screen.getByText(product.name)).toBeInTheDocument()
            expect(screen.getByText(product.description)).toBeInTheDocument()
            expect(screen.getByText(`R$ ${product.price},00`)).toBeInTheDocument()
        }

        expect(screen.getAllByText('Comprar').length).toEqual(2);
    })

    it("Should call the buy function when clicking on the product button", () => {
        const open = jest.fn((url) => {
            expect(url).toBe("https://api.whatsapp.com/send?phone=5584987146852&text=Olá! Eu gostaria muito de comprar esse produto.\n\n Produto: Bordado\n Preço: R$\xA080,00\n\n");
        });

        Object.defineProperty(window, 'open', { value: open });

        render(<Home products={products} />)

        const toBuy = screen.getAllByText("Comprar")[0]
        fireEvent.click(toBuy)

        expect(open).toHaveBeenCalled();
    })
});
