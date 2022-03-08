import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/authProvider";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </AuthProvider>
    );
}

export default MyApp;
