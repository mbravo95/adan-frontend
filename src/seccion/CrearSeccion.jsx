import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useCursoData from "../hooks/useCursoData";
import Spinner from "../general/Spinner";


const CrearSeccion = () => {
  const { codigo, idseccion } = useParams();
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState("");
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const { esProfesor, loadingSecciones } = useCursoData(codigo);
  const rol = localStorage.getItem("tipo");
  if (!loadingSecciones && rol !== "ADMINISTRADOR" && !esProfesor) {
    return <Navigate to="/home" />;
  }

  useEffect(() => {
    const fetchSeccion = async () => {
            if(idseccion == null) {
              setLoading(false);
              return;
            } 
            
            try {
              setLoading(true);  
              const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${urlBase}/secciones/${idseccion}`, config);                
                const {data} = response;
                const {titulo, visible} = data;
                setTitulo(titulo);
                setVisible(visible);
            } catch (error) {
                console.error("Error al obtener los datos de la seccion:", error);
                toast.error("No se pudieron cargar los datos de la seccion.");
            } finally {
                setLoading(false);
            }
        };

        fetchSeccion();
  },[]);

  const crear = async () => {
    if (!titulo) {
      toast.error("Debe completar el título de la sección", {
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
      
      const requestBody = {
        titulo: titulo,
        codigoCurso: codigo
      };

      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      
      const response = await axios.post(`${urlBase}/secciones/alta`, requestBody, config);
      
      console.log(response);
      toast.success("Sección creada exitosamente", {
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
      const message = error.response?.data || "Error al crear la sección";
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


  const modificar = async () => {
    if (!titulo) {
      toast.error("Debe completar el título de la sección", {
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
      
      const requestBody = {
        titulo,
        visible
      };

      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      
      const response = await axios.put(`${urlBase}/secciones/editar/${idseccion}`, requestBody, config);
      
      console.log(response);
      toast.success("Sección modificada exitosamente", {
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
      const message = error.response?.data || "Error al modificar la sección";
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
    navigate(`/curso/${codigo}`);
  };

  return (
    <Container>
      <ContentWrapper>
        {loading ? <Spinner /> : (
          <FormWrapper>
            <Title>{!idseccion  ? 'Crear Nueva Sección' : 'Editar Sección'}</Title>

            <FormGroup>
              <Label>Título de la Sección</Label>
              <Input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ingrese el título de la sección"
                disabled={loading}
              />
            </FormGroup>

            {idseccion &&
              <CheckboxGroup>
                <CheckboxLabel htmlFor="task-visible">
                    <CheckboxInput type="checkbox" id="task-visible" onChange={() => setVisible(!visible)} checked={visible} />
                    <CustomCheckbox />
                    Visible
                </CheckboxLabel>
              </CheckboxGroup>
            }

            <ButtonGroup>
              {!idseccion && 
                <CreateButton onClick={crear} disabled={loading}>
                  {loading ? "Creando..." : "Crear Sección"}
                </CreateButton>
              }
              {idseccion &&
                <CreateButton onClick={modificar} disabled={loading}>
                  {loading ? "Modificando..." : "Confirmar Cambios"}
                </CreateButton>
              }
              <CancelButton onClick={cancelar} disabled={loading}>
                Cancelar
              </CancelButton>
            </ButtonGroup>
          </FormWrapper>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default CrearSeccion;



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


const CheckboxGroup = styled.div`
    margin-top: 25px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    justify-content: center;
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