const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 400px;
`;
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

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const Select = styled.select`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); /* Icono de flecha */
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 20px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const Button = styled.button`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
  
  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);
  }

  &:active {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transform: translateY(1px);
  }
`;

const CreateButton = styled(Button)`
  background-color: #5a2e2e;
  color: #fff;
  margin-top: 10px;

  &:hover {
    background-color: #4b2525;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e0e0e0;
  color: #333;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
`;

const RadioInput = styled.input`
  margin-right: 10px;
  width: 20px;
  height: 20px;
  
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  border-radius: 50%;
  border: 2px solid #5a2e2e;
  background-color: #fff;
  transition: all 0.2s ease;

  &:checked {
    background-color: #60a5fa; 
    border-color: #60a5fa;
  }

  &:focus {
    outline: 2px solid #60a5fa;
    outline-offset: 1px;
  }
`;

const CrearUsuario = () => {

  const rol = localStorage.getItem("tipo");
  
    const navigate = useNavigate();
  
    const [cedula, setCedula] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [tipo, setTipo] = useState("");
  
    const crear = async () => {
      if((tipo != "ADMINISTRADOR" && (nombres == "" || cedula == "" || apellidos == "")) || correo == "" || tipo == ""){
        toast.error("Debe completar todos los campos", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        <Container>
          <FormWrapper>
            <Title>CREAR USUARIO</Title>
            <Form>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput type="radio" name="tipo" value="Administrador" checked={tipo == 'ADMINISTRADOR'} onChange={() => setTipo("ADMINISTRADOR")}/>
                  Administrador
                </RadioLabel>
                <RadioLabel>
                  <RadioInput type="radio" name="tipo" value="Profesor/Estudiante" checked={tipo == 'USUARIO'} onChange={() => setTipo("USUARIO")} />
                  Profesor/Estudiante
                </RadioLabel>
              </RadioGroup>
              { (tipo == "" || tipo == "USUARIO") && 
                <Input type="text" onChange={(e) => setNombres(e.target.value)} placeholder="Nombre" />
              }  
              { (tipo == "" || tipo == "USUARIO") && 
                <Input type="text" onChange={(e) => setApellidos(e.target.value)} placeholder="Apellido" />
              }
              { (tipo == "" || tipo == "USUARIO") && 
                <Input type="number" onChange={(e) => setCedula(e.target.value)} placeholder="Cedula de Identidad" />
              }
              <Input type="email" onChange={(e) => setCorreo(e.target.value)} placeholder="Correo electronico" />
              <CreateButton type="button" onClick={() => crear()}>Crear usuario</CreateButton>
              <CancelButton type="button" onClick={() => navigate('/home')}>Cancelar</CancelButton>
            </Form>
          </FormWrapper>
        </Container>
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
        {rol == "ADMINISTRADOR" ? <Outlet /> : <Navigate to="/home" />}
        <Container>
          <FormWrapper>
            <Title>Crear Nuevo Usuario</Title>
            <Form>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput type="radio" name="tipo" value="Administrador" checked={tipo == 'ADMINISTRADOR'} onChange={() => setTipo("ADMINISTRADOR")}/>
                  Administrador
                </RadioLabel>
                <RadioLabel>
                  <RadioInput type="radio" name="tipo" value="Profesor/Estudiante" checked={tipo == 'USUARIO'} onChange={() => setTipo("USUARIO")} />
                  Profesor/Estudiante
                </RadioLabel>
              </RadioGroup>
              { (tipo == "" || tipo == "USUARIO") && 
                <Input type="text" onChange={(e) => setNombres(e.target.value)} placeholder="Nombre" />
              }  
              { (tipo == "" || tipo == "USUARIO") && 
                <Input type="text" onChange={(e) => setApellidos(e.target.value)} placeholder="Apellido" />
              }
              { (tipo == "" || tipo == "USUARIO") && 
                <Input type="number" onChange={(e) => setCedula(e.target.value)} placeholder="Cedula de Identidad" />
              }
              <Input type="email" onChange={(e) => setCorreo(e.target.value)} placeholder="Correo electronico" />
              <CreateButton type="button" onClick={() => crear()}>Crear usuario</CreateButton>
              <CancelButton type="button" onClick={() => navigate('/curso')}>Cancelar</CancelButton>
            </Form>
          </FormWrapper>
        </Container>
    </>
  )
}

export default CrearUsuario