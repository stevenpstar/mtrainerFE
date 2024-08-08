import { Box, Center } from "@chakra-ui/react";
import { LoginGoogle } from "../components/LoginGoogle";
import { Button } from "@/components/ui/button";
import { LogOut } from "@/utils/Login";

function Login() {
  return (
    <Box h='100%' w='100%'>
      <Center h='100%'>
        <LoginGoogle />
        <p></p>
        <Button
          onClick={() => LogOut()}>Logout</Button>
      </Center>
    </Box>
  )
}

export { Login }
