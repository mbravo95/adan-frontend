import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

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
  
  // Recibir datos del curso desde PaginaCurso o cargar por defecto
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
    const obtenerDatosCurso = async () => {
      try {
        // Si ya tenemos los datos del curso desde PaginaCurso, los usamos
        if (cursoDesdePagina) {
          console.log("Usando datos del curso desde PaginaCurso:", cursoDesdePagina);
          setCursoActual(cursoDesdePagina);
        } else {
          // Si no tenemos los datos, los obtenemos de la API
          console.log("Obteniendo datos del curso desde la API...");
          const urlBase = import.meta.env.VITE_BACKEND_URL;
          const token = localStorage.getItem("token");
          
          if (!token) {
            console.error("No hay token");
            return;
          }

          const cursoResponse = await axios.get(`${urlBase}/cursos/buscar?texto=${codigo}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const cursoEncontrado = Array.isArray(cursoResponse.data) ? cursoResponse.data[0] : cursoResponse.data;
          
          if (cursoEncontrado) {
            setCursoActual({
              id: cursoEncontrado.id,
              nombre: cursoEncontrado.nombre || "Curso sin nombre",
              codigo: cursoEncontrado.codigo || "Sin código",
              ...cursoEncontrado
            });
          } else {
            setCursoActual({
              id: null,
              nombre: "Curso no encontrado",
              codigo: codigo
            });
          }
        }

        setParticipantes([
        ]);
        
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setCursoActual({
          nombre: "Error al cargar",
          codigo: codigo
        });
      } finally {
        setLoading(false);
      }
    };

    if (codigo) {
      obtenerDatosCurso();
    }
  }, [codigo, cursoDesdePagina]);

  const irMatricularEstudiante = () => {
    navigate(`/curso/${codigo}/participantes/matricular`, {
      state: { cursoActual }
    });
  };

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
        <EnrollButton onClick={irMatricularEstudiante}>
          + Matricular Estudiante
        </EnrollButton>
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
                <ParticipantName>{participante.nombre}</ParticipantName>
                <ParticipantEmail>{participante.email}</ParticipantEmail>
                <ParticipantRole role={participante.rol}>
                  {participante.rol}
                </ParticipantRole>
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
