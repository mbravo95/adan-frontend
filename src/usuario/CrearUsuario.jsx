import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Outlet, Navigate, useNavigate } from "react-router-dom";

const Container = styled.div`
  background-color: #9DCBD7;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
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

const Select = styled.select`
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

const BtnAceptar = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
  }
`;

const BtnCancelar = styled(Button)`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
`;

const CrearUsuario = () => {

  const rol = localStorage.getItem("tipo");
  
    const navigate = useNavigate();
  
    const [cedula, setCedula] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [tipo, setTipo] = useState("USUARIO");
  
    const crear = async () => {
      if((tipo != "ADMINISTRADOR" && (nombres == "" || cedula == "" || apellidos == "")) || correo == ""){
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
         const token = localStorage.getItem("token");
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
        const response = await axios.post(`${urlBase}/usuarios/alta`, {cedula, nombres, apellidos, correo, tipoUsuario: tipo}, config);
        console.log(response);
        toast.success("Usuario agregado exitosamente", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/usuario');
      } catch (error) {
        console.log(error);
        const {response} = error;
        const {data} = response;
        toast.error(data, {
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
      {rol == "ADMINISTRADOR" ? <Outlet /> : <Navigate to="/usuario" />}
      
      <Container>
        <ContentWrapper>
          <FormWrapper>
            <Title>Crear Nuevo Usuario</Title>

            <FormGroup>
              <Input type="number" onChange={(e) => setCedula(e.target.value)} placeholder="Cédula: 12345678" />
            </FormGroup>

            <FormGroup>
              <Input type="text" onChange={(e) => setNombres(e.target.value)} placeholder="Nombres: Juan Carlos" />
            </FormGroup>

            <FormGroup>
              <Input type="text" onChange={(e) => setApellidos(e.target.value)} placeholder="Apellidos: Perez Lopez" />
            </FormGroup>

            <FormGroup>
              <Input type="email" onChange={(e) => setCorreo(e.target.value)} placeholder="Correo: jperez@adan.com" />
            </FormGroup>

            <FormGroup>
              <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="USUARIO">Usuario Regular</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="PROFESOR">Profesor</option>
              </Select>
            </FormGroup>

            <ButtonGroup>
              <BtnAceptar type="button" onClick={() => crear()}>
                Crear Usuario
              </BtnAceptar>
              <BtnCancelar type="button" onClick={() => navigate('/curso')}>
                Cancelar
              </BtnCancelar>
            </ButtonGroup>
          </FormWrapper>
        </ContentWrapper>
      </Container>
    </>
  )
}

export default CrearUsuario