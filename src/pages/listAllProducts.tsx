import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Table,
    Tbody,
    Td,
    Thead,
    Tr,
    Th,
    TableCaption,
    Tag,
    TagLabel,
    Image,
    Checkbox,
    Badge,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Stack,
    FormLabel,
    Input,
    DrawerFooter,
    useDisclosure,
} from "@chakra-ui/react";
import { parseCookies } from "nookies";
import React, { useContext, useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { GrAdd } from "react-icons/gr";
import { AuthContext } from "../contexts/authProvider";
import { api } from "../services/api";
import { Product } from "../types/product";

export default function ListAllProducts() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { signOut, user } = useContext(AuthContext);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const { "catalog-client": token } = parseCookies();
        if (!token) {
            signOut();
        }
    }, [signOut]);

    useEffect(() => {
        if (user) {
            api.get("/api/products", {
                headers: {
                    userId: user?.id as string,
                },
            })
                .then((result) => {
                    const productList = result.data.map((item: any) => {
                        return {
                            ...item.data,
                            id: item.ref["@ref"].id,
                        };
                    });
                    setProducts(productList);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user]);

    return (
        <Flex
            flexDirection="column"
            width={"100wh"}
            minHeight="100vh"
            backgroundColor="gray.300"
        >
            <HStack
                w="100%"
                h="15%"
                p="2rem"
                justifyContent="space-between"
                bg="gray.50"
            >
                <Tag size="lg" bg="blue.600" color="white" borderRadius="full">
                    <Avatar
                        src={user?.avatar}
                        size="md"
                        name={user?.name}
                        ml={-3}
                        mr={2}
                    />
                    <TagLabel>{user?.name}</TagLabel>
                </Tag>
                <Button
                    size="md"
                    bg="blue.600"
                    color="white"
                    leftIcon={<FiLogOut />}
                    onClick={signOut}
                >
                    <p>Sair</p>
                </Button>
            </HStack>

            <Drawer
                size="sm"
                isOpen={isOpen}
                placement="right"
                // initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Adicione um novo produto
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="24px">
                            <Box>
                                <FormLabel htmlFor="name">Nome</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="name"
                                    placeholder="Nome do produto"
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="imageURL">Imagem</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="imageURL"
                                    placeholder="Link da imagem"
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="description">
                                    Descrição
                                </FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="description"
                                    placeholder="Descrição do produto"
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="quantity">
                                    Quantidade
                                </FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="quantity"
                                    type="number"
                                    placeholder="Quantidade"
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="price">Preço</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="price"
                                    type="number"
                                    placeholder="Preço"
                                />
                            </Box>
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter borderTopWidth="1px">
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="blue">Salvar</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Flex w={"90%"} justifyContent="end" m="0">
                <Button
                    size="md"
                    mt="2rem"
                    leftIcon={<GrAdd />}
                    bg="blue.600"
                    color="white"
                    onClick={onOpen}
                >
                    <p>Cadastrar novo produto</p>
                </Button>
            </Flex>

            <Table size={"lg"} bg="gray.50" m="1rem auto" w={"80%"}>
                <TableCaption mt="0" bg="gray.50">
                    <Badge
                        m="1rem"
                        borderRadius="full"
                        px="3"
                        bg="blue.600"
                        color="white"
                    >
                        Total de produtos: {products.length}
                    </Badge>
                </TableCaption>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th></Th>
                        <Th>Produto</Th>
                        <Th>Descrição</Th>
                        <Th>Preço</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {products.map((product) => {
                        return (
                            <Tr key={product.id}>
                                <Td>
                                    <Checkbox />
                                </Td>
                                <Td>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width="100px"
                                        height="60px"
                                        objectFit="cover"
                                    />
                                </Td>
                                <Td>{product.name}</Td>
                                <Td>{product.description}</Td>
                                <Td>
                                    {product.price.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Flex>
    );
}
