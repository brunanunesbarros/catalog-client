import {
    Avatar,
    Flex,
    Stack,
    Heading,
    Box,
    FormControl,
    Input,
    FormLabel,
    InputLeftElement,
    InputGroup,
    InputRightElement,
    Button,
} from "@chakra-ui/react";

import { MdAlternateEmail } from "react-icons/md";
import { HiLockClosed } from "react-icons/hi";
import { useContext, useEffect, useState } from "react";
import { User } from "../types/user";
import { api } from "../services/api";
import Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import { AuthContext } from "../contexts/authProvider";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowClick = () => setShowPassword(!showPassword);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { handleLogin } = useContext(AuthContext);

    useEffect(() => {
        const { "catalog-client": token } = parseCookies();

        if (token) {
            Router.push('/listAllProducts')
        }
    }, []);

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            backgroundColor="gray.300"
            justifyContent="center"
            alignItems="center"
        >
            <Avatar bg="teal" />
            <Heading color="teal" pb="4" pt="4">
                Bem Vindo
            </Heading>
            <Stack
                backgroundColor="gray.50"
                w={["80%","30%"]}
                h="40%"
                padding="1rem"
                justifyContent="center"
                alignItems="center"
            >
                <Stack marginBottom="">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <MdAlternateEmail />
                        </InputLeftElement>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <HiLockClosed />
                        </InputLeftElement>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width="4.5rem">
                            <Button
                                h="1.75rem"
                                size="sm"
                                onClick={handleShowClick}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Button
                        borderRadius={0}
                        type="submit"
                        variant="solid"
                        colorScheme="teal"
                        width="full"
                        marginTop="2rem !important"
                        onClick={() => handleLogin(email, password)}
                    >
                        Login
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    );
}
