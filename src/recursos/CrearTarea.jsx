import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";


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

const TextArea = styled.textarea`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #60a5fa;
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

const LabeledInputGroup = styled.div`
  display: flex;
  flex-direction: column; /* Coloca el label encima del input */
  gap: 5px; /* Espacio entre el label y el input */
`;

const Label = styled.label`
  font-size: 1em;
  font-weight: 500;
  color: #333;
  margin-left: 5px; /* Pequeño margen para separarlo del borde */
`;

const CrearTarea = () => {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [visible, setVisible] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const location = useLocation();
    const seccionid = location.state.seccionid;
    const cursoid = location.state.id;
    const navigate = useNavigate();

    const crearTarea = async () => {

        if(nombre == "" || descripcion == "" || fechaInicio == "" || fechaFin == 0){
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

        const fechaI = new Date(fechaInicio);
        const fechaF = new Date(fechaFin);

        if(fechaI >= fechaF){
            toast.error("La fecha de inicio debe ser menor a la fecha de fin", {
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
            const response = await axios.post(`${urlBase}/recursos/tareas`, {nombre, descripcion, visible, fechaInicio, fechaFin, idSeccion: seccionid}, config);
            console.log(response);
            toast.success("Tarea agregada exitosamente", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate(`/curso/${cursoid}`);
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
        <Container>
          <Title>CREAR TAREA</Title>
          <Form>
            <Input type="text" onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
            <TextArea onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripcion" rows="4" />
            <LabeledInputGroup>
                <Label htmlFor="inicio">
                    Fecha de inicio
                </Label>
                <Input id="inicio" type="datetime-local" onChange={(e) => setFechaInicio(e.target.value)} />
            </LabeledInputGroup>
            <LabeledInputGroup>
                <Label htmlFor="fin">
                    Fecha de fin
                </Label>
                <Input type="datetime-local" onChange={(e) => setFechaFin(e.target.value)} />
            </LabeledInputGroup>
            <CheckboxGroup>
            <CheckboxLabel htmlFor="task-visible">
                <CheckboxInput type="checkbox" id="task-visible" onChange={() => setVisible(!visible)} />
                <CustomCheckbox />
                Visible
            </CheckboxLabel>
            </CheckboxGroup>
            <CreateButton type="button" onClick={() => crearTarea()}>Crear tarea</CreateButton>
            <CancelButton type="button" onClick={() => navigate(`/curso/${cursoid}`)}>Cancelar</CancelButton>
          </Form>
        </Container>
    </>
  )
}

export default CrearTarea