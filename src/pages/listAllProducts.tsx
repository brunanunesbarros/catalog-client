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
    Icon,
    Tooltip,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import { parseCookies } from "nookies";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

import { FiLogOut } from "react-icons/fi";
import { GrAdd } from "react-icons/gr";
import { ImBin } from "react-icons/im";
import { BiEdit } from "react-icons/bi";

import { AuthContext } from "../contexts/authProvider";
import { api } from "../services/api";
import { Product } from "../types/product";

export default function ListAllProducts() {
    const [isOpenDialog, setIsOpen] = React.useState(false);
    const onCloseDialog = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { signOut, user } = useContext(AuthContext);

    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>();
    const [id, setId] = useState<string>("");

    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const { "catalog-client": token } = parseCookies();
        if (!token) {
            signOut();
        }
    }, [signOut]);

    const fetchProducts = useCallback(() => {
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

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    async function handleCopyUrl() {
        const url = `${process.env.NEXT_PUBLIC_HOST_APP}?code=${user?.id}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Link copiado com sucesso!");
        } catch (err) {
            toast.error("Hmm, algo deu errado, tente novamente.");
        }
    }

    function handleAddProduct() {
        setIsEditing(false);
        onOpen();
        setName("");
        setUrl("");
        setDescription("");
        setPrice(0);
        setId("");
    }

    function addNewProduct() {
        const newProduct = {
            name,
            url,
            description,
            price,
        };

        api.post("/api/addNewProduct", newProduct)
            .then(() => {
                toast.success("Produto adicionado com sucesso!");
                onClose();
                fetchProducts();
            })
            .catch((error) => {
                console.log(error);
                toast.error("Ops, algo deu errado, tente novamente...");
            });
    }

    function deleteProduct(id: string) {
        setIsOpen(true);

        if (isOpenDialog) {
            api.delete("/api/deleteProducts", { data: id })
                .then(() => {
                    toast.success("Produto excluído com sucesso!");
                    onCloseDialog();
                    fetchProducts();
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Ops, algo deu errado, tente novamente.");
                });
        }
    }

    function handleEditingProduct(product: Product) {
        setIsEditing(true);
        
        onOpen();
        setName(product.name);
        setUrl(product.image);
        setDescription(product.description);
        setPrice(product.price);
        setId(product.id)
    }

    function updateProduct() {
        api.put(`/api/products/${id}`, {
            name,
            url,
            description,
            price,
        })
            .then(() => {
                toast.success("Produto alterado com sucesso!");
                onClose();
                fetchProducts();
            })
            .catch((error) => {
                console.log(error);
                toast.error("Ops, algo deu errado, tente novamente...");
            });
    }

    function handleSaveButton() {
        if (isEditing) {
            updateProduct();
        } else {
            addNewProduct();
        }
    }

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
                <Flex>
                    <Tag as="button" onClick={handleCopyUrl} m="0 1rem">
                        Copiar link da loja
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
                </Flex>
            </HStack>

            <Drawer
                size="sm"
                isOpen={isOpen}
                placement="right"
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
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    id="name"
                                    placeholder="Nome do produto"
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="imageURL">Imagem</FormLabel>
                                <Input
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    id="imageURL"
                                    placeholder="Link da imagem"
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="description">
                                    Descrição
                                </FormLabel>
                                <Input
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    id="description"
                                    placeholder="Descrição do produto"
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor="price">Preço</FormLabel>
                                <Input
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(Number(e.target.value))
                                    }
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
                        <Button colorScheme="blue" onClick={handleSaveButton}>
                            Salvar
                        </Button>
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
                    onClick={handleAddProduct}
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
                        {/* <Th></Th> */}
                        <Th></Th>
                        <Th>Produto</Th>
                        <Th>Descrição</Th>
                        <Th>Preço</Th>
                        <Th>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {products.map((product) => {
                        return (
                            <Tr key={product.id}>
                                {/* <Td>
                                    <Checkbox />
                                </Td> */}
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
                                <Td>
                                    <Tooltip label="Excluir produto">
                                        <Button
                                            size="sm"
                                            bg="red"
                                            color="white"
                                            marginInline="0.2rem"
                                            onClick={() =>
                                                deleteProduct(product.id)
                                            }
                                        >
                                            <Icon as={ImBin} />
                                            <AlertDialog
                                                isOpen={isOpenDialog}
                                                leastDestructiveRef={cancelRef}
                                                onClose={onCloseDialog}
                                            >
                                                <AlertDialogOverlay>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader
                                                            fontSize="lg"
                                                            fontWeight="bold"
                                                        >
                                                            Delete Customer
                                                        </AlertDialogHeader>

                                                        <AlertDialogBody>
                                                            Are you sure? You
                                                            cant undo this
                                                            action afterwards.
                                                        </AlertDialogBody>

                                                        <AlertDialogFooter>
                                                            <Button
                                                                ref={cancelRef}
                                                                onClick={
                                                                    onCloseDialog
                                                                }
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                colorScheme="red"
                                                                onClick={() =>
                                                                    deleteProduct(
                                                                        product.id
                                                                    )
                                                                }
                                                                ml={3}
                                                            >
                                                                Deletar
                                                            </Button>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialogOverlay>
                                            </AlertDialog>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip label="Editar produto">
                                        <Button
                                            size="sm"
                                            bg="blue.600"
                                            color="white"
                                            onClick={() =>
                                                handleEditingProduct(product)
                                            }
                                        >
                                            <Icon as={BiEdit} />
                                        </Button>
                                    </Tooltip>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
            <Toaster />
        </Flex>
    );
}
