
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
      toast.error("Ocurrió un error al eliminar la página", {
        position: "top-center", autoClose: 3000,
      });
    } finally {
      setLoadingSecciones(false);
    }
  };
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
  Recurso
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
      toast.error("Ocurrió un error al eliminar la sección", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
    } finally {
      setLoadingSecciones(false);
    }
  };

  function getColorForCurso(idCurso) {
    const colores = [
      "#74B8FF",
      "#FD79A8",
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
              <InfoLabel>Nombre del Curso</InfoLabel>
              <InfoValue>{cursoActual.nombre}</InfoValue>
            </InfoSection>
            
            <InfoSection>
              <InfoLabel>Profesores</InfoLabel>
              <InfoValue>
                {cursoActual.profesores?.length > 0
                  ? cursoActual.profesores.join(", ")
                  : "Sin profesores"}
              </InfoValue>
            </InfoSection>
            
            <InfoSection>
              <InfoLabel>Turno</InfoLabel>
              <InfoValue>{cursoActual.turno || "Sin turno"}</InfoValue>
            </InfoSection>
          </CourseInfoGrid>
        </CourseInfoHeader>
        
        {puedeAdministrarCursos(location.pathname) && (
          <AddSectionButton onClick={() => irAltaSeccion()}>
            + Agregar Sección
          </AddSectionButton>
        )}
        
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
                  {puedeAdministrarCursos(location.pathname) && (
                    seccion.titulo && seccion.titulo.trim().toLowerCase() === 'cartelera de novedades'
                      ? (
                        <ButtonGroup style={{ marginBottom: '10px' }}>
                          <ActionButton 
                            variant="success" 
                            onClick={(e) => {
                              e.stopPropagation();
                              agregarPagina(seccion.id);
                            }}
                          >
                            Agregar Pagina
                          </ActionButton>
                        </ButtonGroup>
                      )
                      : (
                        <ButtonGroup style={{ marginBottom: '10px' }}>
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
                            Modificar sección
                          </ActionButton>
                          <ActionButton 
                            variant="danger" 
                            onClick={(e) => {
                              e.stopPropagation();
                              eliminarSeccion(seccion.id);
                            }}
                          >
                            Eliminar sección
                          </ActionButton>
                        </ButtonGroup>
                      )
                  )}
                  <SectionContent collapsed={collapsed}>
                    <SectionInfo>
                      <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                        {Array.isArray(recursosPorSeccion[seccion.id]) && recursosPorSeccion[seccion.id].length > 0 ? (
                          recursosPorSeccion[seccion.id].map((recurso, idx, arr) => (
                            <li
                              key={recurso.id}
                              style={{
                                paddingBottom: '8px',
                                marginBottom: '8px',
                                borderBottom: idx < arr.length - 1 ? '2px solid #222' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: recurso.tipoRecurso === 'FORO' ? 'pointer' : 'default',
                              }}
                              onClick={
                                recurso.tipoRecurso === 'FORO'
                                  ? () => navigate(`/curso/${codigo}/foro/${recurso.id}`)
                                  : undefined
                              }
                            >
                              {recurso.tipoRecurso === 'MATERIAL' ? (
                                <>
                                  <span style={{color:'#222', display:'flex', alignItems:'center', gap:'6px'}}>
                                    <span role="img" aria-label="archivo">📄</span>
                                    {recurso.nombre === null ? '(null)' : recurso.nombre}
                                  </span>
                                  <button
                                    style={{color:'#fff', background:'#007bff', border:'none', borderRadius:'4px', fontSize:'14px', cursor:'pointer', padding:'4px 12px', marginLeft:'10px', display:'flex', alignItems:'center', gap:'4px'}}
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleDescargarMaterial(codigo, seccion.id, recurso);
                                    }}
                                  >
                                    Descargar
                                  </button>
                                  {puedeAdministrarCursos(location.pathname) && (
                                    <span
                                      title="Eliminar material"
                                      style={{ cursor: 'pointer', marginLeft: '8px', color: '#ff0000', fontSize: '18px' }}
                                      onClick={e => {
                                        e.stopPropagation();
                                        eliminarMaterial(recurso.id, seccion.id);
                                      }}
                                    >
                                      ❌
                                    </span>
                                  )}
                                </>
                              ) : recurso.tipoRecurso === 'FORO' ? (
                                <>
                                  <Recurso>{recurso.nombre === null ? '(null)' : recurso.nombre}</Recurso>
                                  {puedeAdministrarCursos(location.pathname) && (
                                    <>
                                      <span
                                        title="Modificar foro"
                                        style={{ cursor: 'pointer', marginLeft: '10px', color: '#ffd000', fontSize: '18px' }}
                                        onClick={e => {
                                          e.stopPropagation();
                                          editarForo(recurso.id, seccion.id);
                                        }}
                                      >
                                        ✏️
                                      </span>
                                      <span
                                        title="Eliminar foro"
                                        style={{ cursor: 'pointer', marginLeft: '8px', color: '#ff0000', fontSize: '18px' }}
                                        onClick={e => {
                                          e.stopPropagation();
                                          eliminarForo(recurso.id);
                                        }}
                                      >
                                        ❌
                                      </span>
                                    </>
                                  )}
                                </>
                              ) : recurso.tipoRecurso === 'PAGINA_TEMATICA' ? (
                                <>
                                  <span style={{color:'#222', cursor: 'pointer'}} onClick={() => verPagina(recurso.id, seccion.id)}>{recurso.nombre === null ? '(null)' : recurso.nombre}</span>
                                  <button
                                    style={{color:'#fff', background:'#007bff', border:'none', borderRadius:'4px', fontSize:'14px', cursor:'pointer', padding:'4px 12px', marginLeft:'10px', display:'flex', alignItems:'center', gap:'4px'}}
                                    onClick={() => verPagina(recurso.id, seccion.id)}
                                  >
                                    Ver
                                  </button>
                                  {puedeAdministrarCursos(location.pathname) && (
                                    <>
                                      <button
                                        style={{color:'#fff', background:'#ffd000', border:'none', borderRadius:'4px', fontSize:'14px', cursor:'pointer', padding:'4px 12px', marginLeft:'10px', display:'flex', alignItems:'center', gap:'4px'}}
                                        onClick={() => editarPagina(recurso.id)}
                                      >
                                        Editar
                                      </button>
                                      <button
                                        style={{color:'#fff', background:'#ff0000', border:'none', borderRadius:'4px', fontSize:'14px', cursor:'pointer', padding:'4px 12px', marginLeft:'10px', display:'flex', alignItems:'center', gap:'4px'}}
                                        onClick={() => handleAbrirModal(recurso.id)}
                                      >
                                        Eliminar
                                      </button>
                                    </>
                                  )}
                                </>
                              ) : recurso.tipoRecurso === 'TAREA' ? (
                                <>
                                  <Recurso onClick={() => verTarea(recurso.id)} >{recurso.nombre === null ? '(null)' : recurso.nombre}</Recurso>
                                  {puedeAdministrarCursos(location.pathname) && (
                                    <button
                                      style={{color:'#fff', background:'#28a745', border:'none', borderRadius:'4px', fontSize:'14px', cursor:'pointer', padding:'4px 12px', marginLeft:'6px', display:'flex', alignItems:'center', gap:'4px'}}
                                      onClick={e => {
                                        e.stopPropagation();
                                        verEntregasTarea(recurso.id, seccion.id);
                                      }}
                                    >
                                      Ver entregas
                                    </button>
                                  )}
                                  {puedeAdministrarCursos(location.pathname) && (
                                    <>
                                      <span
                                        title="Modificar tarea"
                                        style={{ cursor: 'pointer', marginLeft: '10px', color: '#ffd000', fontSize: '18px' }}
                                        onClick={e => {
                                          e.stopPropagation();
                                          editarTarea(recurso.id);
                                        }}
                                      >
                                        ✏️
                                      </span>
                                      <span
                                        title="Eliminar tarea"
                                        style={{ cursor: 'pointer', marginLeft: '8px', color: '#ff0000', fontSize: '18px' }}
                                        onClick={e => {
                                          e.stopPropagation();
                                          eliminarTarea(recurso.id);
                                        }}
                                      >
                                        ❌
                                      </span>
                                    </>
                                  )}
                                </>
                              ): recurso.tipoRecurso === 'FORO' ? (
                                <>
                                  <Recurso onClick={() => verForo(recurso.id)} >{recurso.nombre === null ? '(null)' : recurso.nombre}</Recurso>
                                  
                                </>
                              ) : (
                                <span style={{color:'#222'}}>Recurso sin tipo</span>
                              )}
                            </li>
                          ))
                        ) : (
                          <li style={{color:'#999'}}>No hay recursos en esta sección.</li>
                        )}
                      </ul>
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
  </S.Container>
  )
}

export default PaginaCurso;