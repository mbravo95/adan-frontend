import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { puedeAdministrarCursos } from '../utils/permisoCursos';

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  width: 100%;
  padding-top: 90px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
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
  display: flex;
  align-items: center;
  gap: 5px;

  background-color: #2a2a2a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #171717ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EnrollButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
`;

const SearchControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  min-width: 900px;
`;

const FilterInput = styled.input`
  flex-grow: 1;
  max-width: 450px;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: #f4f4f4;
`;

const BaseFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s, transform 0.2s;
  flex-shrink: 0;
  
  svg {
    width: 1em;
    height: 1em;
  }
`;

const SearchButton = styled(BaseFilterButton)`
  background-color: #2a2a2a;
  color: white;

  &:hover {
    background-color: #171717ff;
    transform: translateY(-1px);
  }
`;

const ResetButton = styled(BaseFilterButton)`
  background-color: #2a2a2a;
  color: white;

  &:hover {
    background-color: #171717ff;
    transform: translateY(-1px);
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

const PlaceholderMessage = styled.div`
  text-align: center;
  padding: 15px 15px;
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

const SearchIconSVG = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M39.2 42L26.6 29.4C25.6 30.2 24.45 30.8333 23.15 31.3C21.85 31.7667 20.4667 32 19 32C15.3667 32 12.2917 30.7417 9.775 28.225C7.25833 25.7083 6 22.6333 6 19C6 15.3667 7.25833 12.2917 9.775 9.775C12.2917 7.25833 15.3667 6 19 6C22.6333 6 25.7083 7.25833 28.225 9.775C30.7417 12.2917 32 15.3667 32 19C32 20.4667 31.7667 21.85 31.3 23.15C30.8333 24.45 30.2 25.6 29.4 26.6L42 39.2L39.2 42ZM19 28C21.5 28 23.625 27.125 25.375 25.375C27.125 23.625 28 21.5 28 19C28 16.5 27.125 14.375 25.375 12.625C23.625 10.875 21.5 10 19 10C16.5 10 14.375 10.875 12.625 12.625C10.875 14.375 10 16.5 10 19C10 21.5 10.875 23.625 12.625 25.375C14.375 27.125 16.5 28 19 28Z" fill="white"/>
  </svg>
);

const ResetIconSVG = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M46 8.00015V20.0002M46 20.0002H34M46 20.0002L36.72 11.2802C34.5705 9.12958 31.9113 7.55856 28.9904 6.7137C26.0695 5.86883 22.9822 5.77765 20.0166 6.44867C17.0509 7.11968 14.3036 8.53102 12.0309 10.551C9.75827 12.571 8.03434 15.1337 7.02 18.0002M2 40.0002V28.0002M2 28.0002H14M2 28.0002L11.28 36.7202C13.4295 38.8707 16.0887 40.4417 19.0096 41.2866C21.9305 42.1315 25.0178 42.2226 27.9834 41.5516C30.9491 40.8806 33.6964 39.4693 35.9691 37.4493C38.2417 35.4293 39.9657 32.8666 40.98 30.0002" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
  const [profesores, setProfesores] = useState([]);
  const [participantesFiltrados, setParticipantesFiltrados] = useState([]);
  const [profesoresFiltrados, setProfesoresFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
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
          const profesores = participantesResponse.data.profesores || [];
          setParticipantes(estudiantes);
          setProfesores(profesores);
          setParticipantesFiltrados(estudiantes);
          setProfesoresFiltrados(profesores);
        } else {
          setParticipantes([]);
          setProfesores([]);
          setParticipantesFiltrados([]);
          setProfesoresFiltrados([]);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setCursoActual({
          nombre: "Error al cargar",
          codigo: codigo
        });
        setParticipantes([]);
        setProfesores([]);
        setParticipantesFiltrados([]);
        setProfesoresFiltrados([]);
      } finally {
        setLoading(false);
      }
    };

    if (codigo) {
      obtenerDatosCursoYParticipantes();
    }
  }, [codigo, cursoDesdePagina]);

  const filtrarParticipantes = async () => {
    if (busqueda === "") {
      setParticipantesFiltrados(participantes);
      setProfesoresFiltrados(profesores);
      return;
    }

    const texto = busqueda.toLowerCase();
    const urlBase = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      const response = await axios.get(
        `${urlBase}/cursos/${cursoActual.id}/participantes/buscar?texto=${texto}`, 
        config
      );
      
      const participantesRetornados = response.data;
      
      // Separar por rol
      const profsFiltrados = participantesRetornados.filter(p => p.rol === "PROFESOR");
      const estudiantesFiltrados = participantesRetornados.filter(p => p.rol === "ESTUDIANTE");
      
      setProfesoresFiltrados(profsFiltrados);
      setParticipantesFiltrados(estudiantesFiltrados);
    } catch (error) {
      console.log(error);
      setProfesoresFiltrados([]);
      setParticipantesFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const resetearBusqueda = () => {
    setBusqueda("");
    setParticipantesFiltrados(participantes);
    setProfesoresFiltrados(profesores);
  };

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
        
        {/* Controles de búsqueda */}
        <SearchControls>
          <FilterInput 
            placeholder="Buscar participantes..." 
            onChange={(e) => setBusqueda(e.target.value)} 
            value={busqueda}
            onKeyDown={(e) => e.key === 'Enter' && filtrarParticipantes()}
          />
          <SearchButton onClick={filtrarParticipantes}> 
            <SearchIconSVG /> Buscar
          </SearchButton>
          <ResetButton onClick={resetearBusqueda}>
            <ResetIconSVG /> Restablecer resultados
          </ResetButton>
        </SearchControls>
      </Header>

      {puedeAdministrarCursos(location.pathname) && (
        <EnrollButtonGroup>
          <EnrollButton onClick={irMatricularEstudiante}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 3.125V11.875M3.125 7.5H11.875" stroke="#ffffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Matricular Estudiante
          </EnrollButton>
          <EnrollButton onClick={irMatricularEstudianteCsv}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 3.125V11.875M3.125 7.5H11.875" stroke="#ffffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Matricular Estudiantes CSV
          </EnrollButton>
          <EnrollButton onClick={irDesmatricularEstudianteCsv}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.125 7.5H11.875" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Desmatricular Estudiantes CSV
          </EnrollButton>
          <EnrollButton onClick={irCalificarEstudianteCsv}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.625 6.875L7.5 8.75L13.75 2.5M13.125 7.5V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H10" stroke="#ffffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Calificar Estudiantes CSV
          </EnrollButton>
        </EnrollButtonGroup>
      )}

      <ParticipantsSection>
        <SectionTitle>Profesores:</SectionTitle>
        
        {loading ? (
          <PlaceholderMessage>
            Cargando profesores...
          </PlaceholderMessage>
        ) : profesoresFiltrados.length > 0 ? (
          <ParticipantsGrid>
            {profesoresFiltrados.map((profesor) => (
              <ParticipantCard key={profesor.id}>
                <ParticipantName
                  style={{ cursor: 'default', textDecoration: 'underline' }}
                >
                  {profesor.nombres} {profesor.apellidos}
                </ParticipantName>
                <ParticipantEmail>{profesor.correo}</ParticipantEmail>
              </ParticipantCard>
            ))}
          </ParticipantsGrid>
        ) : (
          <PlaceholderMessage>
            <h3>{busqueda ? "No se encontraron profesores" : "No hay profesores"}</h3>
          </PlaceholderMessage>
        )}

        <SectionTitle>Estudiantes:</SectionTitle>
        
        {loading ? (
          <PlaceholderMessage>
            Cargando participantes...
          </PlaceholderMessage>
        ) : participantesFiltrados.length > 0 ? (
          <ParticipantsGrid>
            {participantesFiltrados.map((participante) => (
              <ParticipantCard key={participante.id}>
                <ParticipantName
                  style={{
                    cursor: puedeAdministrarCursos(location.pathname) ? "pointer" : "default",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    if (!puedeAdministrarCursos(location.pathname)) return;
                    navigate(`/curso/${cursoActual.id}/estudiante/${participante.id}/calificacion`);
                  }}
                >
                  {participante.nombres} {participante.apellidos}
                </ParticipantName>
                <ParticipantEmail>{participante.correo}</ParticipantEmail>
              </ParticipantCard>
            ))}
          </ParticipantsGrid>
        ) : (
          <PlaceholderMessage>
            <h3>{busqueda ? "No se encontraron estudiantes" : "No hay estudiantes"}</h3>
          </PlaceholderMessage>
        )}
      </ParticipantsSection>
    </Container>
  );
};

export default ParticipantesCurso;