import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Input = styled.input`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
  color: black;
  width: 327px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

const Button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 16px;
  gap: 8px;
  width: 327px;
  height: 40px;
  background: #4C241D;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  color: white;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  gap: 22px;
  width: 412px;
  height: auto;
  position: relative;
`;

const Div2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 327px;
  height: 96px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

const Link = styled.a`
  width: 364px;
  height: 18px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: center;
  color: #4C241D;
  mix-blend-mode: darken;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  flex: none;
  order: 3;
  align-self: stretch;
  flex-grow: 0;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
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
      const {token, nombreUsuario, rol} = data;
      localStorage.setItem("token", token);
      localStorage.setItem("mail", nombreUsuario);
      localStorage.setItem("tipo", rol);
      navigate('/usuario');
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
        <DivMayor>
          <Div>
            <Input type="email" placeholder="adan@email.com" onChange={(e) => setMail(e.target.value)} />
            <Div2>
              <Input type="password" placeholder="**************" onChange={(e) => setPassword(e.target.value)} />
              <Button onClick={() => iniciarSesion()}>Iniciar sesion</Button>
            </Div2>
            <Link>Olvido su contrasenia?</Link>
          </Div>
          <Image src = "/logo.jpeg" />
        </DivMayor>
    </>
  )
}

export default Login