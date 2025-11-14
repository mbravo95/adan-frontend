import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import * as S from './EstilosPaginaCurso';
import useCursoData from "../hooks/useCursoData";
import Spinner from "../general/Spinner";

const Secciones = ({ 
    seccion, 
    recursos, 
    collapsed, 
    toggle, 
    cursoCodigo, 
    handleAbrirModal,
    setLoadingSecciones,
    setRecursosPorSeccion
}) => {
    
    const navigate = useNavigate();

    const { esProfesor, loadingSecciones } = useCursoData(cursoCodigo);
    const rol = localStorage.getItem("tipo");

    const agregarTarea = () => navigate(`/curso/${cursoCodigo}/${seccion.id}/crear-tarea`);
    const agregarForo = () => navigate(`/curso/${cursoCodigo}/${seccion.id}/crear-foro`);
    const agregarPagina = () => navigate(`/curso/${cursoCodigo}/${seccion.id}/crear-pagina`);
    const irSubirMaterial = () => navigate(`/curso/${cursoCodigo}/${seccion.id}/subir-material`);
    const editarPagina = (recursoId) => navigate(`/curso/${cursoCodigo}/pagina/${recursoId}/editar`);
    const verTarea = (recursoId) => navigate(`/curso/${cursoCodigo}/tarea/${recursoId}`);
    const verForo = (recursoId) => navigate(`/curso/${cursoCodigo}/foro/${recursoId}`);
    const verPagina = (recursoId) => navigate(`/curso/${cursoCodigo}/pagina/${recursoId}`);
    const modificarSeccion = (seccionId) => navigate(`/curso/${cursoCodigo}/seccion/${seccionId}/editar`);
    

    const handleDescargarMaterial = async (recurso) => {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/recursos/cursos/${cursoCodigo}/secciones/${seccion.id}/materiales/${recurso.id}/descargar`;
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
          toast.error("No se pudo descargar el material");
        }
    };
    
    const handleEliminarSeccionClick = (e) => {
        e.stopPropagation();
        handleAbrirModal(seccion.id, 'seccion');
    }
    
    const handleEliminarPaginaClick = (e, recursoId) => {
        e.stopPropagation();
        handleAbrirModal(recursoId, 'pagina');
    }

    return (
        <S.SectionPlaceholder>
            <S.SectionHeader 
                collapsed={collapsed}
                onClick={() => toggle(seccion.id)}
            >
                <S.SectionTitleContainer>
                    <S.CollapseIcon collapsed={collapsed}>
                        ▼
                    </S.CollapseIcon>
                    <S.SectionTitle>{seccion.titulo || `Sección ${seccion.id}`}</S.SectionTitle>
                </S.SectionTitleContainer>
            </S.SectionHeader>
            
            {loadingSecciones && <Spinner />}
            {((esProfesor || rol == "ADMINISTRADOR") && !loadingSecciones) &&
                <S.ButtonGroup style={{ marginBottom: collapsed ? '0' : '10px' }}>
                    <S.ActionButton 
                        variant="success" 
                        onClick={(e) => { e.stopPropagation(); agregarTarea(); }}
                    >
                        Agregar Tarea
                    </S.ActionButton>
                    <S.ActionButton 
                        variant="info" 
                        onClick={(e) => { e.stopPropagation(); irSubirMaterial(); }}
                    >
                        Subir Material
                    </S.ActionButton>
                    <S.ActionButton 
                        variant="success" 
                        onClick={(e) => { e.stopPropagation(); agregarForo(); }}
                    >
                        Agregar Foro
                    </S.ActionButton>
                    <S.ActionButton 
                        variant="success" 
                        onClick={(e) => { e.stopPropagation(); agregarPagina(); }}
                    >
                        Agregar Pagina
                    </S.ActionButton>
                    <S.ActionButton 
                        variant="warning" 
                        onClick={(e) => { e.stopPropagation(); modificarSeccion(seccion.id); }}
                    >
                        Modificar sección
                    </S.ActionButton>
                    <S.ActionButton 
                        variant="danger" 
                        onClick={handleEliminarSeccionClick}
                    >
                        Eliminar sección
                    </S.ActionButton>
                </S.ButtonGroup>
            }

            <S.SectionContent collapsed={collapsed}>
                <S.SectionInfo>
                    <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                        {Array.isArray(recursos) && recursos.length > 0 ? (
                            recursos.map((recurso, idx, arr) => (
                                <li 
                                    key={recurso.id} 
                                    style={{paddingBottom: '8px', marginBottom: '8px', borderBottom: idx < arr.length - 1 ? '2px solid #222' : 'none', display:'flex', alignItems:'center', gap:'12px'}}
                                >
                                    {recurso.tipoRecurso === 'MATERIAL' ? (
                                        <>
                                            <span style={{color:'#222', display:'flex', alignItems:'center', gap:'6px'}}>
                                                <span role="img" aria-label="archivo">📄</span>
                                                {recurso.nombre === null ? '(null)' : recurso.nombre}
                                            </span>
                                            <button
                                                style={{color:'#fff', background:'#007bff', border:'none', borderRadius:'4px', fontSize:'14px', cursor:'pointer', padding:'4px 12px', marginLeft:'10px', display:'flex', alignItems:'center', gap:'4px'}}
                                                onClick={() => handleDescargarMaterial(recurso)}
                                            >
                                                Descargar
                                            </button>
                                        </>
                                    ) : recurso.tipoRecurso === 'PAGINA_TEMATICA' ? (
                                        <>
                                            <S.Recurso onClick={() => verPagina(recurso.id)} style={{color:'#222'}}>{recurso.nombre === null ? '(null)' : recurso.nombre}</S.Recurso>
                                            {(esProfesor || rol == "ADMINISTRADOR") &&<>
                                                <S.ActionButton
                                                    variant="warning"
                                                    onClick={() => editarPagina(recurso.id)}
                                                >
                                                    Editar
                                                </S.ActionButton>
                                                <S.ActionButton
                                                    variant="danger"
                                                    onClick={(e) => handleEliminarPaginaClick(e, recurso.id)}
                                                >
                                                    Eliminar
                                                </S.ActionButton>
                                            </>}
                                        </>
                                    ) : recurso.tipoRecurso === 'TAREA' ? (
                                        <S.Recurso onClick={() => verTarea(recurso.id)} >{recurso.nombre === null ? '(null)' : recurso.nombre}</S.Recurso>
                                    ): recurso.tipoRecurso === 'FORO' ? (
                                        <S.Recurso onClick={() => verForo(recurso.id)} >{recurso.nombre === null ? '(null)' : recurso.nombre}</S.Recurso>
                                    ) : (
                                        <span style={{color:'#222'}}>Recurso sin tipo</span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li style={{color:'#999'}}>No hay recursos en esta sección.</li>
                        )}
                    </ul>
                </S.SectionInfo>
            </S.SectionContent>
        </S.SectionPlaceholder>
    );
}

export default Secciones;