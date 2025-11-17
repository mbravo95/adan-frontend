import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import Spinner from '../general/Spinner';


const ListadoCursos = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  const rol = localStorage.getItem("tipo");
  const navigate = useNavigate();
  const { profile } = useAuth();

  const toggleFilter = () => {
    setIsButtonActive(false);
    setIsFilterVisible(prev => !prev);
  };

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${urlBase}/cursos`, config);
        const tipo = localStorage.getItem("tipo");
        if(tipo == "USUARIO"){
          if(profile.id) {
            const filtrados = response.data.filter(curso => curso.profesores.some(cursoProfesor => cursoProfesor.id == profile.id) || curso.estudiantes.some(cursoEstudiante => cursoEstudiante.id == profile.id));
            setCursos(filtrados);
            setCursosFiltrados(filtrados); 
          }
        } else {
          setCursos(response.data);
          setCursosFiltrados(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    cargarCursos();
  }, [profile]);


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
      setLoading(true);
      const response = await axios.get(`${urlBase}/cursos/buscar?texto=${texto}`, config);
      const cursosRetornados = response.data;
      setCursosFiltrados(cursos.filter(curso => cursosRetornados.some(cursoRet => cursoRet.id == curso.id))); 
    } catch (error) {
      console.log(error);
      setCursosFiltrados([]);
    } finally {
      setLoading(false);
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

  const rolEnCurso = (curso) => {
    const tipo = localStorage.getItem("tipo");

    if(tipo == "USUARIO"){
      if(curso.profesores.some(cursoProfesor => cursoProfesor.id == profile.id))
        return "PROFESOR";
      else
      return "ESTUDIANTE";
    } else {
      return "SIN ROL"
    }
  }


  return (
    <>
      <PageContainer>
      <ContentWrapper>
        <PrimaryControls>
          { rol != "ADMINISTRADOR" &&
            <PrimaryButton onClick={() => mostrarMisCursos()} $isactive={isButtonActive}>Mis cursos</PrimaryButton>
          }
          <PrimarySearchButton onClick={toggleFilter} $isactive={isFilterVisible}>
            {isFilterVisible ? <SearchIconSVGBlanco /> : <SearchIconSVGNegro />}
            Buscar curso
          </PrimarySearchButton>
        </PrimaryControls>
        <FilterWrapper $isvisible={isFilterVisible}>
          <SecondaryControls>
            <FilterInputWrapper>
              <FilterInput placeholder="Filtrar cursos..." onChange={(e) => setBusqueda(e.target.value)} value={busqueda} />
            </FilterInputWrapper>
            <SearchButton onClick={() => filtrarCursos()}> 
              <SearchIconSVGBlanco /> Buscar
            </SearchButton>
            <ResetButton onClick={() => resetearBusqueda()}>
              <ResetIconSVG /> Restablecer resultados
            </ResetButton>
          </SecondaryControls>
        </FilterWrapper>
        {loading && <Spinner />}
        {!loading && 
          <CourseList>
            {cursosFiltrados.length > 0 && cursosFiltrados.map((curso, index) => (
              <CourseCard key={index} onClick={() => irAlCurso(curso.codigo)}>
                
                <Avatar style={{ backgroundColor: colores[index % colores.length] }}>
                  <img src="/header/avatar.png" alt="avatar" />
                </Avatar>

                <Details>
                  <CourseName>{curso.nombre} <CourseCode>{curso.codigo}</CourseCode></CourseName>
                  <CourseMeta>{curso.turno} {curso.anio}</CourseMeta>
                  <CourseMeta>{curso.profesores.length > 0 ? formatearListaProfesores(curso.profesores) : 'Sin profesor asignado'}</CourseMeta>
                  <CourseMeta>{rolEnCurso(curso)}</CourseMeta>
                </Details>
              </CourseCard>
            ))}
            { cursosFiltrados.length == 0 && 
                <NoResultsMessage>
                  No se encontraron cursos que coincidan con la búsqueda
                </NoResultsMessage>
            }
          </CourseList>
        }
      </ContentWrapper>
    </PageContainer>
    </>
  )
}

export default ListadoCursos;


const LightBlueBackground = '#9DCBD7';
const CardBackground = '#f4f4f4';
const DarkBackground = '#2a2a2a';

const colores = [
  "#74B8FF", // Azul
  "#FD79A8", // Rosado
  "#A19BFD", // Violeta
  "#00B894", // Verde
  "#FDCA6E", // Amarillo
  "#80ECEC", // Celeste
  "#F7634D"  // Rojo
];

const colorRandom = () => {
  return colores[Math.floor(Math.random() * colores.length)];
};

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
  width: 100%;
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

  svg {
    width: 1em;
    height: 1em;
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
  border-radius: 8px;
  flex-grow: 1; 
  max-width: 450px;
`;

