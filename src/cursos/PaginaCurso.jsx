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
  margin-bottom: 15px;
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

const PlaceholderContent = styled.div`
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
`;

const PaginaCurso = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  
  const [cursoActual, setCursoActual] = useState({
    id: null,
    nombre: "nombreCurso",
    codigo: "codigoCurso"
  });
  const [loading, setLoading] = useState(true);

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

    if (codigo) {
      obtenerCurso();
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

  const agregarRecursos = (seccionId) => {
  };

  const modificarSeccion = (seccionId) => {
  };

  const eliminarSeccion = (seccionId) => {
  };
  
//SOLO PARA DEBUG, DESPUES SE BORRA
  const irSubirMaterial = () => {
    navigate(`/curso/${codigo}/subir-material`);
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
            {indiceItems.map((item, index) => (
              <IndexItem key={index}>
                {item}
              </IndexItem>
            ))}
          </IndexList>
        </IndexSection>
        
        <UploadMaterialButton onClick={() => irSubirMaterial()}>
          DEBUG--Subir Material
        </UploadMaterialButton>
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
          <SectionPlaceholder>
            <SectionHeader>
              <div>
                <SectionTitle>Sección placeholder</SectionTitle>
                
              </div>
              <ButtonGroup>
                <ActionButton 
                  variant="success" 
                  onClick={() => agregarRecursos(1)}
                >
                  Agregar Material
                </ActionButton>
                <ActionButton 
                  variant="warning" 
                  onClick={() => modificarSeccion(1)}
                >
                  Modificar seccion
                </ActionButton>
                <ActionButton 
                  variant="danger" 
                  onClick={() => eliminarSeccion(1)}
                >
                  Eliminar
                </ActionButton>
              </ButtonGroup>
            </SectionHeader>
          </SectionPlaceholder>
        </SectionsContainer>

      </MainContent>
    </Container>
  )
}

export default PaginaCurso
