  const agregarTarea = (seccionId) => {
    navigate(`/curso/${codigo}/${seccionId}/crear-tarea`);
  } 
import { Outlet, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

const Container = styled.div`
  background-color: white;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  display: flex;
  box-sizing: border-box;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  box-sizing: border-box;
  min-height: calc(100vh - 60px);
`;

const CourseTitle = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 30px;
  font-weight: 600;
  border-bottom: 2px solid #4C241D;
  padding-bottom: 10px;
`;

const ParticipantsButton = styled.button`
  width: 100%;
  background-color: black;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #333;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const IndexSection = styled.div`
  margin-top: 20px;
`;

const IndexTitle = styled.h2`
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
`;

const IndexList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const IndexItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4C241D;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const CourseInfoHeader = styled.div`
  width: calc(100% - 40px);
  background-color: #c0386eff;
  color: white;
  padding: 15px 25px;
  margin: 20px;
  border-radius: 8px;
  box-sizing: border-box;
`;

const CourseInfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  max-width: 500px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color : black;
`;

const InfoLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: black;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 3px;
  color: black;
`;

const AddSectionButton = styled.button`
  background-color: #ffffffff;
  color: black;
  width: 96.4%;
  text-align: left;
  border: 1px solid grey;
  padding: 12px 24px;
  margin: 0 20px 20px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  
  &:hover {
    background-color: #9DCBD7;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const UploadMaterialButton = styled.button`
  width: 100%;
  background-color: #050505ff;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  text-align: center;

`;

const SectionsContainer = styled.div`
  margin: 0 20px;
  padding: 0;
`;

const SectionPlaceholder = styled.div`
  background-color: #f8f9fa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4C241D;
    background-color: #f5f5f5;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.collapsed ? '0' : '15px'};
  cursor: pointer;
  padding: 10px 0;
  
  &:hover {
    background-color: rgba(76, 36, 29, 0.05);
  }
`;

const SectionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const CollapseIcon = styled.span`
  font-size: 16px;
  color: #4C241D;
  transition: transform 0.3s ease;
  transform: ${props => props.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};
`;

const SectionContent = styled.div`
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  max-height: ${props => props.collapsed ? '0' : '200px'};
  padding: ${props => props.collapsed ? '0' : '10px 0'};
`;

const SectionTitle = styled.h3`
  color: #333;
  font-size: 18px;
  margin: 0;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background-color: ${props => props.variant === 'danger' ? '#dc3545' : props.variant === 'warning' ? '#ffc107' : '#28a745'};
  color: ${props => props.variant === 'warning' ? '#000' : '#fff'};
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
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

const SectionSubtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 15px 0;
  font-style: italic;
`;

const SectionDescription = styled.p`
  color: #555;
  font-size: 14px;
  margin: 5px 0;
  line-height: 1.4;
`;

const SectionInfo = styled.div`
  margin-bottom: 10px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
  font-style: italic;
`;

const NoSectionsMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
  background-color: #f8f9fa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  
  h3 {
    color: #666;
    margin-bottom: 10px;
  }
  
  p {
    margin: 5px 0;
  }
`;

const PaginaCurso = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  
  const [cursoActual, setCursoActual] = useState({
    id: null,
    nombre: "nombreCurso",
    codigo: "codigoCurso"
  });
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSecciones, setLoadingSecciones] = useState(true);
  const [seccionesColapsadas, setSeccionesColapsadas] = useState({});
  useEffect(() => {
    if (secciones.length > 0) {
      const colapsadas = {};
      secciones.forEach(s => { colapsadas[s.id] = true; });
      setSeccionesColapsadas(colapsadas);
    }
  }, [secciones]);

  useEffect(() => {
    const obtenerCurso = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("no hay token");
          return;
        }
        
        console.log("Buscando curso con código:", codigo);
        console.log("URL de búsqueda:", `${urlBase}/cursos/buscar?texto=${codigo}`);
        
        const response = await axios.get(`${urlBase}/cursos/buscar?texto=${codigo}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Respuesta de búsqueda:", response.data);
        
        const cursoEncontrado = Array.isArray(response.data) ? response.data[0] : response.data;
        
        if (cursoEncontrado) {
          console.log("Curso encontrado:", cursoEncontrado);
          setCursoActual({
            id: cursoEncontrado.id,
            nombre: cursoEncontrado.nombre || "Curso sin nombre",
            codigo: cursoEncontrado.codigo || "Sin código",
            ...cursoEncontrado
          });
        } else {
          console.log("No se encontró curso con código:", codigo);
          setCursoActual({
            id: null,
            nombre: "Curso no encontrado",
            codigo: codigo
          });
        }
        
      } catch (error) {
        console.error("Error al buscar curso:", error);
        setCursoActual({
          id: null,
          nombre: "Error al cargar",
          codigo: "---"
        });
      } finally {
        setLoading(false);
      }
    };
    // HAY QUE HACER UN ENDPOINT QUE DE SECCIONES DE UN CURSO POR CODIGO
    const obtenerSecciones = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        if (!token) {
          return;
        }
        
        const response = await axios.get(`${urlBase}/secciones`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        
        const seccionesFiltradas = response.data.filter(seccion => 
          seccion.codigoCurso === codigo
        );
        
        console.log("Secciones filtradas para el curso", codigo, ":", seccionesFiltradas);
        setSecciones(seccionesFiltradas);
        
      } catch (error) {
        console.error("Error al obtener secciones:", error);
        setSecciones([]);
      } finally {
        setLoadingSecciones(false);
      }
    };

    if (codigo) {
      obtenerCurso();
      obtenerSecciones();
    }
  }, [codigo]);

  const indiceItems = [
    "secciones",
  ];

  const irAltaSeccion = () => {
    navigate(`/curso/${codigo}/alta-seccion`);
  };

  const verParticipantes = () => {
    navigate(`/curso/${codigo}/participantes`, {
      state: { cursoActual }
    });
  };
  const agregarTarea = (seccionId) => {
    navigate(`/curso/${codigo}/${seccionId}/crear-tarea`, {
      state: { cursoActual }
    });
  }
  const agregarForo = (seccionId) => {
    navigate(`/curso/${codigo}/${seccionId}/crear-foro`, {
      state: { cursoActual }
    });
  }

  const agregarPagina = (seccionId) => {
    navigate(`/curso/${codigo}/${seccionId}/crear-pagina`);
  }

  const agregarRecursos = (seccionId) => {
  };

  const modificarSeccion = (seccionId) => {
  };

  const eliminarSeccion = (seccionId) => {
  };
  
  const toggleSeccion = (seccionId) => {
    setSeccionesColapsadas(prev => ({
      ...prev,
      [seccionId]: !prev[seccionId]
    }));
  };
  
  const irSubirMaterial = (seccionId) => {
    navigate(`/curso/${codigo}/${seccionId}/subir-material`);
  };

  return (
    <Container>
      <Sidebar>
        <CourseTitle>
          {cursoActual.nombre}
        </CourseTitle>
        
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
          Código: {cursoActual.codigo}
        </div>
        
        <ParticipantsButton onClick={verParticipantes}>
          Participantes
        </ParticipantsButton>
        
        <IndexSection>
          <IndexTitle>Indice del Curso</IndexTitle>
          <IndexList>
            {secciones.length > 0 ? (
              secciones.map((seccion, idx) => (
                <IndexItem
                  key={seccion.id}
                  style={{ cursor: 'pointer', color: '#4C241D' }}
                  onClick={() => toggleSeccion(seccion.id)}
                >
                  {seccion.titulo || `Sección ${idx + 1}`}
                </IndexItem>
              ))
            ) : (
              <IndexItem style={{ color: '#999' }}>Sin secciones</IndexItem>
            )}
          </IndexList>
        </IndexSection>
      </Sidebar>
      
      <MainContent>
        <CourseInfoHeader>
          <CourseInfoGrid>
            <InfoSection>
              <InfoLabel>Nombre del Curso</InfoLabel>
              <InfoValue>{cursoActual.nombre}</InfoValue>
            </InfoSection>
            
            <InfoSection>
              <InfoLabel>Profesores</InfoLabel>
              <InfoValue>{cursoActual.profesores || "Sin profesores"}</InfoValue>
            </InfoSection>
            
            <InfoSection>
              <InfoLabel>Turno</InfoLabel>
              <InfoValue>{cursoActual.turno || "Sin turno"}</InfoValue>
            </InfoSection>
          </CourseInfoGrid>
        </CourseInfoHeader>
        
        <AddSectionButton onClick={() => irAltaSeccion()}>
          + Agregar Sección
        </AddSectionButton>
        
        <SectionsContainer>
          {loadingSecciones ? (
            <LoadingMessage>
              Cargando secciones...
            </LoadingMessage>
          ) : secciones.length > 0 ? (
            secciones.map((seccion) => {
              const collapsed = seccionesColapsadas[seccion.id] ?? true;
              return (
                <SectionPlaceholder key={seccion.id}>
                  <SectionHeader 
                    collapsed={collapsed}
                    onClick={() => toggleSeccion(seccion.id)}
                  >
                    <SectionTitleContainer>
                      <CollapseIcon collapsed={collapsed}>
                        ▼
                      </CollapseIcon>
                      <SectionTitle>{seccion.titulo || `Sección ${seccion.id}`}</SectionTitle>
                    </SectionTitleContainer>
                  </SectionHeader>
                  <ButtonGroup style={{ marginBottom: '10px' }}>
                    <ActionButton 
                      variant="success" 
                      onClick={(e) => {
                        e.stopPropagation();
                        agregarRecursos(seccion.id);
                      }}
                    >
                      Recursos
                    </ActionButton>
                    <ActionButton 
                      variant="success" 
                      onClick={(e) => {
                        e.stopPropagation();
                        agregarTarea(seccion.id);
                      }}
                    >
                      Agregar Tarea
                    </ActionButton>
                    <ActionButton 
                      variant="info" 
                      onClick={(e) => {
                        e.stopPropagation();
                        irSubirMaterial(seccion.id);
                      }}
                    >
                      Subir Material
                    </ActionButton>
                    <ActionButton 
                      variant="success" 
                      onClick={(e) => {
                        e.stopPropagation();
                        agregarForo(seccion.id);
                      }}
                    >
                      Agregar Foro
                    </ActionButton>
                    <ActionButton 
                      variant="success" 
                      onClick={(e) => {
                        e.stopPropagation();
                        agregarPagina(seccion.id);
                      }}
                    >
                      Agregar Pagina
                    </ActionButton>
                    <ActionButton 
                      variant="warning" 
                      onClick={(e) => {
                        e.stopPropagation();
                        modificarSeccion(seccion.id);
                      }}
                    >
                      Modificar
                    </ActionButton>
                    <ActionButton 
                      variant="danger" 
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarSeccion(seccion.id);
                      }}
                    >
                      Eliminar
                    </ActionButton>
                  </ButtonGroup>
                  <SectionContent collapsed={collapsed}>
                    <SectionInfo>
                      <SectionDescription>
                        <strong>Recursos:</strong> {seccion.recursos?.length || 0} archivo(s)
                      </SectionDescription>
                    </SectionInfo>
                  </SectionContent>
                </SectionPlaceholder>
              );
            })
          ) : (
            <NoSectionsMessage>
              <h3>No hay secciones creadas</h3>
              <p>Aún no se han creado secciones para este curso.</p>
              <p>Utiliza el botón "Agregar Sección" para crear la primera sección.</p>
            </NoSectionsMessage>
          )}
        </SectionsContainer>

      </MainContent>
    </Container>
  )
}

export default PaginaCurso
