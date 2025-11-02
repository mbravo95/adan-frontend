import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ModalConfirmacion from "../general/ModalConfirmacion";
import Spinner from "../general/Spinner";
import useCursoData from "../hooks/useCursoData"; 
import Secciones from "./Secciones";
import * as S from "./EstilosPaginaCurso"; 

const PaginaCurso = () => {
    const { codigo } = useParams();
    const navigate = useNavigate();
    
    const { 
        cursoActual, 
        secciones, 
        recursosPorSeccion, 
        loadingSecciones, 
        seccionesColapsadas, 
        toggleSeccion,
        setLoadingSecciones, 
        setSecciones, 
        setRecursosPorSeccion,
        refetchDatos,
    } = useCursoData(codigo); 


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idEliminar, setIdEliminar] = useState(null);
    const [tipoEliminar, setTipoEliminar] = useState(null);
    

    const irAltaSeccion = () => navigate(`/curso/${codigo}/alta-seccion`);
    const verParticipantes = () => navigate(`/curso/${codigo}/participantes`, { state: { cursoActual } });

  
    const handleAbrirModal = (id, tipo) => {
        setIdEliminar(id);
        setTipoEliminar(tipo);
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

    return (
        <S.Container>
            <S.Sidebar>
                <S.CourseTitle>
                    {cursoActual.nombre}
                </S.CourseTitle>
                
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                    Código: {cursoActual.codigo}
                </div>
                
                <S.ParticipantsButton onClick={verParticipantes}>
                    Participantes
                </S.ParticipantsButton>
                
                <S.IndexSection>
                    <S.IndexTitle>Indice del Curso</S.IndexTitle>
                    <S.IndexList>
                        {secciones.length > 0 ? (
                            secciones.map((seccion, idx) => (
                                <S.IndexItem
                                    key={seccion.id}
                                    onClick={() => toggleSeccion(seccion.id)}
                                >
                                    {seccion.titulo || `Sección ${idx + 1}`}
                                </S.IndexItem>
                            ))
                        ) : (
                            <S.IndexItem style={{ color: '#999' }}>Sin secciones</S.IndexItem>
                        )}
                    </S.IndexList>
                </S.IndexSection>
            </S.Sidebar>

            <ModalConfirmacion
                isOpen={isModalOpen}
                message={tipoEliminar === 'seccion' ? `¿Estás seguro de que quieres eliminar esta sección?` : `¿Estás seguro de que quieres eliminar este recurso?`}
                onConfirm={handleBorrar}
                onCancel={handleCancelar}
                isLoading={loadingSecciones}
            />
            
            <S.MainContent>
                <S.CourseInfoHeader>
                    <S.CourseInfoGrid>
                        <S.InfoSection>
                            <S.InfoLabel>Nombre del Curso</S.InfoLabel>
                            <S.InfoValue>{cursoActual.nombre}</S.InfoValue>
                        </S.InfoSection>
                        <S.InfoSection>
                            <S.InfoLabel>Profesores</S.InfoLabel>
                            <S.InfoValue>{Array.isArray(cursoActual.profesores) 
                                          ? cursoActual.profesores.join(', ') 
                                          : cursoActual.profesores || "Sin profesores"}
                            </S.InfoValue>
                        </S.InfoSection>
                        <S.InfoSection>
                            <S.InfoLabel>Turno</S.InfoLabel>
                            <S.InfoValue>{cursoActual.turno || "Sin turno"}</S.InfoValue>
                        </S.InfoSection>
                    </S.CourseInfoGrid>
                </S.CourseInfoHeader>
                
                <S.AddSectionButton onClick={irAltaSeccion}>
                    + Agregar Sección
                </S.AddSectionButton>
                
                <S.SectionsContainer>
                    {loadingSecciones ? (
                        <Spinner />
                    ) : secciones.length > 0 ? (
                        secciones.map((seccion) => (
                            <Secciones
                                key={seccion.id}
                                seccion={seccion}
                                recursos={recursosPorSeccion[seccion.id] || []}
                                collapsed={seccionesColapsadas[seccion.id] ?? true}
                                toggle={toggleSeccion}
                                cursoCodigo={codigo}
                                handleAbrirModal={handleAbrirModal} // Pasa el handler de la modal
                                setLoadingSecciones={setLoadingSecciones}
                                setRecursosPorSeccion={setRecursosPorSeccion} // Permite actualizar el estado de recursos
                            />
                        ))
                    ) : (
                        <S.NoSectionsMessage>
                            <h3>No hay secciones creadas</h3>
                            <p>Aún no se han creado secciones para este curso.</p>
                            <p>Utiliza el botón "Agregar Sección" para crear la primera sección.</p>
                        </S.NoSectionsMessage>
                    )}
                </S.SectionsContainer>
            </S.MainContent>
        </S.Container>
    )
}

export default PaginaCurso;