import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const LightBlueBackground = '#a7d9ed';
const CardBackground = '#f4f4f4';
const DarkBackground = '#2a2a2a';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FilterWrapper = styled.div`
  max-height: ${props => (props.$isvisible ? '100px' : '0')}; 
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
  opacity: ${props => (props.$isvisible ? '1' : '0')};
  

  ${props => props.$isvisible && css`
    animation: ${fadeIn} 0.3s ease-out;
  `}
`;

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: ${LightBlueBackground};
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  padding: 0;
`;

const ContentWrapper = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 40px 0 40px;
  box-sizing: border-box;
`;

const PrimaryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
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

  ${props => props.$isactive && css`
    background-color: ${DarkBackground};
    color: white;
  `}
`;

const PrimarySearchButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${CardBackground};
  color: black;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  gap: 10px;
  transition: background-color 0.2s;

  ${props => props.$isactive && css`
    background-color: ${DarkBackground};
    color: white;
  `}
  
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

const NoResultsMessage = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  color: #555;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  margin-top: 20px;
`;


const ListadoCursos = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const rol = localStorage.getItem("tipo");
  const navigate = useNavigate();

  const toggleFilter = () => {
    setIsButtonActive(false);
    setIsFilterVisible(prev => !prev);
  };

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${urlBase}/cursos`, config);
        setCursos(response.data);
        setCursosFiltrados(response.data); 
      } catch (error) {
        console.log(error);
      }
    };

    cargarCursos();
  }, []);


  const filtrarCursos = async () => {
    if(busqueda == ""){
      setCursosFiltrados(cursos);
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
      const response = await axios.get(`${urlBase}/cursos/buscar?texto=${texto}`, config);
      setCursosFiltrados(response.data); 
    } catch (error) {
      console.log(error);
      setCursosFiltrados([]);
    }
  }

  const resetearBusqueda = () => {
    setBusqueda("");
    setCursosFiltrados(cursos);
  }

  const mostrarMisCursos = () => {
    setBusqueda("");
    setCursosFiltrados(cursos);
    setIsFilterVisible(false);
    setIsButtonActive(true);
  }

  const irAlCurso = (codigo) =>{
    navigate(`/curso/${codigo}`);
  }

  const formatearListaProfesores = (profesores) => {
    const nombresCompletos = profesores.map(profesor => {
        return `${profesor.nombres} ${profesor.apellidos}`;
    });
    return nombresCompletos.join(', ');
};


  return (
    <>
      <PageContainer>
      <ContentWrapper>
        <PrimaryControls>
          { rol != "ADMINISTRADOR" &&
            <PrimaryButton onClick={() => mostrarMisCursos()} $isactive={isButtonActive}>Mis cursos</PrimaryButton>
          }
          <PrimarySearchButton onClick={toggleFilter} $isactive={isFilterVisible}>
            <SearchIcon src={isFilterVisible ? "/search/lupa_white.png" : "/search/lupa_black.png"} alt="Buscar" />
            Buscar curso
          </PrimarySearchButton>
        </PrimaryControls>
        <FilterWrapper $isvisible={isFilterVisible}>
          <SecondaryControls>
            <FilterInputWrapper>
              <SearchIcon src="/search/lupa_black.png" alt="Filtro" />
              <FilterInput placeholder="Filtrar cursos..." onChange={(e) => setBusqueda(e.target.value)} value={busqueda} />
            </FilterInputWrapper>
            <SearchButton onClick={() => filtrarCursos()}>Buscar</SearchButton>
            <ResetButton onClick={() => resetearBusqueda()}>Restablecer resultados</ResetButton>
          </SecondaryControls>
        </FilterWrapper>
        <CourseList>
          {cursosFiltrados.length > 0 && cursosFiltrados.map((curso, index) => (
            <CourseCard key={index} onClick={() => irAlCurso(curso.codigo)}>
              <Details>
                <CourseName>{curso.nombre} <CourseCode>{curso.codigo}</CourseCode></CourseName>
                <CourseMeta>{curso.turno}</CourseMeta>
                <CourseMeta>{curso.profesores.length > 0 ? formatearListaProfesores(curso.profesores) : 'Sin profesor asignado'}</CourseMeta>
              </Details>
            </CourseCard>
          ))}
          { cursosFiltrados.length == 0 && 
              <NoResultsMessage>
                No se encontraron cursos que coincidan con la búsqueda
              </NoResultsMessage>
          }
        </CourseList>
      </ContentWrapper>
    </PageContainer>
    </>
  )
}

export default ListadoCursos