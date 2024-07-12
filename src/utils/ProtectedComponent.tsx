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
  const [noProtection, setNoProtected] = useState(true);
  useEffect(() => {
    CheckAuth(setAuth, setHasChecked)
  }, [])
  if (!hasChecked && !noProtection) {
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
  else if (!auth && hasChecked && !noProtection) {
    return <Navigate to="/login" />
  } else {
    return ( <Box h='100%' w='100%'>{props.children}</Box> )
  }
}

export { ProtectedComponent }
