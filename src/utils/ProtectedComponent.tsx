import { Navigate } from "react-router-dom";
import { CheckAuth } from "./Login";
import { useEffect, useState } from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";

interface ProtectedProps {
  children: React.ReactNode,
}
function ProtectedComponent(props: ProtectedProps) {
  const [auth, setAuth] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  useEffect(() => {
    CheckAuth(setAuth, setHasChecked)
  }, [])
  if (!hasChecked) {
    return (
    <Box h='100%' w='100%'>
      <Center>
        <Spinner
          thickness='4px'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
          />
      </Center>
    </Box>
    )
  }
  else if (!auth && hasChecked) {
    return <Navigate to="/app/login" />
  } else {
    return ( <Box h='100%' w='100%'>{props.children}</Box> )
  }
}

export { ProtectedComponent }
