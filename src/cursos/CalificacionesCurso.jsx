import { useEffect, useState } from "react";
import axios from "axios";
import styled, { css } from 'styled-components';
import useAuth from "../hooks/useAuth";
import Spinner from '../general/Spinner';

const CalificacionesCurso = () => {

    const [cargando, setCargando] = useState(false);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [calificacionesData, setCalificacionesData] = useState([]);

    const { profile } = useAuth();

    const handleToggle = (cursoId) => {
        setExpandedCourse(prevId => prevId === cursoId ? null : cursoId);
    };

      const formatearFecha = (fechaString) => {
        if (!fechaString) return "No disponible";
        try {
            const date = new Date(fechaString);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',  
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false,
            };
            return date.toLocaleDateString('es-ES', options);
        } catch (error) {
            console.log(error);
            return fechaString;
        }
    };

    useEffect(() => {
        const cargarListados = async () => {
            if(!profile.id) return;
            try {
                setCargando(true);
                const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const [resCursos, resEntregables] = await Promise.all([
                    axios.get(`${urlBase}/calificaciones/usuario/${profile.id}/cursos`, config),
                    axios.get(`${urlBase}/calificaciones/usuario/${profile.id}/entregables`, config)
                ]);
                const datosCursos = resCursos.data;
                const datosEntregables = resEntregables.data;
                const entregablesPorCurso = datosEntregables.reduce((acc, entregable) => {
                    const cursoId = entregable.curso;
                    if (!acc[cursoId]) {
                        acc[cursoId] = [];
                    }
                    acc[cursoId].push(entregable);
                    return acc;
                }, {});

                
                const calificacionesNormalizadas = datosCursos.map((curso, index) => {
                    const cursoId = curso.curso;
                    
                    return {
                        id: index,
                        nombreCurso: curso.curso,
                        calificacionCurso: curso.calificacionFinal,
                        fechaCalificado: curso.fechaCalificacion,
                        entregables: entregablesPorCurso[cursoId] || [] 
                    };
                });

                setCalificacionesData(calificacionesNormalizadas);
            } catch (error) {
                console.log(error);
            } finally {
                setCargando(false);
            }
        };

        cargarListados();
    }, [profile]);

  return (
    <>
        <CalificacionesContainer>
            <CardContainer>
                <PerfilHeader>
                    <AvatarPerfil fotoUrl={profile.fotoPerfil} />
                    <div>
                        <NombreCompleto>
                            {profile.nombres} {profile.apellidos} 
                        </NombreCompleto>
                    </div>
                </PerfilHeader>
                <CalificacionesTitulo>Calificaciones</CalificacionesTitulo>
                <TablaContenedor>
                    {cargando ? <Spinner /> : 
                        <Tabla>
                            <TablaHeader>
                                <tr>
                                    <th style={{ width: '60%' }}>Ítem de Calificación</th>
                                    <th style={{ width: '20%' }}>Calificación</th>
                                    <th style={{ width: '20%' }}>Fecha de Calificación</th>
                                </tr>
                            </TablaHeader>
                            <tbody>
                                {calificacionesData.map(curso => (
                                    <>
                                        <TablaFilaCurso 
                                            key={curso.id} 
                                            onClick={() => handleToggle(curso.id)}
                                        >
                                            <td>
                                                <ChevronIcono $expandido={expandedCourse === curso.id}>
                                                    ▶
                                                </ChevronIcono>
                                                {curso.nombreCurso}
                                            </td>
                                            <td>
                                                <TextoCalificacion 
                                                    $estado={curso.calificacionCurso === null ? 'Sin calificar' : curso.calificacionCurso}
                                                >
                                                    {curso.calificacionCurso !== null ? curso.calificacionCurso : 'Sin calificar'}
                                                </TextoCalificacion>
                                            </td>
                                            <td>{formatearFecha(curso.fechaCalificado) || '-'}</td>
                                        </TablaFilaCurso>

                                        {expandedCourse === curso.id &&
                                            <TablaFilaEntregableHeader>
                                                <td style={{ paddingLeft: '40px' }}>Nombre de la Tarea</td>
                                                <td>Calificación</td>
                                                <td>Fecha de Entrega</td> {/* Titulo ajustado */}
                                            </TablaFilaEntregableHeader>
                                        }
                                        
                                        
                                        {expandedCourse === curso.id && curso.entregables.map(entregable => (
                                            <TablaFilaEntregable key={entregable.tarea}>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📄 {entregable.tarea}</td>
                                                <td>
                                                    <TextoCalificacion 
                                                        $estado={entregable.calificacionEntregable === null ? 'Sin calificar' : entregable.calificacionEntregable}
                                                    >
                                                        {entregable.calificacionEntregable !== null ? entregable.calificacionEntregable : 'Sin calificar'}
                                                    </TextoCalificacion>
                                                </td>
                                                <td>{formatearFecha(entregable.fechaEntrega) || '-'}</td>
                                            </TablaFilaEntregable>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </Tabla>
                    }
                </TablaContenedor>
            </CardContainer>
        </CalificacionesContainer>
    </>
  )
}

export default CalificacionesCurso;



const DEFAULT_AVATAR_URL = "/header/avatar.png";

const CalificacionesContainer = styled.div`
    background-color: #9DCBD7;
    min-height: 100vh;
    width: 100%;
    /*margin-top: 70px;*/
    display: flex;
    box-sizing: border-box;
`;

const CardContainer = styled.div`
    max-width: 1000px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-top: 90px;
    margin-bottom: 20px;
`;


const PerfilHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 20px 30px;
    background-color: #fcfcfc;
    border-bottom: 1px solid #eee;
`;

const AvatarPerfil = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #ccc;
    margin-right: 20px;
    flex-shrink: 0;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
    background-image: ${props => props.fotoUrl && props.fotoUrl !== DEFAULT_AVATAR_URL 
        ? `url(${props.fotoUrl})` 
        : `url(${DEFAULT_AVATAR_URL})`
    };

    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b5998;
    font-size: 2.5em; 
`;

const NombreCompleto = styled.h1`
    font-size: 1.8em;
    color: #333;
    margin: 0;
`;

const CalificacionesTitulo = styled.h2`
    font-size: 1.5em;
    color: #333;
    padding: 20px 30px 10px;
    margin: 0;
`;

const TablaContenedor = styled.div`
    padding: 0 30px 30px;
`;

const Tabla = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95em;
`;

const TablaHeader = styled.thead`
    border-bottom: 2px solid #ddd;
    th {
        font-weight: 600;
        color: #555;
        text-align: left;
        padding: 12px 10px;
    }
`;

const TablaFilaCurso = styled.tr`
    background-color: #fafafa;
    border-top: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #f0f0f0;
    }
    
    td {
        padding: 12px 10px;
        font-weight: bold;
        color: #333;
    }
`;

const TablaFilaEntregable = styled.tr`
    background-color: #fff;
    border-bottom: 1px dashed #eee;
    
    td {
        padding: 8px 10px;
        color: #666;
    }
    &:last-child {
        border-bottom: none;
    }
`;

const ChevronIcono = styled.span`
    margin-right: 8px;
    font-size: 0.8em;
    display: inline-block;
    transition: transform 0.2s;
    
    ${props => 
        props.$expandido && 
        css`
            transform: rotate(90deg);
        `
    }
`;

const TextoCalificacion = styled.span`
    font-weight: bold;
    color: ${props => 
        props.$estado === 'Sin calificar' 
            ? '#aaa' 
            : (props.$estado !== null && !isNaN(props.$estado) && props.$estado < 6 
                ? '#d9534f' 
                : (props.$estado !== null && !isNaN(props.$estado) && props.$estado >= 6 
                    ? '#28a745' 
                    : '#333'))
    };
`;

const TablaFilaEntregableHeader = styled.tr`
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
    
    td {
        padding: 8px 10px;
        font-weight: 600;
        color: #777;
        font-size: 0.85em;
    }
`;