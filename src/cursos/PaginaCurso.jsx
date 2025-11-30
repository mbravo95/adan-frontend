import { useParams, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ModalConfirmacion from "../general/ModalConfirmacion";
import Spinner from "../general/Spinner";
import useCursoData from "../hooks/useCursoData"; 
import Secciones from "./Secciones";
import * as S from "./EstilosPaginaCurso";
import { Sidebar } from "./EstilosPaginaCurso";
import { CourseTitle } from "./EstilosPaginaCurso";
import { ParticipantsButton } from "./EstilosPaginaCurso";
import { esUsuarioRegular, esProfesorCurso, puedeAdministrarCursos } from '../utils/permisoCursos';
import {
  IndexSection,
  IndexTitle,
  IndexList,
  IndexItem,
  MainContent,
  CourseInfoHeader,
  CourseImageContainer,
  CourseInfoGrid,
  InfoSection,
  InfoLabel,
  InfoValue,
  AddSectionButton,
  UploadMaterialButton,
  SectionsContainer,
  SectionPlaceholder,
  SectionHeader,
  SectionTitleContainer,
  RightIconContainer,
  CollapseIcon,
  SectionContent,
  SectionTitle,
  ButtonGroup,
  ActionButton,
  SectionSubtitle,
  SectionDescription,
  SectionInfo,
  LoadingMessage,
  NoSectionsMessage,
  Recurso,
  RecursoContainer,
    RecursoActions
} from "./EstilosPaginaCurso";

const PaginaCurso = () => {
  const location = useLocation();
  console.log('[PERMISO] puedeAdministrarCursos:', puedeAdministrarCursos(location.pathname), 'pathname:', location.pathname);
  const handleDescargarMaterial = async (codigo, seccionId, recurso) => {
    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/recursos/cursos/${codigo}/secciones/${seccionId}/materiales/${recurso.id}/descargar`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al descargar el archivo");
      const blob = await response.blob();
      let filename = "material";
      //CORS no expone disposition por defecto, hay que hacer que lo exponga en el back o buscar otra solucion para el nombre del archivo
      //en swagger si se ve pero igual
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
      } else if (recurso.nombre && recurso.nombre !== null) {
        filename = recurso.nombre;
      } else if (recurso.urlMaterial) {
        const parts = recurso.urlMaterial.split(/[/\\]/);
        filename = parts[parts.length-1];
      }
      saveAs(blob, filename);
    } catch (err) {
      toast.error("Error al descargar el archivo");
    }
  };
  const { codigo } = useParams();
  const navigate = useNavigate();
  
  const [cursoActual, setCursoActual] = useState({
    id: null,
    nombre: "nombreCurso",
    codigo: "codigoCurso"
  });
  const [secciones, setSecciones] = useState([]);
  const [recursosPorSeccion, setRecursosPorSeccion] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSecciones, setLoadingSecciones] = useState(true);
  const [seccionesColapsadas, setSeccionesColapsadas] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paginaEliminarId, setPaginaEliminarId] = useState(null);
  const [seccionEliminarId, setSeccionEliminarId] = useState(null);
  

  useEffect(() => {
    if (secciones.length > 0) {
      const colapsadas = {};
      secciones.forEach(s => { colapsadas[s.id] = true; });
      setSeccionesColapsadas(colapsadas);
    }
  }, [secciones]);

  useEffect(() => {
    const obtenerRecursosDeSeccion = async (id) => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${urlBase}/secciones/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setRecursosPorSeccion(prev => ({ ...prev, [id]: response.data.recursos || [] }));
      } catch (error) {
        setRecursosPorSeccion(prev => ({ ...prev, [id]: [] }));
      }
    };

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
        
        setSecciones(seccionesFiltradas);
        seccionesFiltradas.forEach(seccion => {
          obtenerRecursosDeSeccion(seccion.id);
        });
        
      } catch (error) {
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

  const handleAbrirModal = (id) => {
    setPaginaEliminarId(id);
    setIsModalOpen(true);
  };

  const handleCancelar = () => {
    setIsModalOpen(false);
    setIdEliminar(null);
    setTipoEliminar(null);
  };

    
  const handleBorrarPagina = async () => {
    if (!paginaEliminarId) return;
    setLoadingSecciones(true);
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${urlBase}/recursos/paginas-tematicas/${paginaEliminarId}`, config);
      toast.success("Página eliminada exitosamente", {
        position: "top-center", autoClose: 3000,
      });
      setRecursosPorSeccion(prevRecursos => {
        const seccionIdConRecurso = Object.keys(prevRecursos).find(seccionId => {
          return (prevRecursos[seccionId] || []).some(recurso => recurso.id === paginaEliminarId);
        });
        if (seccionIdConRecurso) {
          return {
            ...prevRecursos,
            [seccionIdConRecurso]: prevRecursos[seccionIdConRecurso].filter(recurso => recurso.id !== paginaEliminarId)
          };
        }
        return prevRecursos;
      });
      handleCancelar();
    } catch (error) {
      console.error("Error al eliminar la página", error);
      
    } finally {
      setLoadingSecciones(false);
    }
  };
  
  const handleBorrar = async () => {
      if (!idEliminar || !tipoEliminar) return;

      setLoadingSecciones(true);

      try {    
          const urlBase = import.meta.env.VITE_BACKEND_URL;
          const token = localStorage.getItem("token");
          const config = {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
          };
          
          let deleteUrl = '';
          if (tipoEliminar === 'pagina') {
              deleteUrl = `${urlBase}/recursos/paginas-tematicas/${idEliminar}`;
          } else if (tipoEliminar === 'seccion') {
              deleteUrl = `${urlBase}/secciones/eliminar/${codigo}/${idEliminar}`;
          }

          await axios.delete(deleteUrl, config);
          
          toast.success(`${tipoEliminar === 'pagina' ? 'Página' : 'Sección'} eliminada exitosamente`, {
              position: "top-center", autoClose: 3000,
          });
          
          if (tipoEliminar === 'seccion') {
              setSecciones(prev => prev.filter(s => s.id !== idEliminar));
          } else if (tipoEliminar === 'pagina') {
              setRecursosPorSeccion(prevRecursos => {
                  const seccionIdConRecurso = Object.keys(prevRecursos).find(seccionId => {
                      return (prevRecursos[seccionId] || []).some(recurso => recurso.id === idEliminar);
                  });
          
                  if (seccionIdConRecurso) {
                      return {
                          ...prevRecursos,
                          [seccionIdConRecurso]: prevRecursos[seccionIdConRecurso].filter(recurso => recurso.id !== idEliminar)
                      };
                  }
                  return prevRecursos;
              });
          }

          handleCancelar();
      } catch (error) {
          console.error("Error al eliminar:", error);
          toast.error(`Ocurrió un error al eliminar la ${tipoEliminar}`, {
              position: "top-center", autoClose: 3000,
          });
      } finally {
          setLoadingSecciones(false);
      }
  }


  const agregarPagina = (seccionId) => {
    navigate(`/curso/${codigo}/${seccionId}/crear-pagina`);
  };

  const verPagina = (recursoId, seccionId) => {
    navigate(`/curso/${codigo}/seccion/${seccionId}/paginaTematica/${recursoId}`);
  };
    
  const editarPagina = (recursoId) => {
    navigate(`/curso/${codigo}/pagina/${recursoId}/editar`);
  }

  const modificarSeccion = (seccionId) => {
    navigate(`/curso/${codigo}/seccion/${seccionId}/editar`);
  };

  const eliminarSeccion = (seccionId) => {
    setSeccionEliminarId(seccionId);
    setIsModalOpen(true);
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

  const eliminarMaterial = async (recursoId, seccionId) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${urlBase}/recursos/cursos/${codigo}/secciones/${seccionId}/materiales/${recursoId}`, config);
      toast.success("Material eliminado exitosamente", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => window.location.reload(), 1600);
    } catch (error) {
      toast.error("Ocurrió un error al eliminar el material", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const agregarTarea = (seccionId) => {
    navigate(`/curso/${codigo}/${seccionId}/crear-tarea`, {
      state: { cursoActual }
    });
  }

  const verTarea = (recursoId) => {
    navigate(`/curso/${codigo}/tarea/${recursoId}`);
  }

  const editarTarea = (recursoId, seccionId) => {
    navigate(`/curso/${codigo}/seccion/${seccionId}/tarea/${recursoId}/editar`);
  }

  const verEntregasTarea = (recursoId, seccionId) => {
    navigate(`/curso/${codigo}/tarea/${recursoId}/entregas`);
  }

  const eliminarTarea = async (recursoId, seccionId) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          codigoCurso: codigo,
          idSeccion: seccionId
        }
      };
      const url = `${urlBase}/recursos/tarea/${recursoId}`;
      console.log("[ELIMINAR TAREA] recursoId:", recursoId, "url:", url, "body:", config.data);
      await axios.delete(url, config);
      toast.success("Tarea eliminada exitosamente", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => window.location.reload(), 1600);
    } catch (error) {
      toast.error("Ocurrió un error al eliminar la tarea", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const enviarNotificacionFechaTarea = async (recursoId) => {
  const urlBase = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const url = `${urlBase}/notificaciones/avisoFechaLimite/curso/${cursoActual.id}/tarea/${recursoId}`;
  await axios.post(url, {}, config);
  toast.success("Notificación enviada exitosamente", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  };

  const agregarForo = (seccionId) => {
    navigate(`/curso/${codigo}/${seccionId}/crear-foro`, {
      state: { cursoActual }
    });
  }

  const verForo = (recursoId) => {
    navigate(`/curso/${codigo}/foro/${recursoId}`);
  }

  const editarForo = (recursoId, seccionId) => {
    navigate(`/curso/${codigo}/seccion/${seccionId}/foro/${recursoId}/editar`);
  };

  const eliminarForo = async (recursoId) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${urlBase}/recursos/foro/${recursoId}`, config);
      toast.success("Foro eliminado exitosamente", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => window.location.reload(), 1600);
    } catch (error) {
      toast.error("Ocurrió un error al eliminar el foro", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleBorrarSeccion = async () => {
    if (!seccionEliminarId) return;

    setLoadingSecciones(true);

    try {    
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          },
      };
      const response = await axios.delete(`${urlBase}/secciones/eliminar/${codigo}/${seccionEliminarId}`, config);
      console.log(response);
      toast.success("Sección eliminada exitosamente", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
      setSecciones(secciones.filter(seccion => seccion.id !== seccionEliminarId));
      handleCancelar();
    } catch (error) {
      console.error("Error al eliminar la sección:", error);
    } finally {
      setLoadingSecciones(false);
    }
  };

  function getColorForCurso(idCurso) {
    const colores = [
      "#74B8FF",
      "#EE6A98",
      "#A19BFD",
      "#00B894",
      "#FDCA6E",
      "#80ECEC",
      "#F7634D"
    ];

    const index = idCurso % colores.length;
    return colores[index];
  }

  if (!cursoActual || !cursoActual.id) {
    return (
      <S.Container> 
        <Sidebar>

        </Sidebar>
        <MainContent>
          <div style={{ marginTop: "60px" }}></div>
            <Spinner />
        </MainContent>
      </S.Container>
    );
  }

  const obtenerSVGRecurso = (tipoRecurso) => {
    switch(tipoRecurso) {
      case 'PAGINA_TEMATICA':
        return (
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.6243 7.2915H18.7493C19.4333 7.2915 20.1106 7.42622 20.7425 7.68796C21.3744 7.94971 21.9486 8.33335 22.4322 8.81699C22.9158 9.30063 23.2995 9.87479 23.5612 10.5067C23.823 11.1386 23.9577 11.8159 23.9577 12.4998C23.9577 13.1838 23.823 13.8611 23.5612 14.493C23.2995 15.1249 22.9158 15.699 22.4322 16.1827C21.9486 16.6663 21.3744 17.05 20.7425 17.3117C20.1106 17.5735 19.4333 17.7082 18.7493 17.7082H15.6243M9.37435 17.7082H6.24935C5.56538 17.7082 4.88811 17.5735 4.25621 17.3117C3.6243 17.05 3.05014 16.6663 2.5665 16.1827C1.58975 15.2059 1.04102 13.8812 1.04102 12.4998C1.04102 11.1185 1.58975 9.79374 2.5665 8.81699C3.54325 7.84024 4.86801 7.2915 6.24935 7.2915H9.37435M8.33268 12.4998H16.666" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'TAREA':
        return (
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.20833 19.7917H6.69271L16.875 9.60937L15.3906 8.125L5.20833 18.3073V19.7917ZM3.125 21.875V17.4479L16.875 3.72396C17.0833 3.53299 17.3134 3.38542 17.5651 3.28125C17.8168 3.17708 18.0816 3.125 18.3594 3.125C18.6372 3.125 18.9062 3.17708 19.1667 3.28125C19.4271 3.38542 19.6528 3.54167 19.8438 3.75L21.276 5.20833C21.4844 5.39931 21.6363 5.625 21.7318 5.88542C21.8273 6.14583 21.875 6.40625 21.875 6.66667C21.875 6.94444 21.8273 7.2092 21.7318 7.46094C21.6363 7.71267 21.4844 7.94271 21.276 8.15104L7.55208 21.875H3.125ZM16.1198 8.88021L15.3906 8.125L16.875 9.60937L16.1198 8.88021Z" fill="#1D1B20"/>
          </svg>
        );
      case 'MATERIAL':
        return (
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5827 2.0835H6.24935C5.69681 2.0835 5.16691 2.30299 4.77621 2.69369C4.38551 3.08439 4.16602 3.6143 4.16602 4.16683V20.8335C4.16602 21.386 4.38551 21.9159 4.77621 22.3066C5.16691 22.6973 5.69681 22.9168 6.24935 22.9168H18.7493C19.3019 22.9168 19.8318 22.6973 20.2225 22.3066C20.6132 21.9159 20.8327 21.386 20.8327 20.8335V8.3335M14.5827 2.0835L20.8327 8.3335M14.5827 2.0835L14.5827 8.3335H20.8327M16.666 13.5418H8.33268M16.666 17.7085H8.33268M10.416 9.37516H8.33268" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'FORO':
        return (
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25065 14.5835H18.7507V12.5002H6.25065V14.5835ZM6.25065 11.4585H18.7507V9.37516H6.25065V11.4585ZM6.25065 8.3335H18.7507V6.25016H6.25065V8.3335ZM22.9173 22.9168L18.7507 18.7502H4.16732C3.5944 18.7502 3.10395 18.5462 2.69596 18.1382C2.28798 17.7302 2.08398 17.2397 2.08398 16.6668V4.16683C2.08398 3.59391 2.28798 3.10346 2.69596 2.69548C3.10395 2.28749 3.5944 2.0835 4.16732 2.0835H20.834C21.4069 2.0835 21.8974 2.28749 22.3053 2.69548C22.7133 3.10346 22.9173 3.59391 22.9173 4.16683V22.9168ZM4.16732 16.6668H19.6361L20.834 17.8387V4.16683H4.16732V16.6668Z" fill="#1D1B20"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
  <S.Container>
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
        <IndexTitle>Contenido del Curso:</IndexTitle>
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

    <ModalConfirmacion
      isOpen={isModalOpen}
      message={seccionEliminarId ? `¿Estás seguro de que quieres eliminar esta sección?` : `¿Estás seguro de que quieres eliminar este recurso?`}
      onConfirm={seccionEliminarId ? handleBorrarSeccion : handleBorrarPagina}
      onCancel={handleCancelar}
      isLoading={loadingSecciones}
    />
      
    <MainContent>
      <CourseInfoHeader bg={getColorForCurso(cursoActual.id)}>
        <CourseInfoGrid>
          <InfoSection>
            {/*<InfoLabel>Nombre del Curso:</InfoLabel>*/}
            <InfoLabel>{cursoActual.nombre}</InfoLabel>
          </InfoSection>
          
          <InfoSection>
            {/*<InfoLabel>Turno:</InfoLabel>*/}
            <InfoValue>{cursoActual.turno + " - " + cursoActual.anio|| "Sin turno"}</InfoValue>
          </InfoSection>
          
          <InfoSection className="inline">
            <InfoValue>{"Profesores: "}</InfoValue>
            <InfoValue>
              {cursoActual.profesores?.length > 0
                ? cursoActual.profesores.join(", ")
                : "Sin profesores"}
            </InfoValue>
          </InfoSection>
          
          
        </CourseInfoGrid>
        {/* Imagen a la derecha */}
        <CourseImageContainer>
          <img src="/logoCurso.png" alt="Logo" />
        </CourseImageContainer>
      </CourseInfoHeader>
      
      <SectionsContainer>
        {loadingSecciones ? (
          <LoadingMessage>
            Cargando secciones...
          </LoadingMessage>
        ) : secciones.length > 0 ? (
          <>
            {/* Renderizar primero la Cartelera de Novedades */}
            {secciones
              .filter(seccion => seccion.titulo && seccion.titulo.trim().toLowerCase() === 'cartelera de novedades')
              .map((seccion) => {
                const collapsed = seccionesColapsadas[seccion.id] ?? true;
                return (
                  <SectionPlaceholder 
                    key={seccion.id}
                    style={{
                      backgroundColor: '#d7d7d7ff'
                    }}
                  >
                    <SectionHeader 
                      collapsed={collapsed}
                      className="cartelera-header"
                      onClick={() => toggleSeccion(seccion.id)}
                    >
                      <SectionTitleContainer>
                        <CollapseIcon collapsed={collapsed}>
                          ▼
                        </CollapseIcon>
                        <SectionTitle>{seccion.titulo || `Sección ${seccion.id}`}</SectionTitle>
                      </SectionTitleContainer>
                      
                      <RightIconContainer>
                        <svg width="85" height="85" viewBox="0 0 70 70" fill="none">
                          <g opacity="1">
                            <path d="M46.667 11.6668H52.5003C54.0474 11.6668 55.5312 12.2814 56.6251 13.3754C57.7191 14.4693 58.3337 15.9531 58.3337 17.5002V58.3335C58.3337 59.8806 57.7191 61.3643 56.6251 62.4583C55.5312 63.5522 54.0474 64.1668 52.5003 64.1668H17.5003C15.9532 64.1668 14.4695 63.5522 13.3755 62.4583C12.2816 61.3643 11.667 59.8806 11.667 58.3335V17.5002C11.667 15.9531 12.2816 14.4693 13.3755 13.3754C14.4695 12.2814 15.9532 11.6668 17.5003 11.6668H23.3337M26.2503 5.8335H43.7503C45.3612 5.8335 46.667 7.13933 46.667 8.75016V14.5835C46.667 16.1943 45.3612 17.5002 43.7503 17.5002H26.2503C24.6395 17.5002 23.3337 16.1943 23.3337 14.5835V8.75016C23.3337 7.13933 24.6395 5.8335 26.2503 5.8335Z" 
                              stroke="#1E1E1E" 
                              strokeWidth="5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                      </RightIconContainer>
                    </SectionHeader>

                    {puedeAdministrarCursos(location.pathname) && !collapsed && (
                      <ButtonGroup style={{ marginBottom: '10px' }}>
                        <ActionButton 
                          variant="success" 
                          onClick={(e) => {
                            e.stopPropagation();
                            agregarPagina(seccion.id);
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.125V11.875M3.125 7.5H11.875" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Novedad
                        </ActionButton>
                      </ButtonGroup>
                    )}

                    <SectionContent collapsed={collapsed}>
                      <SectionInfo>
                        {Array.isArray(recursosPorSeccion[seccion.id]) && recursosPorSeccion[seccion.id].length > 0 ? (
                          <div style={{ marginTop: '10px' }}>
                            {[...recursosPorSeccion[seccion.id]].reverse().map((recurso) => (
                              <RecursoContainer
                                key={recurso.id}
                                clickable={true}
                                onClick={() => verPagina(recurso.id, seccion.id)}
                              >
                                {/* PÁGINA TEMÁTICA (Novedad) */}
                                {recurso.tipoRecurso === 'PAGINA_TEMATICA' ? (
                                  <>
                                    <span style={{color:'#222'}}>
                                      {recurso.nombre === null ? '(null)' : recurso.nombre}
                                    </span>
                                    <RecursoActions>
                                      {puedeAdministrarCursos(location.pathname) && (
                                        <>
                                          <ActionButton
                                            variant="warning"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              editarPagina(recurso.id);
                                            }}
                                          >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g clipPath="url(#clip0_387_2092)">
                                                <path d="M6.875 2.50014H2.5C2.16848 2.50014 1.85054 2.63184 1.61612 2.86626C1.3817 3.10068 1.25 3.41862 1.25 3.75014V12.5001C1.25 12.8317 1.3817 13.1496 1.61612 13.384C1.85054 13.6184 2.16848 13.7501 2.5 13.7501H11.25C11.5815 13.7501 11.8995 13.6184 12.1339 13.384C12.3683 13.1496 12.5 12.8317 12.5 12.5001V8.12514M11.5625 1.56264C11.8111 1.314 12.1484 1.17432 12.5 1.17432C12.8516 1.17432 13.1889 1.314 13.4375 1.56264C13.6861 1.81128 13.8258 2.14851 13.8258 2.50014C13.8258 2.85177 13.6861 3.189 13.4375 3.43764L7.5 9.37514L5 10.0001L5.625 7.50014L11.5625 1.56264Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_387_2092">
                                                  <rect width="15" height="15" fill="white"/>
                                                </clipPath>
                                              </defs>
                                            </svg>
                                            Modificar
                                          </ActionButton>
                                          <ActionButton
                                            variant="danger"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAbrirModal(recurso.id);
                                            }}
                                          >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M1.875 3.75H3.125M3.125 3.75H13.125M3.125 3.75V12.5C3.125 12.8315 3.2567 13.1495 3.49112 13.3839C3.72554 13.6183 4.04348 13.75 4.375 13.75H10.625C10.9565 13.75 11.2745 13.6183 11.5089 13.3839C11.7433 13.1495 11.875 12.8315 11.875 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75M6.25 6.875V10.625M8.75 6.875V10.625" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Eliminar
                                          </ActionButton>
                                        </>
                                      )}
                                    </RecursoActions>
                                  </>
                                ) : (
                                  <span style={{color:'#222'}}>Recurso sin tipo</span>
                                )}
                              </RecursoContainer>
                            ))}
                          </div>
                        ) : (
                          <div style={{color:'#999', marginTop: '10px', textAlign: 'center', padding: '20px'}}>
                            No hay recursos en esta sección.
                          </div>
                        )}
                      </SectionInfo>
                    </SectionContent>
                  </SectionPlaceholder>
                );
              })
            }
          </>
        ) : (
          <NoSectionsMessage>
            <h3>No hay secciones creadas</h3>
            <p>Aún no se han creado secciones para este curso.</p>
            <p>Utiliza el botón "Agregar Sección" para crear la primera sección.</p>
          </NoSectionsMessage>
        )}
      </SectionsContainer>

      {/* Botón de agregar sección solo para profesores */}
      {puedeAdministrarCursos(location.pathname) && secciones.length > 0 && (
        <AddSectionButton onClick={() => irAltaSeccion()}>
          + Agregar Sección
        </AddSectionButton>
      )}
      
      <SectionsContainer>
        {!loadingSecciones && secciones.length > 0 && (
          <>
            {/* Renderizar el resto de las secciones */}
            {secciones
              .filter(seccion => !seccion.titulo || seccion.titulo.trim().toLowerCase() !== 'cartelera de novedades')
              .map((seccion) => {
                const collapsed = seccionesColapsadas[seccion.id] ?? true;
                return (
                  <SectionPlaceholder key={seccion.id}>
                    <SectionHeader 
                      collapsed={collapsed} 
                      onClick={() => toggleSeccion(seccion.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <SectionTitleContainer>
                        <CollapseIcon collapsed={collapsed}>
                          ▼
                        </CollapseIcon>
                        <SectionTitle>{seccion.titulo || `Sección ${seccion.id}`}</SectionTitle>
                      </SectionTitleContainer>
                      
                      {/* Botones de gestión a la derecha */}
                      {puedeAdministrarCursos(location.pathname) && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <ActionButton
                            variant="warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              modificarSeccion(seccion.id);
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_387_2092)">
                                <path d="M6.875 2.50014H2.5C2.16848 2.50014 1.85054 2.63184 1.61612 2.86626C1.3817 3.10068 1.25 3.41862 1.25 3.75014V12.5001C1.25 12.8317 1.3817 13.1496 1.61612 13.384C1.85054 13.6184 2.16848 13.7501 2.5 13.7501H11.25C11.5815 13.7501 11.8995 13.6184 12.1339 13.384C12.3683 13.1496 12.5 12.8317 12.5 12.5001V8.12514M11.5625 1.56264C11.8111 1.314 12.1484 1.17432 12.5 1.17432C12.8516 1.17432 13.1889 1.314 13.4375 1.56264C13.6861 1.81128 13.8258 2.14851 13.8258 2.50014C13.8258 2.85177 13.6861 3.189 13.4375 3.43764L7.5 9.37514L5 10.0001L5.625 7.50014L11.5625 1.56264Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_387_2092">
                                  <rect width="15" height="15" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                            Modificar
                          </ActionButton>
                          
                          <ActionButton
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              eliminarSeccion(seccion.id);
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.875 3.75H3.125M3.125 3.75H13.125M3.125 3.75V12.5C3.125 12.8315 3.2567 13.1495 3.49112 13.3839C3.72554 13.6183 4.04348 13.75 4.375 13.75H10.625C10.9565 13.75 11.2745 13.6183 11.5089 13.3839C11.7433 13.1495 11.875 12.8315 11.875 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75M6.25 6.875V10.625M8.75 6.875V10.625" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Eliminar
                          </ActionButton>
                        </div>
                      )}
                    </SectionHeader>

                    {puedeAdministrarCursos(location.pathname) && !collapsed && (
                      <ButtonGroup style={{ marginBottom: '10px' }}>
                        <ActionButton
                          variant="success"
                          onClick={(e) => {
                            e.stopPropagation();
                            agregarTarea(seccion.id);
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.125V11.875M3.125 7.5H11.875" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Tarea
                        </ActionButton>
                        
                        <ActionButton
                          variant="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            irSubirMaterial(seccion.id);
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.125V11.875M3.125 7.5H11.875" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Material
                        </ActionButton>
                        
                        <ActionButton
                          variant="success"
                          onClick={(e) => {
                            e.stopPropagation();
                            agregarForo(seccion.id);
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.125V11.875M3.125 7.5H11.875" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Foro
                        </ActionButton>
                        
                        <ActionButton
                          variant="success"
                          onClick={(e) => {
                            e.stopPropagation();
                            agregarPagina(seccion.id);
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.125V11.875M3.125 7.5H11.875" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Página Temática
                        </ActionButton>
                      </ButtonGroup>
                    )}
                    
                    <SectionContent collapsed={collapsed}>
                      <SectionInfo>
                        {Array.isArray(recursosPorSeccion[seccion.id]) && recursosPorSeccion[seccion.id].length > 0 ? (
                          <div style={{ marginTop: '10px' }}>
                            {recursosPorSeccion[seccion.id].map((recurso) => (
                              <RecursoContainer
                                key={recurso.id}
                                clickable={['FORO', 'PAGINA_TEMATICA', 'TAREA'].includes(recurso.tipoRecurso)}
                                onClick={() => {
                                  if (recurso.tipoRecurso === 'FORO') {
                                    navigate(`/curso/${codigo}/foro/${recurso.id}`);
                                  } else if (recurso.tipoRecurso === 'PAGINA_TEMATICA') {
                                    verPagina(recurso.id, seccion.id);
                                  } else if (recurso.tipoRecurso === 'TAREA') {
                                    verTarea(recurso.id);
                                  }
                                }}
                              >
                                {/* MATERIAL */}
                                {recurso.tipoRecurso === 'MATERIAL' && (
                                  <>
                                    <span style={{color:'#222', display:'flex', alignItems:'center', gap:'6px'}}>
                                      {obtenerSVGRecurso('MATERIAL')}
                                      {recurso.nombre === null ? '(null)' : recurso.nombre}
                                    </span>
                                    <RecursoActions>
                                      <ActionButton
                                        onClick={e => {
                                          e.stopPropagation();
                                          handleDescargarMaterial(codigo, seccion.id, recurso);
                                        }}
                                      >
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M12.0508 8.2998V10.7998C12.0508 11.1313 11.9191 11.4493 11.6847 11.6837C11.4502 11.9181 11.1323 12.0498 10.8008 12.0498H2.05078C1.71926 12.0498 1.40132 11.9181 1.1669 11.6837C0.932477 11.4493 0.800781 11.1313 0.800781 10.7998V8.2998M3.30078 5.1748L6.42578 8.2998M6.42578 8.2998L9.55078 5.1748M6.42578 8.2998V0.799805" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Descargar
                                      </ActionButton>
                                      {puedeAdministrarCursos(location.pathname) && (
                                        <ActionButton
                                          variant="danger"
                                          onClick={e => {
                                            e.stopPropagation();
                                            eliminarMaterial(recurso.id, seccion.id);
                                          }}
                                        >
                                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.875 3.75H3.125M3.125 3.75H13.125M3.125 3.75V12.5C3.125 12.8315 3.2567 13.1495 3.49112 13.3839C3.72554 13.6183 4.04348 13.75 4.375 13.75H10.625C10.9565 13.75 11.2745 13.6183 11.5089 13.3839C11.7433 13.1495 11.875 12.8315 11.875 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75M6.25 6.875V10.625M8.75 6.875V10.625" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          Eliminar
                                        </ActionButton>
                                      )}
                                    </RecursoActions>
                                  </>
                                )}

                                {/* FORO */}
                                {recurso.tipoRecurso === 'FORO' && (
                                  <>
                                    <span style={{color:'#222', display:'flex', alignItems:'center', gap:'8px'}}>
                                      {obtenerSVGRecurso('FORO')}
                                      {recurso.nombre === null ? '(null)' : recurso.nombre}
                                    </span>
                                    {puedeAdministrarCursos(location.pathname) && (
                                      <RecursoActions>
                                        <ActionButton
                                          variant="warning"
                                          onClick={e => {
                                            e.stopPropagation();
                                            editarForo(recurso.id, seccion.id);
                                          }}
                                        >
                                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_387_2092_foro)">
                                              <path d="M6.875 2.50014H2.5C2.16848 2.50014 1.85054 2.63184 1.61612 2.86626C1.3817 3.10068 1.25 3.41862 1.25 3.75014V12.5001C1.25 12.8317 1.3817 13.1496 1.61612 13.384C1.85054 13.6184 2.16848 13.7501 2.5 13.7501H11.25C11.5815 13.7501 11.8995 13.6184 12.1339 13.384C12.3683 13.1496 12.5 12.8317 12.5 12.5001V8.12514M11.5625 1.56264C11.8111 1.314 12.1484 1.17432 12.5 1.17432C12.8516 1.17432 13.1889 1.314 13.4375 1.56264C13.6861 1.81128 13.8258 2.14851 13.8258 2.50014C13.8258 2.85177 13.6861 3.189 13.4375 3.43764L7.5 9.37514L5 10.0001L5.625 7.50014L11.5625 1.56264Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_387_2092_foro">
                                                <rect width="15" height="15" fill="white"/>
                                              </clipPath>
                                            </defs>
                                          </svg>
                                          Modificar
                                        </ActionButton>
                                        <ActionButton
                                          variant="danger"
                                          onClick={e => {
                                            e.stopPropagation();
                                            eliminarForo(recurso.id);
                                          }}
                                        >
                                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.875 3.75H3.125M3.125 3.75H13.125M3.125 3.75V12.5C3.125 12.8315 3.2567 13.1495 3.49112 13.3839C3.72554 13.6183 4.04348 13.75 4.375 13.75H10.625C10.9565 13.75 11.2745 13.6183 11.5089 13.3839C11.7433 13.1495 11.875 12.8315 11.875 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75M6.25 6.875V10.625M8.75 6.875V10.625" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          Eliminar
                                        </ActionButton>
                                      </RecursoActions>
                                    )}
                                  </>
                                )}

                                {/* PÁGINA TEMÁTICA */}
                                {recurso.tipoRecurso === 'PAGINA_TEMATICA' && (
                                  <>
                                    <span style={{color:'#222', display:'flex', alignItems:'center', gap:'8px'}}>
                                      {obtenerSVGRecurso('PAGINA_TEMATICA')}
                                      {recurso.nombre === null ? '(null)' : recurso.nombre}
                                    </span>
                                    <RecursoActions>
                                      {puedeAdministrarCursos(location.pathname) && (
                                        <>
                                          <ActionButton
                                            variant="warning"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              editarPagina(recurso.id);
                                            }}
                                          >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g clipPath="url(#clip0_387_2092)">
                                                <path d="M6.875 2.50014H2.5C2.16848 2.50014 1.85054 2.63184 1.61612 2.86626C1.3817 3.10068 1.25 3.41862 1.25 3.75014V12.5001C1.25 12.8317 1.3817 13.1496 1.61612 13.384C1.85054 13.6184 2.16848 13.7501 2.5 13.7501H11.25C11.5815 13.7501 11.8995 13.6184 12.1339 13.384C12.3683 13.1496 12.5 12.8317 12.5 12.5001V8.12514M11.5625 1.56264C11.8111 1.314 12.1484 1.17432 12.5 1.17432C12.8516 1.17432 13.1889 1.314 13.4375 1.56264C13.6861 1.81128 13.8258 2.14851 13.8258 2.50014C13.8258 2.85177 13.6861 3.189 13.4375 3.43764L7.5 9.37514L5 10.0001L5.625 7.50014L11.5625 1.56264Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_387_2092">
                                                  <rect width="15" height="15" fill="white"/>
                                                </clipPath>
                                              </defs>
                                            </svg>
                                            Modificar
                                          </ActionButton>
                                          <ActionButton
                                            variant="danger"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAbrirModal(recurso.id);
                                            }}
                                          >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M1.875 3.75H3.125M3.125 3.75H13.125M3.125 3.75V12.5C3.125 12.8315 3.2567 13.1495 3.49112 13.3839C3.72554 13.6183 4.04348 13.75 4.375 13.75H10.625C10.9565 13.75 11.2745 13.6183 11.5089 13.3839C11.7433 13.1495 11.875 12.8315 11.875 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75M6.25 6.875V10.625M8.75 6.875V10.625" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Eliminar
                                          </ActionButton>
                                        </>
                                      )}
                                    </RecursoActions>
                                  </>
                                )}

                                {/* TAREA */}
                                {recurso.tipoRecurso === 'TAREA' && (
                                  <>
                                    <Recurso style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                      {obtenerSVGRecurso('TAREA')}
                                      {recurso.nombre === null ? '(null)' : recurso.nombre}
                                    </Recurso>
                                    <RecursoActions>
                                      {puedeAdministrarCursos(location.pathname) && (
                                        <>
                                          <ActionButton
                                            onClick={e => {
                                              e.stopPropagation();
                                              verEntregasTarea(recurso.id, seccion.id);
                                            }}
                                          >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g clipPath="url(#clip0_407_2127)">
                                                <path d="M0.625 7.5C0.625 7.5 3.125 2.5 7.5 2.5C11.875 2.5 14.375 7.5 14.375 7.5C14.375 7.5 11.875 12.5 7.5 12.5C3.125 12.5 0.625 7.5 0.625 7.5Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7.5 9.375C8.53553 9.375 9.375 8.53553 9.375 7.5C9.375 6.46447 8.53553 5.625 7.5 5.625C6.46447 5.625 5.625 6.46447 5.625 7.5C5.625 8.53553 6.46447 9.375 7.5 9.375Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_407_2127">
                                                  <rect width="15" height="15" fill="white"/>
                                                </clipPath>
                                              </defs>
                                            </svg>
                                            Ver entregas
                                          </ActionButton>
                                          <ActionButton
                                            onClick={e => {
                                              e.stopPropagation();
                                              enviarNotificacionFechaTarea(recurso.id);
                                            }}
                                          >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.58125 13.125C8.47137 13.3144 8.31365 13.4717 8.12389 13.581C7.93413 13.6903 7.71899 13.7478 7.5 13.7478C7.28101 13.7478 7.06587 13.6903 6.87611 13.581C6.68635 13.4717 6.52863 13.3144 6.41875 13.125M11.25 5C11.25 4.00544 10.8549 3.05161 10.1517 2.34835C9.44839 1.64509 8.49456 1.25 7.5 1.25C6.50544 1.25 5.55161 1.64509 4.84835 2.34835C4.14509 3.05161 3.75 4.00544 3.75 5C3.75 9.375 1.875 10.625 1.875 10.625H13.125C13.125 10.625 11.25 9.375 11.25 5Z" stroke="#1E1E1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            Enviar aviso
                                          </ActionButton>
                                        </>
                                      )}
                                      {puedeAdministrarCursos(location.pathname) && (
                                        <>
                                          <ActionButton
                                            variant="warning"
                                            onClick={e => {
                                              e.stopPropagation();
                                              editarTarea(recurso.id);
                                            }}
                                          >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g clipPath="url(#clip0_387_2092)">
                                                <path d="M6.875 2.50014H2.5C2.16848 2.50014 1.85054 2.63184 1.61612 2.86626C1.3817 3.10068 1.25 3.41862 1.25 3.75014V12.5001C1.25 12.8317 1.3817 13.1496 1.61612 13.384C1.85054 13.6184 2.16848 13.7501 2.5 13.7501H11.25C11.5815 13.7501 11.8995 13.6184 12.1339 13.384C12.3683 13.1496 12.5 12.8317 12.5 12.5001V8.12514M11.5625 1.56264C11.8111 1.314 12.1484 1.17432 12.5 1.17432C12.8516 1.17432 13.1889 1.314 13.4375 1.56264C13.6861 1.81128 13.8258 2.14851 13.8258 2.50014C13.8258 2.85177 13.6861 3.189 13.4375 3.43764L7.5 9.37514L5 10.0001L5.625 7.50014L11.5625 1.56264Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_387_2092">
                                                  <rect width="15" height="15" fill="white"/>
                                                </clipPath>
                                              </defs>
                                            </svg>
                                            Modificar
                                          </ActionButton>
                                          <ActionButton
                                            variant="danger"
                                            onClick={e => {
                                              e.stopPropagation();
                                              eliminarTarea(recurso.id);
                                            }}
                                          >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M1.875 3.75H3.125M3.125 3.75H13.125M3.125 3.75V12.5C3.125 12.8315 3.2567 13.1495 3.49112 13.3839C3.72554 13.6183 4.04348 13.75 4.375 13.75H10.625C10.9565 13.75 11.2745 13.6183 11.5089 13.3839C11.7433 13.1495 11.875 12.8315 11.875 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75M6.25 6.875V10.625M8.75 6.875V10.625" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Eliminar
                                          </ActionButton>
                                        </>
                                      )}
                                    </RecursoActions>
                                  </>
                                )}

                                {/* RECURSO SIN TIPO */}
                                {!['MATERIAL', 'FORO', 'PAGINA_TEMATICA', 'TAREA'].includes(recurso.tipoRecurso) && (
                                  <span style={{color:'#222'}}>Recurso sin tipo</span>
                                )}
                              </RecursoContainer>
                            ))}
                          </div>
                        ) : (
                          <div style={{color:'#999', marginTop: '10px', textAlign: 'center', padding: '20px'}}>
                            No hay recursos en esta sección.
                          </div>
                        )}
                      </SectionInfo>
                    </SectionContent>
                  </SectionPlaceholder>
                );
              })
            }
          </>
        )}
      </SectionsContainer>

    </MainContent>
  </S.Container>
  )
}

export default PaginaCurso;