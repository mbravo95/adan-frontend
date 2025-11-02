import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CursosUsuario = () => {
  const navigate = useNavigate();
  
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const obtenerPerfilYCursos = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No hay sesión activa");
          setLoading(false);
          return;
        }

        console.log("Obteniendo perfil del usuario desde:", `${urlBase}/usuarios/perfil`);
        
        const perfilResponse = await axios.get(`${urlBase}/usuarios/perfil`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const userIdFromProfile = perfilResponse.data.id;
        setUserId(userIdFromProfile);

        const cursosResponse = await axios.get(`${urlBase}/usuarios/${userIdFromProfile}/cursos`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = cursosResponse.data;
        const cursosProfesor = data.cursosComoProfesor || [];
        const cursosEstudiante = data.cursosComoEstudiante || [];

        const todosLosCursos = [
          ...cursosProfesor.map(curso => ({ ...curso, rolEnCurso: 'PROFESOR' })),
          ...cursosEstudiante.map(curso => ({ ...curso, rolEnCurso: 'ESTUDIANTE' }))
        ];

        setCursos(todosLosCursos);
        
      } catch (error) {
        if (error.response?.status === 404) {
          setCursos([]);
        } else {
          setError("Error al cargar los datos");
        }
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfilYCursos();
  }, []);

  const obtenerRolEnCurso = (curso) => {
    return curso.rolEnCurso || 'ESTUDIANTE';
  };

  const irACurso = (curso) => {
    navigate(`/curso/${curso.codigo}`);
  };

  return (
    <Container>
      <ContentWrapper>
        <Title>Mis Cursos</Title>
        
        {loading && (
          <LoadingMessage>
            Cargando
          </LoadingMessage>
        )}
        
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
        
        {!loading && !error && (
          <>
            {cursos.length > 0 ? (
              <CoursesGrid>
                {cursos.map((curso) => (
                  <CourseCard key={curso.id}>
                    <CourseTitle onClick={() => irACurso(curso)}>
                      {curso.nombre || "Curso sin nombre"}
                    </CourseTitle>
                    <CourseDetails>
                      <DetailRow>
                        <DetailLabel>Código:</DetailLabel>
                        <DetailValue>{curso.codigo || "No disponible"}</DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Turno:</DetailLabel>
                        <DetailValue>{curso.turno || "No especificado"}</DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Rol:</DetailLabel>
                        <StatusBadge status={obtenerRolEnCurso(curso)}>
                          {obtenerRolEnCurso(curso)}
                        </StatusBadge>
                      </DetailRow>
                    </CourseDetails>
                  </CourseCard>
                ))}
              </CoursesGrid>
            ) : (
              <EmptyState>
                <h3>No hay cursos asociados</h3>
                <p>
                  No hay cursos asociados en el sistema <br />
                </p>
              </EmptyState>
            )}
          </>
        )}
      </ContentWrapper>
    </Container>
  )
}

export default CursosUsuario;


const Container = styled.div`
  background-color: #9DCBD7;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 25px;
  width: 100%;
  margin-bottom: 30px;
`;

const CourseCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CourseTitle = styled.h2`
  color: #333;
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4C241D;
    text-decoration: underline;
  }
`;



const CourseDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch(props.status) {
      case 'PROFESOR':
        return `
          background-color: #f3e5f5;
          color: #4a148c;
        `;
      case 'ESTUDIANTE':
        return `
          background-color: #e8f5e8;
          color: #2d5016;
        `;
      case 'ACTIVO':
      case 'INSCRITO':
        return `
          background-color: #e8f5e8;
          color: #2d5016;
        `;
      case 'COMPLETADO':
        return `
          background-color: #e3f2fd;
          color: #0d47a1;
        `;
      case 'PENDIENTE':
        return `
          background-color: #fff3e0;
          color: #e65100;
        `;
      default:
        return `
          background-color: #f5f5f5;
          color: #666;
        `;
    }
  }}
`;

const LoadingMessage = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const EmptyState = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 60px 40px;
  text-align: center;
  color: #666;
  
  h3 {
    color: #333;
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  p {
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
  }
`;
