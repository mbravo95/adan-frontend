import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

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

const Label = styled.label`
  font-size: 1em;
  font-weight: 500;
  color: #333;
  margin-left: 5px;
  display: block;
  margin-bottom: 8px;
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
  font-size: 1em;
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

const EditarTarea = () => {
  const { recursoId } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTarea = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${urlBase}/recursos/${recursoId}`, config);
        const tarea = response.data;
        setNombre(tarea.nombre || "");
        setDescripcion(tarea.descripcion || "");
        setFechaInicio(tarea.fechaInicio ? tarea.fechaInicio.slice(0, 16) : "");
        setFechaFin(tarea.fechaFin ? tarea.fechaFin.slice(0, 16) : "");
      } catch (error) {
        toast.error("Error al cargar la tarea");
      } finally {
        setLoading(false);
      }
    };
    if (recursoId) fetchTarea();
  }, [recursoId]);

  const modificarTarea = async () => {
    if(nombre === "" || descripcion === "" || fechaInicio === "" || fechaFin === ""){
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
      await axios.put(`${urlBase}/recursos/tareas/${recursoId}`, {
        nombre,
        descripcion,
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFin: new Date(fechaFin).toISOString(),
      }, config);
      toast.success("Tarea modificada exitosamente", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(-1);
    } catch (error) {
      toast.error("Error al modificar la tarea");
    }
  };

  if (loading) return <Container>Cargando tarea...</Container>;

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          {/*<Title>Editar Tarea</Title>*/}
          <form>
            <FormGroup>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre de la tarea" />
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
              <CreateButton type="button" onClick={modificarTarea}>Actualizar</CreateButton>
              <CancelButton type="button" onClick={() => navigate(-1)}>Cancelar</CancelButton>
            </ButtonGroup>
          </form>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default EditarTarea;
