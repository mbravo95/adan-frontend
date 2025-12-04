import { useLocation, useNavigate, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import useCursoData from "../hooks/useCursoData";

const CrearTarea = () => {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [visible, setVisible] = useState(true);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const location = useLocation();
    const params = useParams();
    let seccionid = location.state?.seccionid;
    let cursoid = location.state?.id;
    // fallback: si no viene por state, tomar de params
    if (seccionid === undefined && params.seccion) {
      seccionid = params.seccion;
    }
    if (cursoid === undefined && params.codigo) {
      cursoid = params.codigo;
    }
    const navigate = useNavigate();

    const { esProfesor, loadingSecciones  } = useCursoData(cursoid);
    const rol = localStorage.getItem("tipo");
    if (!loadingSecciones && rol !== "ADMINISTRADOR" && !esProfesor) {
      return <Navigate to="/home" />;
    }

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

        const fechaInicioISO = fechaInicio ? new Date(fechaInicio).toISOString() : "";
        const fechaFinISO = fechaFin ? new Date(fechaFin).toISOString() : "";
        const idSeccionNum = Number(seccionid);
        if (isNaN(idSeccionNum)) {
          console.error("idSeccion es NaN. Valor recibido:", seccionid);
          toast.error("No se pudo determinar el id de la sección. No se envía la tarea.");
          return;
        }
        const datosTarea = {
          nombre: String(nombre),
          fechaInicio: fechaInicioISO,
          fechaFin: fechaFinISO,
          descripcion: String(descripcion),
          idSeccion: idSeccionNum
        };
        console.log("Datos enviados al crear tarea:", datosTarea);

    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${urlBase}/recursos/tareas`, datosTarea, config);
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
      toast.error("Ya existe una tarea con ese titulo", {
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
    <Container>
      <ContentWrapper>
        <FormWrapper>
          {/*<Title>Crear Tarea</Title>*/}
          <form>
            <FormGroup>
              <Label htmlFor="nombre">Título</Label>
              <Input id="nombre" type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Título de la tarea" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="descripcion">Descripción</Label>
              <TextArea id="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción de la tarea" rows="4" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="inicio">Fecha de inicio</Label>
              <Input id="inicio" type="datetime-local" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="fin">Fecha de fin</Label>
              <Input id="fin" type="datetime-local" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
            </FormGroup>
            <ButtonGroup>
              <CreateButton type="button" onClick={crearTarea}>Aceptar</CreateButton>
              <CancelButton type="button" onClick={() => navigate(`/curso/${cursoid}`)}>Cancelar</CancelButton>
            </ButtonGroup>
          </form>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
}

export default CrearTarea;



const Container = styled.div`
  background-color: #ffffffff;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 70px;
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
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
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
  margin-top: 20px;
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
  border: 2px solid #ddd;
  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  resize: vertical;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  &::placeholder {
    color: #999;
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
        background-color: #5a2e2e;
        border-color: #5a2e2e;
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

const Label = styled.label`
  font-size: 1em;
  font-weight: 500;
  color: #333;
  margin-left: 5px; /* Pequeño margen para separarlo del borde */
`;