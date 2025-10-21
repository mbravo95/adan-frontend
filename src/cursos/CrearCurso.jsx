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

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
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

const CrearCurso = () => {
  const rol = localStorage.getItem("tipo");
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [turno, setTurno] = useState("");
  const [codigo, setCodigo] = useState("");
  const [anio, setAnio] = useState("");
  const [loading, setLoading] = useState(false);

  const crear = async () => {
    if (!nombre || !turno || !codigo || !anio) {
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

    setLoading(true);
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(`${urlBase}/cursos/alta`, {
        nombre, 
        turno, 
        codigo, 
        anio: Number(anio)
      }, config);
      
      console.log(response);
      toast.success("Curso creado exitosamente", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      navigate('/admin-cursos');
      
    } catch (error) {
      console.log(error);
      const message = error.response?.data || "Error al crear el curso";
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelar = () => {
    navigate('/admin-cursos');
  };

  if (rol !== "ADMINISTRADOR") {
    return <Navigate to="/usuario" />;
  }

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <Title>Crear Nuevo Curso</Title>

          <FormGroup>
            <Label>Nombre del Curso</Label>
            <Input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre del curso"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label>Turno</Label>
            <Select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccione un turno</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Nocturno">Nocturno</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Código del Curso</Label>
            <Input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ingrese el código del curso"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label>Año</Label>
            <Input
              type="number"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              placeholder="Ingrese el año"
              min="2020"
              max="2030"
              disabled={loading}
            />
          </FormGroup>

          <ButtonGroup>
            <CreateButton onClick={crear} disabled={loading}>
              {loading ? "Creando..." : "Crear Curso"}
            </CreateButton>
            <CancelButton onClick={cancelar} disabled={loading}>
              Cancelar
            </CancelButton>
          </ButtonGroup>
        </FormWrapper>
      </ContentWrapper>
      <Outlet />
    </Container>
  );
};

export default CrearCurso;