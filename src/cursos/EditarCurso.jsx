import styled from "styled-components";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Outlet, Navigate, useNavigate, useParams } from "react-router-dom";

const EditarCurso = () => {
  const rol = localStorage.getItem("tipo");
  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState("");
  const [turno, setTurno] = useState("");
  const [codigo, setCodigo] = useState("");
  const [anio, setAnio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const cargarCurso = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        const response = await axios.get(`${urlBase}/cursos/${id}`, config);
        const curso = response.data;
        
        setNombre(curso.nombre || "");
        setTurno(curso.turno || "");
        setCodigo(curso.codigo || "");
        setAnio(curso.anio?.toString() || "");
        setDescripcion(curso.descripcion || "");
        
      } catch (error) {
        console.log(error);
        toast.error("Error al cargar los datos del curso", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/admin-cursos');
      } finally {
        setLoadingData(false);
      }
    };

    cargarCurso();
  }, [id, navigate]);

  const editar = async () => {
    if (!nombre || !turno || !anio) {
      toast.error("Debe completar todos los campos obligatorios", {
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
      
      const response = await axios.put(`${urlBase}/cursos/${id}/modificar`, {
        nombre, 
        turno, 
        anio: Number(anio),
        descripcion
      }, config);
      
      console.log(response);
      toast.success("Curso actualizado exitosamente", {
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
      const message = error.response?.data || "Error al actualizar el curso";
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
    return <Navigate to="/home" />;
  }

  if (loadingData) {
    return (
      <Container>
        <ContentWrapper>
          <FormWrapper>
            <Title2>Cargando...</Title2>
          </FormWrapper>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <Title>Editar Curso</Title>

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

          <FormGroup>
            <Label>Descripción (opcional)</Label>
            <TextArea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingrese una descripción del curso"
              disabled={loading}
              rows="4"
            />
          </FormGroup>

          <ButtonGroup>
            <CreateButton onClick={editar} disabled={loading}>
              {loading ? "Guardando..." : "Actualizar"}
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

export default EditarCurso;

const Container = styled.div`
  background-color: #9DCBD7;
  min-height: 100vh;
  width: 100%;
  padding-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  padding: 30px;
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

const Title2 = styled.h1`
  color: #333;
  font-size: 20px;
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

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  padding-right: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: #333;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  
  &::placeholder {
    color: #999;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HelpText = styled.span`
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
  font-style: italic;
`;