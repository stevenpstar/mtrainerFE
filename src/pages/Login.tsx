import { Box, Center } from "@chakra-ui/react";
import { LoginGoogle } from "../components/LoginGoogle";

function Login() {
  return (
    <Box h='100%' w='100%'>
      <Center h='100%'>
        <LoginGoogle />
      </Center>
    </Box>
  )
}

export { Login }
