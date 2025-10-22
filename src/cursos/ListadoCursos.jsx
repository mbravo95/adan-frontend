import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from "react";
import axios from "axios";

// =======================================================
// ESTILOS DE LA ESTRUCTURA Y CONTROLES
// =======================================================

const LightBlueBackground = '#a7d9ed';
const CardBackground = '#f4f4f4';
const DarkBackground = '#2a2a2a';


// Definición de la animación para desplegar/contraer
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FilterWrapper = styled.div`
  /* Ocultar/Mostrar con altura dinámica para la transición */
  max-height: ${props => (props.isVisible ? '100px' : '0')}; 
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  
  /* Animación de entrada suave si es visible */
  ${props => props.isVisible && css`
    animation: ${fadeIn} 0.3s ease-out;
  `}
`;

// --------------------------------------------------
// ESTILOS DE LA PÁGINA Y CONTROLES
// --------------------------------------------------

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${LightBlueBackground};
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

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
  background-color: ${CardBackground};
  color: #333;
`;

const PrimarySearchButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${DarkBackground};
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  gap: 10px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #404040;
  }
`;

const SearchIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const SecondaryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FilterInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  padding: 12px 15px;
  border-radius: 8px;
  flex-grow: 1; 
  max-width: 450px;
`;

const FilterInput = styled.input`
  background: none;
  border: none;
  color: #333;
  font-size: 1.1em;
  width: 100%;
  
  &::placeholder {
    color: #666;
  }
  &:focus {
    outline: none;
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

// =======================================================
// ESTILOS DE LA LISTA Y TARJETAS (MODIFICADAS)
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

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleFilter = () => {
    setIsFilterVisible(prev => !prev);
  };

  useEffect(() => {
    const cargarCursos = async () => {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${urlBase}/cursos/buscar?texto=`, config);
      console.log(response);
    };

    cargarCursos();
  }, []);

  const cursos = [
    { name: 'Curso 2', code: 'C002', turn: 'Matutino 2025', professor: 'Nombre Profesor' },
    { name: 'Curso 6', code: 'C006', turn: 'Matutino 2025', professor: 'Nombre Profesor' }
  ];


  return (
    <>
      <PageContainer>
      <ContentWrapper>
        
        {/* FILA 1: Botón "Mis cursos" y Buscador Principal (AHORA UN BOTÓN) */}
        <PrimaryControls>
          <PrimaryButton>Mis cursos</PrimaryButton>
          <PrimarySearchButton onClick={toggleFilter}>
            <SearchIcon src="/search/lupa_white.png" alt="Buscar" />
            Buscar curso
          </PrimarySearchButton>
        </PrimaryControls>
        <FilterWrapper isVisible={isFilterVisible}>
          <SecondaryControls>
            <FilterInputWrapper>
              <SearchIcon src="/search/lupa_black.png" alt="Filtro" />
              <FilterInput placeholder="Filtrar cursos..." />
            </FilterInputWrapper>
            <SearchButton>Buscar</SearchButton>
            <ResetButton>Restablecer resultados</ResetButton>
          </SecondaryControls>
        </FilterWrapper>
        <CourseList>
          {cursos.map((curso, index) => (
            <CourseCard key={index}>
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