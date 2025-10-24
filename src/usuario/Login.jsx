import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BlueBackground = '#9DCBD7'; 

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #9DCBD7;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

const ColumnBase = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  flex-grow: 1; 
  padding: 20px;
`;

const LoginColumn = styled(ColumnBase)`
  flex: 1;
  max-width: 400px;
  padding: 40px;
`;

const LogoColumn = styled(ColumnBase)`
  flex: 1;
  max-width: 400px;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;


const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 320px;
`;

const Input = styled.input`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  color: black;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const LoginButton = styled.button`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  font-weight: bold;
  background-color: #5a2e2e;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #4b2525;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);
  }
`;

const SeparatorContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  gap: 16px;
  width: 100%;
`;

const SeparatorText = styled.span`
  color: #5a2e2e;
  font-size: 0.9em;
  font-weight: 500;
`;

const SeparatorLine = styled.div`
  height: 1px;
  background-color: #E0E0E0;
  flex: 1;
`;

const ForgotPasswordLink = styled.a`
  color: #5a2e2e;
  font-size: 0.9em;
  text-decoration: none;
  text-align: center;
  margin-top: -10px;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: contain;
`;

const Image = styled.img`
  width: 450px;
  height: 450px;
  margin-top: 20px;
  object-fit: contain;
`;



const DivMayor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #9DCBD7;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const Login = () => {

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const iniciarSesion = async () => {
    if(mail == "" || password == ""){
      toast.error("Debe completar todos los campos", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${urlBase}/auth/login`, {correo: mail, pw: password}, { headers: { 'Content-Type': 'application/json' }
      });
      const {data} = response;
      const {token, rol} = data;
      localStorage.setItem("token", token);
      localStorage.setItem("tipo", rol);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      navigate('/home');
    } catch (error) {
      console.log(error);
      toast.error("Correo y/o contrasenia incorrectos", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <>
        <FullScreenContainer>
          <LoginColumn>
            <Form>
              <Input type="email" placeholder="adan@email.com" onChange={(e) => setMail(e.target.value)} />
              <Input type="password" placeholder="**************" onChange={(e) => setPassword(e.target.value)} />
              <LoginButton onClick={() => iniciarSesion()}>Iniciar sesion</LoginButton>
              <SeparatorContainer>
                <SeparatorLine />
                <SeparatorText>o</SeparatorText>
                <SeparatorLine />
              </SeparatorContainer>
              <ForgotPasswordLink href="/olvido-password">¿Olvidó su contraseña?</ForgotPasswordLink>
            </Form>
          </LoginColumn>
          <LogoColumn>
            <LogoImage src = "/logo.jpeg" alt="Logo ADAN" />
          </LogoColumn>
        </FullScreenContainer>
    </>
  )
}

export default Login