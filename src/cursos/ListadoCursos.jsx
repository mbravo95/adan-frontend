import styled from "styled-components";

const LightBlueBackground = '#a7d9ed'; // Color de fondo uniforme del cuerpo
const CardBackground = '#f4f4f4'; // Fondo claro para las tarjetas y botones inactivos
const DarkBackground = '#2a2a2a'; // Fondo oscuro para el buscador y botones primarios

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${LightBlueBackground};
  display: flex;
  justify-content: center;
  padding: 40px 0; /* Padding vertical para centrar un poco el contenido */
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px; /* Ancho máximo para el contenido de la aplicación */
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// --- CONTROLES DE NAVEGACIÓN (Fila 1) ---

const PrimaryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PrimaryButton = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  
  /* Estilo Activo (Mis cursos) */
  background-color: ${props => (props.active ? CardBackground : 'transparent')};
  color: #333;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${DarkBackground};
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  flex-grow: 0.5; /* Ocupa más espacio que un botón normal */
  max-width: 350px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: white;
  font-size: 1.1em;
  width: 100%;
  
  &::placeholder {
    color: #ccc;
  }
  &:focus {
    outline: none;
  }
`;

// --- CONTROLES DE FILTRO (Fila 2) ---

const SecondaryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FilterInputWrapper = styled(SearchInputWrapper)`
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  flex-grow: 1; /* Ocupa más espacio que los botones */
  max-width: 450px;
  padding: 12px 15px;
`;

const FilterInput = styled(SearchInput)`
  color: #333;
  &::placeholder {
    color: #666;
  }
`;

const SearchButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  background-color: ${DarkBackground};
  color: white;
`;

const ResetButton = styled(SearchButton)`
  background-color: ${DarkBackground};
  min-width: 150px;
`;

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  /* Si los iconos son negros y necesitas que se vean blancos en fondo oscuro: */
  filter: ${props => (props.isDark ? 'none' : 'invert(100%)')};
`;

// =======================================================
// ESTILOS DE LA LISTA Y TARJETAS (Cards)
// =======================================================

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
`;

const CourseCard = styled.div`
  display: flex;
  align-items: center;
  background-color: ${CardBackground};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: ${props => props.color}; /* Color dinámico de la tarjeta */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

const IconImage = styled.img`
  /* Ajustar el logo del curso para que se vea bien en el contenedor */
  height: 60px;
  width: 60px;
  /* El logo debe tener el gorro de graduación como se ve en la imagen */
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const CourseName = styled.h3`
  font-size: 1.3em;
  font-weight: bold;
  color: #333;
  margin: 0 0 5px 0;
`;

const CourseCode = styled.span`
  font-size: 0.9em;
  font-weight: normal;
  color: #666;
  margin-left: 10px;
`;

const CourseMeta = styled.p`
  font-size: 1em;
  color: #555;
  margin: 2px 0;
`;

const ListadoCursos = () => {

  const cursos = [
    { name: 'Curso 2', code: 'C002', turn: 'Matutino 2025', professor: 'Nombre Profesor', icon: '/header/logo_1.png', color: '#ff7f9d' }, // Rosa
    { name: 'Curso 6', code: 'C006', turn: 'Matutino 2025', professor: 'Nombre Profesor', icon: '/header/logo_1.png', color: '#90f3e6' }, // Aguamarina/Menta
  ];

  
  return (
    <>
      <PageContainer>
        <ContentWrapper>
          <PrimaryControls>
            <PrimaryButton active>Mis cursos</PrimaryButton>
            <SearchInputWrapper>
              <SearchIcon src="/search/lupa_black.png" alt="Buscar" />
              <SearchInput placeholder="Buscar curso" />
            </SearchInputWrapper>
          </PrimaryControls>
          <SecondaryControls>
            <FilterInputWrapper>
              <SearchIcon src="/search/lupa_white.png" alt="Filtro" />
              <FilterInput placeholder="Filtrar cursos..." />
            </FilterInputWrapper>
            <SearchButton>Buscar</SearchButton>
            <ResetButton>Restablecer resultados</ResetButton>
          </SecondaryControls>
          <CourseList>
            {cursos.map((curso, index) => (
              <CourseCard key={index}>
                <IconContainer color={curso.color}>
                  <IconImage src={curso.icon} alt="Icono Curso" />
                </IconContainer>
                <Details>
                  <CourseName>{curso.name} <CourseCode>{curso.code}</CourseCode></CourseName>
                  <CourseMeta>{curso.turn}</CourseMeta>
                  <CourseMeta>{curso.professor}</CourseMeta>
                </Details>
              </CourseCard>
            ))}
          </CourseList>

        </ContentWrapper>
      </PageContainer>
    </>
  )
}

export default ListadoCursos