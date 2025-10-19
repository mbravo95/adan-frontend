import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Outlet, Navigate, useNavigate } from "react-router-dom";



const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 24px;
  gap: 22px;
`;

const Select = styled.select`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
  width: 327px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: rgba(76, 36, 29, 0.5);
`;


const Header = styled.h1`
  position: absolute;
  width: 228px;
  height: 60px;
  left: 339px;
  width: 228px;
  height: 60px;
  left: 339px;
  top: 176px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 800;
  font-size: 32px;
  line-height: 140%;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  color: #000000;
`;

const Input = styled.input`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
  width: 327px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;



const BtnAceptar = styled.input`
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
  order: 3;
  align-self: stretch;
  flex-grow: 0;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  color: #FFFFFF;
  cursor: pointer;
`;

const BtnCancelar = styled.input`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 16px;
  gap: 8px;
  width: 327px;
  height: 40px;
  background: #E0E0E0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  flex: none;
  order: 4;
  align-self: stretch;
  flex-grow: 0;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  color: #000000;
  cursor: pointer;
`;

const CrearCurso = () => {
  
  const rol = localStorage.getItem("tipo");

  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [turno, setTurno] = useState("");
  const [codigo, setCodigo] = useState("");
  const [anio, setAnio] = useState(0);

  const crear = async () => {
    console.log(turno);
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
      navigate('/curso');
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
      
        <Header>CREAR CURSO</Header>

        <Div>

          <Input type="text" onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />

          <Select onChange={(e) => setTurno(e.target.value)}>
            <option value="">Turno</option>
            <option value="Matutino">Matutino</option>
            <option value="Vespertino">Vespertino</option>
            <option value="Nocturno">Nocturno</option>
          </Select>

          <Input type="text" onChange={(e) => setCodigo(e.target.value)} placeholder="Codigo" />

          <Input type="number" onChange={(e) => setAnio(Number(e.target.value))} placeholder="Anio" />

          <BtnAceptar type="button" value="Crear curso" onClick={() => crear()} />

          <BtnCancelar type="button" value="Cancelar" onClick={() => navigate('/curso')} />
        
        </Div>
        
    </>
  )
}

export default CrearCurso