const FilterInput = styled.input`
  flex-grow: 1;
  min-width: 250px;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: ${CardBackground};
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

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
  padding-bottom: 30px;
`;

const CourseCard = styled.div`
  display: flex;
  align-items: center;
  background-color: ${CardBackground};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  cursor: pointer;
  gap: 15px;
  /*align-items: stretch;*/
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Avatar = styled.div`
  
  height: 100%; 
  max-height: 8em;
  aspect-ratio: 1 / 1;

  /*width: 80px;*/
  
  border-radius: 12px;
  overflow: hidden; /* asegura que la imagen no se salga */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* evita que se achique */

  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
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

const SearchIconSVGBlanco = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.2 42L26.6 29.4C25.6 30.2 24.45 30.8333 23.15 31.3C21.85 31.7667 20.4667 32 19 32C15.3667 32 12.2917 30.7417 9.775 28.225C7.25833 25.7083 6 22.6333 6 19C6 15.3667 7.25833 12.2917 9.775 9.775C12.2917 7.25833 15.3667 6 19 6C22.6333 6 25.7083 7.25833 28.225 9.775C30.7417 12.2917 32 15.3667 32 19C32 20.4667 31.7667 21.85 31.3 23.15C30.8333 24.45 30.2 25.6 29.4 26.6L42 39.2L39.2 42ZM19 28C21.5 28 23.625 27.125 25.375 25.375C27.125 23.625 28 21.5 28 19C28 16.5 27.125 14.375 25.375 12.625C23.625 10.875 21.5 10 19 10C16.5 10 14.375 10.875 12.625 12.625C10.875 14.375 10 16.5 10 19C10 21.5 10.875 23.625 12.625 25.375C14.375 27.125 16.5 28 19 28Z" fill="white"/>
    </svg>
);

const SearchIconSVGNegro = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.2 42L26.6 29.4C25.6 30.2 24.45 30.8333 23.15 31.3C21.85 31.7667 20.4667 32 19 32C15.3667 32 12.2917 30.7417 9.775 28.225C7.25833 25.7083 6 22.6333 6 19C6 15.3667 7.25833 12.2917 9.775 9.775C12.2917 7.25833 15.3667 6 19 6C22.6333 6 25.7083 7.25833 28.225 9.775C30.7417 12.2917 32 15.3667 32 19C32 20.4667 31.7667 21.85 31.3 23.15C30.8333 24.45 30.2 25.6 29.4 26.6L42 39.2L39.2 42ZM19 28C21.5 28 23.625 27.125 25.375 25.375C27.125 23.625 28 21.5 28 19C28 16.5 27.125 14.375 25.375 12.625C23.625 10.875 21.5 10 19 10C16.5 10 14.375 10.875 12.625 12.625C10.875 14.375 10 16.5 10 19C10 21.5 10.875 23.625 12.625 25.375C14.375 27.125 16.5 28 19 28Z" fill="black"/>
    </svg>
);

const ResetIconSVG = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M46 8.00015V20.0002M46 20.0002H34M46 20.0002L36.72 11.2802C34.5705 9.12958 31.9113 7.55856 28.9904 6.7137C26.0695 5.86883 22.9822 5.77765 20.0166 6.44867C17.0509 7.11968 14.3036 8.53102 12.0309 10.551C9.75827 12.571 8.03434 15.1337 7.02 18.0002M2 40.0002V28.0002M2 28.0002H14M2 28.0002L11.28 36.7202C13.4295 38.8707 16.0887 40.4417 19.0096 41.2866C21.9305 42.1315 25.0178 42.2226 27.9834 41.5516C30.9491 40.8806 33.6964 39.4693 35.9691 37.4493C38.2417 35.4293 39.9657 32.8666 40.98 30.0002" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);