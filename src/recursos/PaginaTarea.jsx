import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import Spinner from "../general/Spinner";

const PaginaTarea = () => {
  const [entregaAlumno, setEntregaAlumno] = useState(null);
  const [loadingEntrega, setLoadingEntrega] = useState(true);

  const { codigo, tareaId } = useParams();

  const [tarea, setTarea] = useState({});
  const [mostrarDatos, setMostrarDatos] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [loading, setLoading] = useState(false);

  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerTarea = async () => {
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
        const response = await axios.get(`${urlBase}/recursos/${tareaId}`, config);
        setTarea(response.data);
        // Set formatted start/end dates if available
        if (response.data.fechaInicio) {
          const dateInicio = new Date(response.data.fechaInicio);
          setFechaInicio(new Intl.DateTimeFormat('es-ES', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
          }).format(dateInicio));
        }
        if (response.data.fechaFin) {
          const dateFin = new Date(response.data.fechaFin);
          setFechaLimite(new Intl.DateTimeFormat('es-ES', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
          }).format(dateFin));
        }
      } catch (error) {
        console.error("Error al obtener los datos de la tarea:", error);
        toast.error("Error al cargar la tarea");
      } finally {
        setLoading(false);
      }
    };

    obtenerTarea();
    // Obtener entrega del alumno actual
    const obtenerEntregaAlumno = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${urlBase}/entregables/tareas/${tareaId}/entregas`, config);

        if (Array.isArray(response.data)) {
          const entrega = response.data.find(e => e.idAlumno === profile.id);
          setEntregaAlumno(entrega || null);
        } else {
          setEntregaAlumno(null);
        }
      } catch (error) {
        setEntregaAlumno(null);
      } finally {
        setLoadingEntrega(false);
      }
    };
    obtenerEntregaAlumno();
  }, []);

  const handleConfirmarEntrega = async () => {
    if (!selectedFile) {
      toast.error("Debes seleccionar un archivo");
      return;
    }

    const formData = new FormData();
    formData.append('archivo', selectedFile);

    console.log('[SUBIR ENTREGA] idTarea:', tareaId, 'idAlumno:', profile.id, 'Archivo:', selectedFileName);

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

      toast.success("Archivo subido con éxito");
      setSelectedFile(null);
      setSelectedFileName("");
      navigate(`/curso/${codigo}`);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      let mensaje = "Error al subir el archivo";
      if (error.response && error.response.data) {
        mensaje = error.response.data;
      }
      toast.error(mensaje);
    }

    setMostrarDatos(false);
  }

  const handleCancelarEntrega = () => {
    setMostrarDatos(false);
    setSelectedFile(null);
    setSelectedFileName("");
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setSelectedFileName(event.target.files[0].name);
    setMostrarDatos(true);
    const date = new Date(tarea.fechaFin);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    setFechaLimite(new Intl.DateTimeFormat('es-ES', options).format(date));
    setFechaEntrega(new Intl.DateTimeFormat('es-ES', options).format(new Date()));
  };

  const volverAlCurso = () => {
    navigate(`/curso/${codigo}`);
  };

  return (
    <Container>
      <ContentWrapper>
        <Card>
          {loading ? (
            <LoadingContainer>
              <Spinner />
            </LoadingContainer>
          ) : (
            <>
              <BackButton onClick={volverAlCurso}>
                ← Volver al curso
              </BackButton>
              <Title>{tarea.nombre}</Title>
              <Description>{tarea.descripcion}</Description>
              
              <DatesRow>
                <DateField>
                  <DateLabel>Fecha de inicio:</DateLabel>
                  <DateValue>{fechaInicio || "-"}</DateValue>
                </DateField>
                <DateField>
                  <DateLabel>Fecha de fin:</DateLabel>
                  <DateValue>{fechaLimite || "-"}</DateValue>
                </DateField>
              </DatesRow>

              {/* Mostrar detalles de la entrega si existe */}
              {loadingEntrega ? (
                <LoadingContainer>
                  <Spinner />
                </LoadingContainer>
              ) : entregaAlumno ? (
                <EntregaCard>
                  <CardTitle>Tu entrega</CardTitle>
                  <InfoField>
                    <InfoLabel>Fecha de entrega:</InfoLabel> {entregaAlumno.fechaEntrega ? new Date(entregaAlumno.fechaEntrega).toLocaleString('es-ES') : "-"}
                  </InfoField>
                  <InfoField>
                    <InfoLabel>Archivo:</InfoLabel> {entregaAlumno.urlEntregable ? entregaAlumno.urlEntregable.split('\\').pop() : "-"}
                  </InfoField>
                  {entregaAlumno.calificacion && (
                    <InfoField>
                      <InfoLabel>Calificación:</InfoLabel> {entregaAlumno.calificacion}
                    </InfoField>
                  )}
                  {entregaAlumno.urlEntregable && (
                    <ButtonGroup>
                      <DownloadButton
                        onClick={() => {
                          const urlBase = import.meta.env.VITE_BACKEND_URL;
                          const token = localStorage.getItem("token");
                          const downloadUrl = `${urlBase}/entregables/${tareaId}/entregas/${entregaAlumno.id}/descargar`;
                          fetch(downloadUrl, {
                            method: "GET",
                            headers: {
                              "Authorization": `Bearer ${token}`,
                            },
                          })
                            .then(response => response.blob())
                            .then(blob => {
                              const filename = entregaAlumno.urlEntregable.split('\\').pop();
                              const link = document.createElement('a');
                              link.href = window.URL.createObjectURL(blob);
                              link.download = filename;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            });
                        }}
                      >
                        Descargar entrega
                      </DownloadButton>
                    </ButtonGroup>
                  )}
                </EntregaCard>
              ) : (
                !mostrarDatos && (
                  <>
                    <UploadButton htmlFor="subir-archivo">
                      Subir solución
                    </UploadButton>
                    <HiddenFileInput id="subir-archivo" type="file" onChange={handleFileChange} />
                  </>
                )
              )}

              {mostrarDatos && (
                <ConfirmCard>
                  <CardTitle>Confirmar Información</CardTitle>
                  <InfoField>
                    <InfoLabel>Nombre del Archivo:</InfoLabel> {selectedFileName}
                  </InfoField>
                  <InfoField>
                    <InfoLabel>Fecha límite:</InfoLabel> {fechaLimite}
                  </InfoField>
                  <InfoField>
                    <InfoLabel>Fecha subida:</InfoLabel> {fechaEntrega}
                  </InfoField>
                  <ButtonGroup>
                    <CancelButton onClick={handleCancelarEntrega}>
                      Cancelar
                    </CancelButton>
                    <ConfirmButton onClick={handleConfirmarEntrega}>
                      Confirmar entrega
                    </ConfirmButton>
                  </ButtonGroup>
                </ConfirmCard>
              )}
            </>
          )}
        </Card>
      </ContentWrapper>
    </Container>
  );
}

export default PaginaTarea;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  background-color: #ffffffff;
  min-height: 100vh;
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
  max-width: 700px;
  padding: 0 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 40px;
  left: 40px;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #d0d0d0;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 600;
  padding-top: 30px;
`;

const Description = styled.p`
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const DatesRow = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const DateField = styled.div`
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 12px 20px;
  border-radius: 4px;
  display: flex;
  /*flex-direction: column;*/
  gap: 4px;
`;

const DateLabel = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DateValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

const EntregaCard = styled.div`
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 24px;
  margin-top: 16px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ConfirmCard = styled(EntregaCard)``;

const CardTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin: 0 0 20px 0;
  font-weight: 600;
`;

const InfoField = styled.div`
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #f5f5f5;
  color: #333;
  margin-bottom: 12px;
  word-wrap: break-word;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.strong`
  font-weight: 600;
  color: #333;
`;

const UploadButton = styled.label`
  display: block;
  margin: 24px auto 0 auto;
  padding: 14px 20px;
  background-color: #4C241D;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 300px;
  
  &:hover {
    background-color: #3a1b16;
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

const ConfirmButton = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
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

const DownloadButton = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;