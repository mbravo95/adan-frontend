import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Spinner from "../general/Spinner";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const EntregasTarea = () => {
  const { tareaId, codigo } = useParams();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [calificandoId, setCalificandoId] = useState(null);
  const [calificacion, setCalificacion] = useState("");

  useEffect(() => {
    const fetchEntregas = async () => {
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
        setEntregas(response.data);
      } catch (error) {
        setEntregas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEntregas();
  }, [tareaId]);
  
  const descargarEntrega = async (tareaId, entregaId) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const downloadUrl = `${urlBase}/entregables/${tareaId}/entregas/${entregaId}/descargar`;
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al descargar el archivo");
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `entrega_${entregaId}.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/"/g, '');
        }
      }
      
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error("Error al descargar el archivo");
    }
  };

  const handleEnviarCalificacion = async (entrega) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const body = {
        idEntregable: entrega.id,
        idTarea: tareaId,
        calificacion: calificacion
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`${urlBase}/entregables/calificar`, body, config);
      toast.success("Calificación enviada correctamente");
      setCalificandoId(null);
      setCalificacion("");
      // Actualizar la entrega en el estado
      setEntregas(prev => prev.map(e => 
        e.id === entrega.id ? { ...e, calificacion: calificacion } : e
      ));
    } catch (error) {
      toast.error("Error al enviar la calificación");
    }
  };

  const irCalificarEntregasCsv = () => {
    navigate(`/curso/${codigo}/tarea/${tareaId}/entregas/calificar-csv`);
  }

  const descargarTodasLasEntregas = async () => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const downloadUrl = `${urlBase}/entregables/${tareaId}/entregas/descargar-todas`;
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al descargar las entregas");
      const blob = await response.blob();
      const filename = `entregas_tarea_${tareaId}.zip`;
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      //toast.success("Descarga iniciada correctamente");
    } catch (err) {
      toast.error("Error al descargar todas las entregas");
    }
  };

  const volverAlCurso = () => {
  navigate(`/curso/${codigo}`);
  };

  return (
    <Container>
      <ContentWrapper>
        <Card>
          <BackButton onClick={volverAlCurso}>
            ← Volver al curso
          </BackButton>
          <Title>Entregas de la tarea</Title>
          <ButtonContainer>
            <CsvButton onClick={() => descargarTodasLasEntregas()}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.125 9.375V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V9.375M4.375 6.25L7.5 9.375M7.5 9.375L10.625 6.25M7.5 9.375V1.875" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Descargar todas las entregas
            </CsvButton>
            <CsvButton onClick={() => irCalificarEntregasCsv()}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.625 6.875L7.5 8.75L13.75 2.5M13.125 7.5V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Calificar entregas vía CSV
            </CsvButton>
          </ButtonContainer>
          {loading ? (
            <LoadingContainer>
              <Spinner />
            </LoadingContainer>
          ) : entregas.length === 0 ? (
            <EmptyMessage>No hay entregas para esta tarea.</EmptyMessage>
          ) : (
            <EntregaList>
              {entregas.map((entrega) => (
                <EntregaItem key={entrega.id}>
                  <EntregaContent>
                    <EntregaInfo>
                      <InfoRow><InfoLabel>Alumno:</InfoLabel> {entrega.nombres} {entrega.apellidos}</InfoRow>
                      <InfoRow><InfoLabel>Fecha de entrega:</InfoLabel> {entrega.fechaEntrega ? new Date(entrega.fechaEntrega).toLocaleString('es-ES') : "-"}</InfoRow>
                      <InfoRow><InfoLabel>Archivo:</InfoLabel> {entrega.urlEntregable ? entrega.urlEntregable.split('\\').pop() : "-"}</InfoRow>
                      <InfoRow><InfoLabel>Calificación:</InfoLabel> {entrega.calificacion ? entrega.calificacion : "Sin calificar"}</InfoRow>
                    </EntregaInfo>
                    <ActionButtons>
                      <DownloadButton
                        onClick={() => descargarEntrega(entrega.idTarea || tareaId, entrega.id)}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.125 9.375V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V9.375M4.375 6.25L7.5 9.375M7.5 9.375L10.625 6.25M7.5 9.375V1.875" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Descargar
                      </DownloadButton>
                      <GradeButton
                        onClick={() => setCalificandoId(entrega.id)}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.625 6.875L7.5 8.75L13.75 2.5M13.125 7.5V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H10" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Calificar entrega
                      </GradeButton>
                    </ActionButtons>
                  </EntregaContent>
                  {calificandoId === entrega.id && (
                    <GradeForm>
                      <GradeInput
                        type="text"
                        value={calificacion}
                        onChange={e => setCalificacion(e.target.value)}
                        placeholder="Ingresa la calificación"
                      />
                      <GradeButtonGroup>
                        <SubmitButton
                          onClick={() => handleEnviarCalificacion(entrega)}
                        >
                          Enviar
                        </SubmitButton>
                        <CancelButton
                          onClick={() => {
                            setCalificandoId(null);
                            setCalificacion("");
                          }}
                        >
                          Cancelar
                        </CancelButton>
                      </GradeButtonGroup>
                    </GradeForm>
                  )}
                </EntregaItem>
              ))}
            </EntregaList>
          )}
        </Card>
      </ContentWrapper>
    </Container>
  );
};

export default EntregasTarea;

const Container = styled.div`
  background-color: #ffffffff;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 90px;
  padding-bottom: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
`;

const Title = styled.h2`
  color: #333;
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 24px;
`;

const CsvButton = styled.button`
  background-color: #2a2a2a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #171717ff;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 16px;
  margin: 40px 0;
`;

const EntregaList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const EntregaItem = styled.li`
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
`;

const EntregaContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const EntregaInfo = styled.div`
  flex: 1;
`;

const InfoRow = styled.div`
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.strong`
  font-weight: 600;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-left: 20px;
`;

const ActionButton = styled.button`
  background-color: #dededeff;
  color: #000;
  border: 1px solid #4b4b4bff;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DownloadButton = styled(ActionButton)``;

const GradeButton = styled(ActionButton)``;

const GradeForm = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GradeInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const GradeButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const SubmitButton = styled.button`
  background-color: #4C241D;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a1b16;
  }
`;

const CancelButton = styled.button`
  background-color: white;
  color: #333;
  padding: 10px 20px;
  border-radius: 4px;
  border: 2px solid #ddd;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
`;

const BackButton = styled.button`
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #d0d0d0;
  }
`;