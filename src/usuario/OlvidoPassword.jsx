import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";


const OlvidoPassword = () => {
  const [correo, setCorreo] = useState("");
  const navigate = useNavigate();

  const enviarCorreo = async () => {
    if (correo === "") {
      toast.error("El correo no puede estar vacío", {
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
      const response = await axios.post(`${urlBase}/password/forgot`, {
        correo: correo
      });
      console.log(response);
      toast.success("Correo enviado exitosamente", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar el correo", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  
  
  return (
    <>
        <Container>
          <ContentWrapper>
            <FormWrapper>
              <Title>Recupera tu cuenta</Title>

              <FormGroup>
                <Label>Ingresa tu correo electrónico y recibirás un enlace para recuperar el acceso a tu cuenta.</Label>
                <Input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Ingrese su correo electrónico"
                />
              </FormGroup>

              <ButtonGroup>
                <CreateButton onClick={enviarCorreo}>
                  Enviar enlace
                </CreateButton>
                <CancelButton onClick={() => navigate("/login")}>
                  Cancelar
                </CancelButton>
              </ButtonGroup>
            </FormWrapper>
          </ContentWrapper>
          <Outlet />
        </Container>
    </>
  )
}

export default OlvidoPassword;


const Container = styled.div`
  background-color: #9DCBD7;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5vh;
  font-weight: 400;
  text-align: center;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  
  &::placeholder {
    color: #999;
  }
`;


const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CreateButton = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  &:hover:not(:disabled) {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
    color: #999;
  }
`;