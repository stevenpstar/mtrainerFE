import { useGoogleLogin } from "@react-oauth/google";
import { AuthorizeUser } from "../utils/Login";
import { Button } from "@chakra-ui/react";

function LoginGoogle() {

  const loginWithGoogle = useGoogleLogin({
    onSuccess: codeResponse => {
      console.log(codeResponse);
      AuthorizeUser(codeResponse.code);
    },
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
  })

  return (
  <div>
    <Button 
      onClick={() => loginWithGoogle()}
      bg={'blue.400'}
      color={'blue.900'}
    >
      Log in with Google
    </Button>
  </div>
  )
}

export { LoginGoogle }
