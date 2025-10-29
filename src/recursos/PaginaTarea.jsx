import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const BackgroundColor = '#a7d9ed';
const ButtonPrimaryColor = '#5a2e2e';
const ButtonSecondaryColor = '#d0e0e0';
const InputBackground = '#ffffff';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;


const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${BackgroundColor};
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  letter-spacing: 1px;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  margin: 0;
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.1em;
  color: #555;
  margin: 0 0 10px 0;
  line-height: 1.5;
`;

const ActionButton = styled.label`
  display: inline-block;
  padding: 18px 35px;
  border: none;
  border-radius: 8px;
  font-size: 1.5em;
  cursor: pointer;
  font-weight: bold;
  background-color: ${ButtonPrimaryColor};
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  text-align: center;

  &:hover {
    background-color: #4b2525;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4);
  }
`;


const CardWrapper = styled.div`
  max-height: ${props => (props.isVisible ? '500px' : '0')}; 
  opacity: ${props => (props.isVisible ? '1' : '0')};
  overflow: hidden;
  transition: max-height 0.5s ease-in-out, opacity 0.4s ease-in-out;
  width: 100%;

  ${props => props.isVisible && css`
    animation: ${fadeIn} 0.3s ease-out;
  `}
`;

const ActionCard = styled.div`
  background-color: ${InputBackground};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CardTitle = styled.h2`
  font-size: 1.5em;
  color: #333;
  margin: 0 0 10px 0;
  text-align: center;
`;


const InfoField = styled.div`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  background-color: #f8f8f8;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  word-wrap: break-word; 
`;


const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const CardButtonBase = styled.button`
  flex-grow: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
`;

const ConfirmButton = styled(CardButtonBase)`
  background-color: ${ButtonPrimaryColor};
  color: white;

  &:hover {
    background-color: #4b2525;
  }
`;

const CancelCardButton = styled(CardButtonBase)`
  background-color: ${ButtonSecondaryColor};
  color: #333;

  &:hover {
    background-color: #c0d0d0;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PaginaTarea = () => {

    const { codigo, tareaId } = useParams();

    const [tarea, setTarea] = useState({});
    const [mostrarDatos, setMostrarDatos] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const { profile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const obtenerTarea = async () => {
        try {
          const urlBase = import.meta.env.VITE_BACKEND_URL;
          const token = localStorage.getItem("token");
          const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`${urlBase}/recursos/${tareaId}`, config);
          setTarea(response.data);
        } catch (error) {
          console.error("Error al obtener los datos de la tarea:", error);
          toast.error("Error al cargar la tarea", {
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

      obtenerTarea();
    }, []);


    const handleConfirmarEntrega = async () => {
        
        if (!selectedFile) {
            toast.error("Debes seleccionar un archivo", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        return;
        }
    
            const formData = new FormData();

            formData.append('archivo', selectedFile);

        try {
            const urlBase = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${urlBase}/entregables/subir?idTarea=${tareaId}&idAlumno=${profile.id}`, formData, config);
            console.log('Respuesta del servidor:', response);

            toast.success("Archivo subido con éxito", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setSelectedFile(null);
            navigate(`/curso/${codigo}`);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            toast.error("Error al subir el archivo", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        
        setMostrarDatos(false);
    }

    const handleCancelarEntrega = () => {
        setMostrarDatos(false);
        setSelectedFile(null);
    }

    const handleFileChange = (event) => {
        console.log("Archivo seleccionado:", event);
        setSelectedFile(event.target.files[0]);
        setMostrarDatos(true);
    };

  return (
    <>
      <Container>
        <ContentWrapper>
            <Title>{tarea.nombre}</Title>
            <Description>
            {tarea.descripcion}
            </Description>

            {!mostrarDatos && (
            <>
               <ActionButton htmlFor="subir-archivo">
                    Subir solución
                </ActionButton>
                <HiddenFileInput id="subir-archivo" type="file" onChange={handleFileChange} />
            </>
            )}

            <CardWrapper isVisible={mostrarDatos}>
            <ActionCard>
                <CardTitle>Confirmar Información</CardTitle>
                
                <InfoField>Nombre del Archivo: **Proyecto Alfa**</InfoField>
                <InfoField>Fecha límite: **$5,000 USD**</InfoField>
                <InfoField>Fecha subida: **XYZ-987**</InfoField>
                
                <ButtonContainer>
                <ConfirmButton onClick={handleConfirmarEntrega}>Confirmar entrega</ConfirmButton>
                <CancelCardButton onClick={handleCancelarEntrega}>Cancelar entrega</CancelCardButton>
                </ButtonContainer>
            </ActionCard>
            </CardWrapper>

        </ContentWrapper>
      </Container>
    </>
  )
}

export default PaginaTarea