import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { messaging, getToken } from '../../firebase';

const FullScreenContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: #9DCBD7;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10vw;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    padding: 40px 20px;
  }
`;

const ColumnBase = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  flex-grow: 1; 
  padding: 20px;

  @media (max-width: 768px) {
    padding: 0;
    width: 100%;
  }
`;

const LoginColumn = styled(ColumnBase)`
  flex: 1;
  max-width: 30vw;
  margin-top: 8vh;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-top: 0;
    order: 2;
  }
`;

const LogoColumn = styled(ColumnBase)`
  flex: 1;
  max-width: 22vw;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    max-width: 60vw;
    order: 1;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 320px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
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

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 14px;
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

  @media (max-width: 768px) {
    font-size: 1.1em;
    padding: 14px;
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
  width: 22vw;
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 60vw;
    max-width: 300px;
  }
`;

const Login = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function obtenerFcmToken() {
    try {
      const token = await getToken(messaging, { vapidKey: 'BERJzpI2PusS4qrsE1wSCqEVYfz5x-n_t_xLidyWn98YWm3_sbtlxQ7Wkgf26wt6m5kjIM-OYimyQm1dpYxU6as' });
      if (token) {
        localStorage.setItem('fcmToken', token);
        return token;
      }
    } catch (err) {
      console.error('Error obteniendo token FCM:', err);
      return null;
    }
  }

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
      const tokenFcm = await obtenerFcmToken();
      const plataforma = 'pc';
      const response = await axios.post(
        `${urlBase}/auth/login`,
        {
          correo: mail,
          pw: password,
          tokenFcm : tokenFcm,
          plataforma : plataforma
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const {data} = response;
      const {token, rol, id: idLogin} = data;
      localStorage.setItem("token", token);
      localStorage.setItem("tipo", rol);

      let idUsuario = idLogin;
      if (!idUsuario && token) {
        try {
          const perfilResp = await axios.get(`${urlBase}/usuarios/perfil`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          idUsuario = perfilResp.data.id;
        } catch (err) {
          idUsuario = undefined;
        }
      }
      localStorage.setItem("idUsuario", idUsuario);
      if (idUsuario && token) {
        try {
          const cursosResp = await axios.get(`${urlBase}/usuarios/${idUsuario}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': '*/*'
            }
          });
          if (cursosResp.data && Array.isArray(cursosResp.data.cursosComoProfesor)) {
            const codigos = cursosResp.data.cursosComoProfesor.map(curso => curso.codigo);
            localStorage.setItem("codigosCursosProfesor", JSON.stringify(codigos));
          } else {
            localStorage.setItem("codigosCursosProfesor", JSON.stringify([]));
          }
        } catch (err) {
          localStorage.setItem("codigosCursosProfesor", JSON.stringify([]));
        }
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      navigate('/home');
    } catch (error) {
      console.log(error);
      toast.error("Correo y/o contraseña incorrectos", {
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
    <FullScreenContainer>
      <LoginColumn>
        <Form>
          <Input 
            type="email" 
            placeholder="adan@email.com" 
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && iniciarSesion()}
          />
          <Input 
            type="password" 
            placeholder="*******************" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && iniciarSesion()}
          />
          <LoginButton onClick={() => iniciarSesion()}>Iniciar sesión</LoginButton>
          <SeparatorContainer>
            <SeparatorLine />
            <SeparatorText>o</SeparatorText>
            <SeparatorLine />
          </SeparatorContainer>
          <ForgotPasswordLink href="/olvido-password">¿Olvidó su contraseña?</ForgotPasswordLink>
        </Form>
      </LoginColumn>
      <LogoColumn>
        <LogoImage src="/logo- SinFondo.png" alt="Logo ADAN" />
      </LogoColumn>
    </FullScreenContainer>
  );
}

export default Login;

