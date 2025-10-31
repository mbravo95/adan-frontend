import { Outlet, Navigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
`;

const CourseDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
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

const AddButton = styled.button`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
  padding: 15px 30px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Button = styled.button`
  flex: 1 1 calc(50% - 5px);
  padding: 14px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
`;

const EditButton = styled(Button)`
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const AsignarDocenteButton = styled(Button)`
  background-color: #1d4c4c;
  color: white;
  
  &:hover {
    background-color: #163a38;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const DesasignarDocenteButton = styled(Button)`
  background-color: #4c2c1d;
  color: white;
  
  &:hover {
    background-color: #3a2716;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const CourseActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
`;

const HomeCurso = () => {
  const rol = localStorage.getItem("tipo");
  const navigate = useNavigate();
  
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCursos = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No hay sesión activa");
          setLoading(false);
          return;
        }

        console.log("Obteniendo cursos desde:", `${urlBase}/cursos`);

        const response = await axios.get(`${urlBase}/cursos`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Cursos obtenidos:", response.data);
        setCursos(response.data || []);
        
      } catch (error) {
        console.error("Error al obtener cursos:", error);
        setError("Error al cargar los cursos");
      } finally {
        setLoading(false);
      }
    };

    if (rol === "ADMINISTRADOR") {
      obtenerCursos();
    }
  }, [rol]);

  const irCrearCurso = () => {
    navigate('/cursos/crear');
  };

  const irEditarCurso = (curso) => {
    console.log("Ir a editar curso", curso);
  };

  const irEliminarCurso = (cursoId) => {
    console.log("Ir a eliminar curso", cursoId);
  };

  const irAsignarCursoDocente = (curso) => {
    navigate('/admin-cursos/asignar-profesor', {
      state: { curso }
    });
  };

   const irDesasignarCursoDocente = (curso) => {
    navigate('/admin-cursos/desasignar-profesor', {
      state: { curso }
    });
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "No disponible";
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES');
    } catch (error) {
      return fechaString;
    }
  };

  if (rol !== "ADMINISTRADOR") {
    return <Navigate to="/usuario" />;
  }

  return (
    <Container>
      <ContentWrapper>
        <Title>Administración de Cursos</Title>
        
        {loading && (
          <LoadingMessage>
            Cargando cursos...
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
                    <CourseTitle>{curso.nombre || "Curso sin nombre"}</CourseTitle>
                    <CourseDescription>
                      {curso.descripcion || "Sin descripción disponible"}
                    </CourseDescription>
                    <CourseDetails>
                      <DetailRow>
                        <DetailLabel>Duración:</DetailLabel>
                        <DetailValue>{curso.duracion || "No especificada"}</DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Modalidad:</DetailLabel>
                        <DetailValue>{curso.modalidad || "No especificada"}</DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Precio:</DetailLabel>
                        <DetailValue>
                          {curso.precio ? `$${curso.precio}` : "No especificado"}
                        </DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Fecha de creación:</DetailLabel>
                        <DetailValue>{formatearFecha(curso.fechaCreacion)}</DetailValue>
                      </DetailRow>
                    </CourseDetails>
                    <CourseActions>
                      <AsignarDocenteButton onClick={() => irAsignarCursoDocente(curso)}>
                        Asignar Profesor
                      </AsignarDocenteButton>
                      <DesasignarDocenteButton onClick={() => irDesasignarCursoDocente(curso)}>
                        Desasignar Profesor
                      </DesasignarDocenteButton>
                      <EditButton onClick={() => irEditarCurso(curso)}>
                        Editar
                      </EditButton>
                      <DeleteButton onClick={() => irEliminarCurso(curso.id)}>
                        Eliminar
                      </DeleteButton>
                    </CourseActions>
                  </CourseCard>
                ))}
              </CoursesGrid>
            ) : (
              <ErrorMessage>
                No hay cursos disponibles
              </ErrorMessage>
            )}
            
            <AddButton onClick={irCrearCurso}>
              Crear nuevo curso
            </AddButton>
          </>
        )}
        
        <Outlet />
      </ContentWrapper>
    </Container>
  )
}

export default HomeCurso;