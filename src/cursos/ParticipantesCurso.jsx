import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { puedeAdministrarCursos } from '../utils/permisoCursos';

const Container = styled.div`
  background-color: white;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  padding: 40px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
`;

const Title = styled.h1`
  color: #333;
  font-size: 32px;
  margin: 0;
  font-weight: 600;
`;

const CourseInfo = styled.div`
  color: #666;
  font-size: 16px;
`;

const EnrollButton = styled.button`
  background-color: #4C241D;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a1b16;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EnrollButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const ParticipantsSection = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
`;

const ParticipantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ParticipantCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ParticipantName = styled.h3`
  color: #333;
  font-size: 18px;
  margin: 0 0 8px 0;
  font-weight: 600;
`;

const ParticipantEmail = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 8px 0;
`;

const ParticipantRole = styled.span`
  background-color: ${props => props.role === 'PROFESOR' ? '#e3f2fd' : '#f3e5f5'};
  color: ${props => props.role === 'PROFESOR' ? '#0d47a1' : '#4a148c'};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const PlaceholderMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
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

const ParticipantesCurso = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cursoDesdePagina = location.state?.cursoActual;

  const [cursoActual, setCursoActual] = useState(
    cursoDesdePagina || {
      nombre: "Cargando...",
      codigo: codigo
    }
  );
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatosCursoYParticipantes = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No hay token");
          return;
        }

        let cursoId = null;
        let cursoInfo = cursoDesdePagina;
        if (!cursoInfo) {
          const cursoResponse = await axios.get(`${urlBase}/cursos/buscar?texto=${codigo}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const cursoEncontrado = Array.isArray(cursoResponse.data) ? cursoResponse.data[0] : cursoResponse.data;
          cursoInfo = cursoEncontrado;
        }
        if (cursoInfo) {
          setCursoActual({
            id: cursoInfo.id,
            nombre: cursoInfo.nombre || "Curso sin nombre",
            codigo: cursoInfo.codigo || "Sin código",
            ...cursoInfo
          });
          cursoId = cursoInfo.id;
        } else {
          setCursoActual({
            id: null,
            nombre: "Curso no encontrado",
            codigo: codigo
          });
        }

        if (cursoId) {
          const participantesResponse = await axios.get(`${urlBase}/cursos/${cursoId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const estudiantes = participantesResponse.data.estudiantes || [];
          setParticipantes(estudiantes);
        } else {
          setParticipantes([]);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setCursoActual({
          nombre: "Error al cargar",
          codigo: codigo
        });
        setParticipantes([]);
      } finally {
        setLoading(false);
      }
    };

    if (codigo) {
      obtenerDatosCursoYParticipantes();
    }
  }, [codigo, cursoDesdePagina]);

  const irMatricularEstudiante = () => {
    navigate(`/curso/${codigo}/participantes/matricular`, {
      state: { cursoActual }
    });
  };

  const irMatricularEstudianteCsv = () => {
    navigate(`/curso/${codigo}/participantes/matricular-csv`, {
      state: { cursoActual }
    });
  }

  const irDesmatricularEstudianteCsv = () => {
    navigate(`/curso/${codigo}/participantes/desmatricular-csv`, {
      state: { cursoActual }
    });
  }

  const irCalificarEstudianteCsv = () => {
    navigate(`/curso/${codigo}/participantes/calificar-csv`, {
      state: { cursoActual }
    });
  }

  const volverAlCurso = () => {
  navigate(`/curso/${codigo}`);
  };

  return (
    <Container>
      <BackButton onClick={volverAlCurso}>
        ← Volver al curso
      </BackButton>
      
      <Header>
        <div>
          <Title>Participantes del Curso</Title>
          <CourseInfo>
            {cursoActual.nombre} - Código: {cursoActual.codigo}
          </CourseInfo>
        </div>
        {puedeAdministrarCursos(location.pathname) && (
          <EnrollButtonGroup>
            <EnrollButton onClick={irMatricularEstudiante}>
              + Matricular Estudiante
            </EnrollButton>
            <EnrollButton onClick={irMatricularEstudianteCsv}>
              + Matricular Múltiple
            </EnrollButton>
            <EnrollButton onClick={irDesmatricularEstudianteCsv}>
              - Desmatricular Múltiple
            </EnrollButton>
            <EnrollButton onClick={irCalificarEstudianteCsv}>
              Calificar Estudiantes CSV
            </EnrollButton>
          </EnrollButtonGroup>
        )}
      </Header>

      <ParticipantsSection>
        <SectionTitle>Lista de Participantes</SectionTitle>
        
        {loading ? (
          <PlaceholderMessage>
            Cargando participantes...
          </PlaceholderMessage>
        ) : participantes.length > 0 ? (
          <ParticipantsGrid>
            {participantes.map((participante) => (
              <ParticipantCard key={participante.id}>
                <ParticipantName
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => navigate(`/curso/${cursoActual.id}/estudiante/${participante.id}/calificacion`)}
                >
                  {participante.nombres} {participante.apellidos}
                </ParticipantName>
                <ParticipantEmail>{participante.correo}</ParticipantEmail>
              </ParticipantCard>
            ))}
          </ParticipantsGrid>
        ) : (
          <PlaceholderMessage>
            <h3>No hay participantes</h3>
          </PlaceholderMessage>
        )}
      </ParticipantsSection>
    </Container>
  );
};

export default ParticipantesCurso;
