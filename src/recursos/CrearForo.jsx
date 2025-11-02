import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

const CrearForo = () => {

  const [nombre, setNombre] = useState("");
  const [visible, setVisible] = useState(false);

  const { codigo, seccion } = useParams();
  const navigate = useNavigate();

    const crearForo = async () => {
        if(nombre == ""){
            toast.error("Debe ingresar un nombre para el foro", {
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
            const response = await axios.post(`${urlBase}/recursos/foros`, {nombre, visible, idSeccion: Number(seccion)}, config);
            console.log(response);
            toast.success("Foro agregado exitosamente", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate(`/curso/${codigo}`);
        } catch (error) {
            console.log(error);
            toast.error("Ya existe un foro con ese nombre en la seccion seleccionada", {
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

        <Container>
          <Title>CREAR FORO</Title>
          <Form>
            <Input type="text" onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
            <CheckboxGroup>
                <CheckboxLabel htmlFor="task-visible">
                    <CheckboxInput type="checkbox" id="task-visible" onChange={() => setVisible(!visible)} />
                    <CustomCheckbox />
                    Visible
                </CheckboxLabel>
            </CheckboxGroup>
            <CreateButton type="button" onClick={() => crearForo()}>Crear foro</CreateButton>
            <CancelButton type="button" onClick={() => navigate(`/curso/${codigo}`)}>Cancelar</CancelButton>
          </Form>
        </Container>
    
    </>
  )
}

export default CrearForo;


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
  color: black;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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


const CheckboxGroup = styled.div`
    margin-top: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.1em;
    color: #333;
    font-weight: 500;
`;

const CheckboxInput = styled.input`
    opacity: 0;
    position: absolute;
`;

const CustomCheckbox = styled.span`
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #5a2e2e;
    margin-right: 10px;
    flex-shrink: 0;
    transition: all 0.2s ease;
    position: relative;
    background-color: white;

    ${CheckboxInput}:checked + & {
        background-color: #60a5fa;
        border-color: #60a5fa;
    }

    ${CheckboxInput}:checked + &::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
    }
    

    ${CheckboxInput}:focus + & {
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
    }
`;