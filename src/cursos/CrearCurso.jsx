import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Outlet, Navigate, useNavigate } from "react-router-dom";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #a7d9ed;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  margin-bottom: 40px;
  font-weight: bold;
  letter-spacing: 1px;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
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

const CrearCurso = () => {
  
  const rol = localStorage.getItem("tipo");

  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [turno, setTurno] = useState("");
  const [codigo, setCodigo] = useState("");
  const [anio, setAnio] = useState(0);

  const crear = async () => {
    if(nombre == "" || turno == "" || codigo == "" || anio == 0){
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
      const response = await axios.post(`${urlBase}/cursos/alta`, {nombre, turno, codigo, anio}, config);
      console.log(response);
      toast.success("Curso agregado exitosamente", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/home');
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
        {rol == "ADMINISTRADOR" ? <Outlet /> : <Navigate to="/home" />}
      
        
        <Container>
          <Title>CREAR CURSO</Title>
          <Form>
            <Input type="text" onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
            <Input type="text" onChange={(e) => setCodigo(e.target.value)} placeholder="Código" />
            <Input type="number" onChange={(e) => setAnio(Number(e.target.value))} placeholder="Año" />
            <Select onChange={(e) => setTurno(e.target.value)}>
              <option value="">Turno</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Nocturno">Nocturno</option>
            </Select>
            <CreateButton type="button" onClick={() => crear()}>Crear curso</CreateButton>
            <CancelButton type="button" onClick={() => navigate('/home')}>Cancelar</CancelButton>
          </Form>
        </Container>
        
    </>
  )
}

export default CrearCurso