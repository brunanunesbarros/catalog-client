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
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowClick = () => setShowPassword(!showPassword);

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
                    >
                        Login
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    );
}
