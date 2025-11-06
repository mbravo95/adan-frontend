import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ModalConfirmacion from "../general/ModalConfirmacion";
import Spinner from "../general/Spinner";
import useCursoData from "../hooks/useCursoData";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDesmatricularId, setUserDesmatricularId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const { esProfesor } = useCursoData(codigo);
  const rol = localStorage.getItem("tipo");

  const prepararParticipantes = (estudiantes, profesores) => {
    const estudiantesConRol = estudiantes.map(estudiante => ({
        ...estudiante,
        rol: 'ESTUDIANTE'
    }));

  
    const profesoresConRol = profesores.map(profesor => ({
        ...profesor,
        rol: 'PROFESOR'
    }));

    let participantes = [...estudiantesConRol, ...profesoresConRol];
    participantes.sort((a, b) => a.id - b.id);

    return participantes;
  }


  useEffect(() => {
    const obtenerDatosCurso = async () => {
      try {
          console.log("Obteniendo datos del curso desde la API...");
          const urlBase = import.meta.env.VITE_BACKEND_URL;
          const token = localStorage.getItem("token");
          
          if (!token) {
            console.error("No hay token");
            return;
          }

          const cursoResponse = await axios.get(`${urlBase}/cursos`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const cursoEncontrado = cursoResponse.data.filter(curso => curso.id == cursoActual.id)[0];
          
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

        setParticipantes(prepararParticipantes(cursoEncontrado.estudiantes, cursoEncontrado.profesores));
        
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

  const handleDesmatricular = async () => {
        if (!userDesmatricularId) return;
    
        setLoading(true);
    
        try {    
          const urlBase = import.meta.env.VITE_BACKEND_URL;
          const token = localStorage.getItem("token");
          const config = {
              headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              },
          };
          const response = await axios.post(`${urlBase}/cursos/desmatricularEstudiante`, { idUsuario: userDesmatricularId, idCurso: cursoActual.id }, config);
          console.log(response);
          toast.success("Estudiante desmatriculado exitosamente", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          });
          setParticipantes(participantes.filter(part => part.id != userDesmatricularId));
          handleCancelar();
        } catch (error) {
          console.error("Error al desmatricular el estudiante:", error);
          toast.error("Ocurrió un error al desmatricular el estudiante", {
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
  }

  const handleCancelar = () => {
    setIsModalOpen(false);
    setUserDesmatricularId(null);
  };

   const desmatricular = (idUsuario) => {
    setUserDesmatricularId(idUsuario);
    setIsModalOpen(true);
  };

  const handleFiltrar = async () => {
    setLoading(true);
    try {
      const lowerCaseSearch = busqueda.toLowerCase();
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${urlBase}/cursos/${cursoActual.id}/participantes/buscar?texto=${lowerCaseSearch}`, config);
      setParticipantes(response.data);
    } catch (error) {
      console.error("Error al filtrar participantes:", error);
      setParticipantes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBusqueda('');
    setParticipantes(prepararParticipantes(cursoActual.estudiantes, cursoActual.profesores));
  };

  return (
    <Container>
      <BackButton onClick={volverAlCurso}>
        ← Volver al curso
      </BackButton>

      <ModalConfirmacion
              isOpen={isModalOpen}
              message={`¿Estás seguro de que quieres desmatricular este estudiante?`}
              onConfirm={handleDesmatricular}
              onCancel={handleCancelar}
              isLoading={loading}
            />
      
      <Header>
        <div>
          <Title>Participantes del Curso</Title>
          <CourseInfo>
            {cursoActual.nombre} - Código: {cursoActual.codigo}
          </CourseInfo>
        </div>
        { (esProfesor || rol == "ADMINISTRADOR") &&
        <EnrollButton onClick={irMatricularEstudiante}>
          + Matricular Estudiante
        </EnrollButton>
        }
      </Header>

      <ParticipantsSection>
        <SectionTitle>Lista de Participantes</SectionTitle>

        <FilterContainer>
          <SearchBar 
            type="text"
            placeholder="Filtrar por nombre, correo o rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFiltrar(); // Permite filtrar con Enter
                }
              }}
          />
          <FilterButton onClick={handleFiltrar}>
            🔍 Filtrar
          </FilterButton>
          <ResetButton onClick={handleReset}>
            Restablecer
          </ResetButton>
        </FilterContainer>
        
        {loading ? (
          <Spinner />
        ) : participantes.length > 0 ? (
          <ParticipantsGrid>
            {participantes.map((participante) => (
              <ParticipantCard key={participante.id}>
                <ParticipantInfo>
                  <ParticipantName>{participante.nombres}</ParticipantName>
                  <ParticipantEmail>{participante.correo}</ParticipantEmail>
                  <ParticipantRole role={participante.rol}>
                    {participante.rol}
                  </ParticipantRole>
                </ParticipantInfo>
                {participante.rol === 'ESTUDIANTE' && (esProfesor || rol == "ADMINISTRADOR") && (
                  <UnenrollButton 
                    onClick={() => desmatricular(participante.id)}
                  >
                    Desmatricular
                  </UnenrollButton>
                )}
              </ParticipantCard>
            ))}
          </ParticipantsGrid>
        ) : (
          <PlaceholderMessage>
            {busqueda ? (
              <h3>No hay participantes que coincidan con "{busqueda}"</h3>
            ) : (
              <h3>No hay participantes</h3>
            )}
          </PlaceholderMessage>
        )}
      </ParticipantsSection>
    </Container>
  );
};

export default ParticipantesCurso;


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
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ParticipantInfo = styled.div`
  flex-grow: 1; 
`;

const UnenrollButton = styled.button`
  background-color: #FF5722;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: 15px;
  
  &:hover {
    background-color: #e64a19;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 25px;
`;

const SearchBar = styled.input`
  flex-grow: 1;
  max-width: 400px; 
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    border-color: #3b5998;
    outline: none;
  }
`;


const FilterButton = styled.button`
  background-color: #3b5998;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #2b4480;
  }
`;

const ResetButton = styled.button`
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #c0c0c0;
  }
`;
