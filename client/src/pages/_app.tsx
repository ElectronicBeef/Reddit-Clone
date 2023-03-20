import Home from "./index";
import { ChakraProvider } from "@chakra-ui/react";

export default function App() {
  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  );
}
