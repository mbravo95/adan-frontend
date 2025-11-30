import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

const EditarSeccion = () => {
  const params = useParams();
  const seccionId = params.seccionId;
  const codigo = params.codigo;
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log("EditarSeccion MOUNTED");
    console.log("params:", params);
    console.log("seccionId:", seccionId, "codigo:", codigo);
    
    const fetchSeccion = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        
        console.log("Haciendo GET a:", `${urlBase}/secciones/${seccionId}`);
        const response = await axios.get(`${urlBase}/secciones/${seccionId}`, config);
        const { titulo, visible } = response.data;
        setTitulo(titulo);
        setVisible(visible);
        console.log("Datos de la sección recibidos:", response.data);
      } catch (error) {
        console.log("Error al obtener sección:", error);
        toast.error("Error al obtener los datos de la sección", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
    
    if (seccionId) fetchSeccion();
  }, [seccionId, codigo]);

  const editarSeccion = async () => {
    if (titulo === "") {
      toast.error("Debe ingresar un título para la sección", {
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
      
      const body = { titulo, visible };
      console.log('[EDITAR SECCION] body enviado:', body);
      
      const response = await axios.put(
        `${urlBase}/secciones/editar/${seccionId}`, 
        body, 
        config
      );
      console.log('[EDITAR SECCION] response:', response);
      
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
      
      if (error.response?.status === 409) {
        toast.error("Ya existe una sección con ese título en el curso", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (error.response?.status === 404) {
        toast.error("No se encontró la sección", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Error al modificar la sección", {
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
  };

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <form>
            <FormGroup>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la sección"
              />
            </FormGroup>

            <FormGroup>
              <CheckboxGroup>
                <CheckboxLabel htmlFor="seccion-visible">
                  <CheckboxInput
                    type="checkbox"
                    id="seccion-visible"
                    checked={visible}
                    onChange={() => setVisible(!visible)}
                  />
                  <CustomCheckbox />
                  Visible
                </CheckboxLabel>
              </CheckboxGroup>
            </FormGroup>

            <ButtonGroup>
              <CreateButton type="button" onClick={() => editarSeccion()}>
                Actualizar
              </CreateButton>
              <CancelButton type="button" onClick={() => navigate(`/curso/${codigo}`)}>
                Cancelar
              </CancelButton>
            </ButtonGroup>
          </form>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default EditarSeccion;