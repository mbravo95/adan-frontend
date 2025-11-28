import { Outlet, Navigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ModalConfirmacion from "../general/ModalConfirmacion";
import Spinner from "../general/Spinner";

const HomeCurso = () => {
  const rol = localStorage.getItem("tipo");
  const navigate = useNavigate();
  
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setCursosFiltrados(response.data || []);
        
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

  const filtrarCursos = async () => {
    if(busqueda === ""){
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
      setCursosFiltrados(cursos.filter(curso => cursosRetornados.some(cursoRet => cursoRet.id === curso.id))); 
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

  const irCrearCurso = () => {
    navigate('/crear-curso');
  };

  const irEditarCurso = (curso) => {
    console.log("Ir a editar curso", curso);
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
    return <Navigate to="/home" />;
  }

  const handleAbrirModal = (id) => {
      setCursoSeleccionado(id);
      setIsModalOpen(true);
    };
  
    const handleCancelar = () => {
      setIsModalOpen(false);
      setCursoSeleccionado(null);
    };
  
    const handleBorrarPagina = async () => {
      if (!cursoSeleccionado) return;
  
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
        const response = await axios.put(`${urlBase}/cursos/eliminar/${cursoSeleccionado}`, null, config);
        console.log(response);
        toast.success("Curso eliminado exitosamente", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setCursos(cursos.filter(curso => curso.id !== cursoSeleccionado));
        setCursosFiltrados(cursosFiltrados.filter(curso => curso.id !== cursoSeleccionado));
        handleCancelar();
      } catch (error) {
        console.error("Error al eliminar el curso:", error);
        toast.error("Ocurrió un error al eliminar el curso", {
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
        setIsModalOpen(false);
      }
    }

    const formatearListaProfesores = (profesores, maxLength = 33) => {
      const nombresCompletos = profesores
        .map(p => `${p.nombres} ${p.apellidos}`)
        .join(', ');

      if (nombresCompletos.length > maxLength) {
        return nombresCompletos.substring(0, maxLength) + "...";
      }

      return nombresCompletos;
    };


  return (
    <Container>
      <ContentWrapper>
        <ModalConfirmacion
          isOpen={isModalOpen}
          message={`¿Estás seguro de que quieres eliminar este curso?`}
          onConfirm={handleBorrarPagina}
          onCancel={handleCancelar}
          isLoading={loading}
        />

        {/* Controles de búsqueda */}
        <SearchControls>
          <FilterInput 
            placeholder="Buscar cursos..." 
            onChange={(e) => setBusqueda(e.target.value)} 
            value={busqueda}
            onKeyDown={(e) => e.key === 'Enter' && filtrarCursos()}
          />
          <SearchButton onClick={filtrarCursos}> 
            <SearchIconSVG /> Buscar
          </SearchButton>
          <ResetButton onClick={resetearBusqueda}>
            <ResetIconSVG /> Restablecer resultados
          </ResetButton>
        </SearchControls>
        
        {loading && <Spinner />}
        
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
        
        {!loading && !error && (
          <>
            {cursosFiltrados.length > 0 ? (
              <CoursesGrid>
                {cursosFiltrados.map((curso) => (
                  <CourseCard key={curso.id}>
                    <CourseTitle>{curso.nombre || "Curso sin nombre"}</CourseTitle>
                    <CourseDescription>
                      {curso.descripcion || "Sin descripción disponible"}
                    </CourseDescription>
                    <CourseDetails>
                      <DetailRow>
                        <DetailLabel>Código:</DetailLabel>
                        <DetailValue>{curso.codigo || "No disponible"}</DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Turno:</DetailLabel>
                        <DetailValue>{curso.turno || "No disponible"}</DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Año:</DetailLabel>
                        <DetailValue>{curso.anio || "No disponible"}</DetailValue>
                      </DetailRow>
                      <DetailRow>
                        <DetailLabel>Profesores:</DetailLabel>
                        <DetailValue>{curso.profesores.length > 0 ? formatearListaProfesores(curso.profesores) : 'Sin profesor asignado'}</DetailValue>
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
                      <DeleteButton onClick={() => handleAbrirModal(curso.id)}>
                        Eliminar
                      </DeleteButton>
                    </CourseActions>
                  </CourseCard>
                ))}
              </CoursesGrid>
            ) : (
              <NoResultsMessage>
                No se encontraron cursos que coincidan con la búsqueda
              </NoResultsMessage>
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



const Container = styled.div`
  background-color: #9DCBD7;
  min-height: 100vh;
  width: 100%;
  margin-top: 70px;
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

const SearchControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
  max-width: 900px;
  margin-bottom: 40px;
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

const ErrorMessage = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
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
  margin-bottom: 30px;
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
  background-color: #a0aec0;
  color: white;

  &:hover {
    background-color: #8c99a9ff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #d72d3eff;
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
  background-color: #746a65ff;
  color: white;
  
  &:hover {
    background-color: #59524dff;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const DesasignarDocenteButton = styled(Button)`
  background-color: #746a65ff;
  color: white;
  
  &:hover {
    background-color: #59524dff;
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