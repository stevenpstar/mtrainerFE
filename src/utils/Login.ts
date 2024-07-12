function CheckLoggedIn(setCheck: (a: boolean) => void, sA: (b: boolean) => void) {
  fetch('http://localhost:8080/auth/prelogin', {
    method: 'GET',
    credentials: 'include',
  })
    .then(resp => {
        setCheck(true);
      if (resp.status === 200) {
        sA(true);
      } else {
        sA(false);
      }
    });
}

function CheckAuth(setAuth: (a: boolean) => void, setCheck: (a: boolean) => void): void {
  fetch('http://localhost:8080/auth/prelogin', {
    method: 'GET',
    credentials: 'include',
  })
  .then(resp => {
    setCheck(true);
    if (resp.status === 200) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  });
}

function LogOut() {
  fetch('http://localhost:8080/auth/logout', {
    method: 'GET',
    credentials: 'include'
  })
  .then(resp => {
    if (resp.status !== 200) {
      console.error("Error clearing cookie");
    }
//    setCheckedAuth(true);
//    setAuth(false);
//    setProfileImage("");
//    setFirstName("");
//    setLastName("");
  });
}

function AuthorizeUser(code: string): void {
  const payload = {
    code: code,
  }
  fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  })
  .then(resp => resp.json());
}

export { CheckLoggedIn, AuthorizeUser, LogOut, CheckAuth }
