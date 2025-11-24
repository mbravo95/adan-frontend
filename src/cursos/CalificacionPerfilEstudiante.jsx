import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { puedeAdministrarCursos } from '../utils/permisoCursos';

const CalificacionPerfilEstudiante = () => {
  const { estudianteId, id } = useParams();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [calificacion, setCalificacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codigoCurso, setCodigoCurso] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token");

        const estudianteResp = await axios.get(`${urlBase}/usuarios/${estudianteId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setEstudiante(estudianteResp.data);
        // el get de calificaciones
        /*const calificacionResp = await axios.get(`${urlBase}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCalificacion(calificacionResp.data);*/

          const cursoResp = await axios.get(`${urlBase}/cursos/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          setCodigoCurso(cursoResp.data.codigo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (estudianteId && id) fetchDatos();
  }, [estudianteId, id]);



  const handleDesmatricular = async () => {
    if (!confirm('¿Estás seguro de que deseas desmatricular a este estudiante?')) {
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
      await axios.post(`${urlBase}/cursos/desmatricularEstudiante`, {
        idCurso: Number(id),
        idUsuario: Number(estudianteId)
      }, config);
      toast.success("Estudiante desmatriculado correctamente");
      navigate(-1);
    } catch (err) {
      toast.error("Error al desmatricular estudiante");
    }
  };

  if (loading) return (
    <Container>
      <ContentWrapper>
        <Card>
          <LoadingMessage>Cargando datos...</LoadingMessage>
        </Card>
      </ContentWrapper>
    </Container>
  );
  
  if (error) return (
    <Container>
      <ContentWrapper>
        <Card>
          <ErrorMessage>Error: {error}</ErrorMessage>
        </Card>
      </ContentWrapper>
    </Container>
  );
  
  if (!estudiante) return (
    <Container>
      <ContentWrapper>
        <Card>
          <ErrorMessage>No se encontró el estudiante.</ErrorMessage>
        </Card>
      </ContentWrapper>
    </Container>
  );

  const volverAParticipantes = () => {
		navigate(`/curso/${codigoCurso}/participantes`);
	};

  return (
    <Container>
      <ContentWrapper>
        <Card>
          <BackButton onClick={volverAParticipantes}>
            ← Volver a participantes
          </BackButton>
          <Title>Perfil del Estudiante</Title>
          
          <InfoSection>
            <InfoField>
              <InfoLabel>Nombre:</InfoLabel>
              <InfoValue>{estudiante.nombres} {estudiante.apellidos}</InfoValue>
            </InfoField>
            <InfoField>
              <InfoLabel>Correo:</InfoLabel>
              <InfoValue>{estudiante.correo}</InfoValue>
            </InfoField>
            <InfoField>
              <InfoLabel>Cédula:</InfoLabel>
              <InfoValue>{estudiante.cedula}</InfoValue>
            </InfoField>
          </InfoSection>

          {puedeAdministrarCursos(location.pathname) && (
            <CalificacionContainer>
              <Subtitle>Calificación en el curso:</Subtitle>
            </CalificacionContainer>
          )}
          
          {puedeAdministrarCursos(location.pathname) && (
            <ButtonGroup>
              <CalificarButton onClick={() => navigate(`/curso/${id}/estudiante/${estudianteId}/calificar`)}>
                Calificar estudiante
              </CalificarButton>
              <DesmatricularButton onClick={handleDesmatricular}>
                Desmatricular estudiante
              </DesmatricularButton>
            </ButtonGroup>
          )}
        </Card>
      </ContentWrapper>
    </Container>
  );
};

export default CalificacionPerfilEstudiante;

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
  max-width: 600px;
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

const Subtitle = styled.h3`
  color: #333;
  font-size: 18px;
  margin: 0;
  font-weight: 600;
`;

const CalificacionContainer = styled.div`
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 16px 20px;
  border-radius: 4px;
  margin-top: 24px;
  margin-bottom: 16px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const InfoField = styled.div`
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 12px 16px;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const InfoLabel = styled.strong`
  font-weight: 600;
  color: #333;
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: #666;
  font-size: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CalificarButton = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
  }
`;

const DesmatricularButton = styled(Button)`
  background-color: #d72d3eff;
  color: white;
  
  &:hover {
    background-color: #b82432;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 16px;
  padding: 20px 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e53e3e;
  font-size: 16px;
  padding: 20px;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 4px;
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