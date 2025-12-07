import { useEffect, useState } from "react";
import axios from "axios";
import styled, { css } from 'styled-components';
import useAuth from "../hooks/useAuth";
import Spinner from '../general/Spinner';

const DEFAULT_AVATAR_URL = "/header/avatar.png";

const construirUrlFoto = (fotoPerfil) => {
    if (!fotoPerfil) return DEFAULT_AVATAR_URL;
    
    if (fotoPerfil.startsWith('http')) {
        return fotoPerfil;
    }
    
    const baseUrl = import.meta.env.VITE_BACKEND_URL
        .replace(/\/api$/, '')
        .replace(/\/api\/$/, '');
    
    return `${baseUrl}${fotoPerfil}`;
};

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

    const calcularPromedio = () => {
        const calificacionesValidas = calificacionesData.filter(c => c.calificacionCurso !== null);
        if (calificacionesValidas.length === 0) return null;
        const suma = calificacionesValidas.reduce((acc, c) => acc + parseFloat(c.calificacionCurso), 0);
        return (suma / calificacionesValidas.length).toFixed(1);
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
                        nombreCurso: curso.nombreCurso,
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

    const promedio = calcularPromedio();

    return (
        <CalificacionesContainer>
            <ContentWrapper>
                <CardContainer>
                    <PerfilHeader>
                        <AvatarPerfil src={profile.fotoPerfil || "/header/avatar.png"} alt="Avatar" />
                        <PerfilInfo>
                            <NombreCompleto>
                                {profile.nombres} {profile.apellidos}
                            </NombreCompleto>
                            <PerfilSubtitulo>{profile.correo}</PerfilSubtitulo>
                        </PerfilInfo>
                        {promedio && (
                            <PromedioCard>
                                <PromedioLabel>Promedio General</PromedioLabel>
                                <PromedioValor $valor={parseFloat(promedio)}>
                                    {promedio}
                                </PromedioValor>
                            </PromedioCard>
                        )}
                    </PerfilHeader>

                    <CalificacionesSection>
                        <CalificacionesTitulo>Mis calificaciones</CalificacionesTitulo>
                        
                        {cargando ? (
                            <SpinnerContainer>
                                <Spinner />
                            </SpinnerContainer>
                        ) : calificacionesData.length === 0 ? (
                            <EmptyState>
                                <EmptyText>No hay calificaciones disponibles</EmptyText>
                            </EmptyState>
                        ) : (
                            <CursosLista>
                                {calificacionesData.map(curso => (
                                    <CursoItem key={curso.id}>
                                        <CursoHeader 
                                            onClick={() => handleToggle(curso.id)}
                                            $expandido={expandedCourse === curso.id}
                                        >
                                            <CursoNombre>
                                                <ChevronIcono $expandido={expandedCourse === curso.id}>
                                                    ▶
                                                </ChevronIcono>
                                                <span>{curso.nombreCurso}</span>
                                            </CursoNombre>
                                            <CursoDetalles>
                                                <CalificacionTexto $valor={curso.calificacionCurso}>
                                                    {curso.calificacionCurso !== null ? curso.calificacionCurso : 'Sin calificar'}
                                                </CalificacionTexto>
                                                <FechaTexto>
                                                    {curso.fechaCalificado ? formatearFecha(curso.fechaCalificado) : '-'}
                                                </FechaTexto>
                                            </CursoDetalles>
                                        </CursoHeader>

                                        {expandedCourse === curso.id && (
                                            <EntregablesContainer>
                                                {curso.entregables.length > 0 ? (
                                                    <>
                                                        <EntregablesHeader>
                                                            <HeaderCol width="50%">Nombre de la Tarea</HeaderCol>
                                                            <HeaderCol width="30%">Calificación</HeaderCol>
                                                            <HeaderCol width="20%">Fecha de Entrega</HeaderCol>
                                                        </EntregablesHeader>
                                                        {curso.entregables.map((entregable, idx) => (
                                                            <EntregableItem key={idx}>
                                                                <EntregableCol width="50%">
                                                                    <TareaIcono>
                                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M8.75 1.25H3.75C3.41848 1.25 3.10054 1.3817 2.86612 1.61612C2.6317 1.85054 2.5 2.16848 2.5 2.5V12.5C2.5 12.8315 2.6317 13.1495 2.86612 13.3839C3.10054 13.6183 3.41848 13.75 3.75 13.75H11.25C11.5815 13.75 11.8995 13.6183 12.1339 13.3839C12.3683 13.1495 12.5 12.8315 12.5 12.5V5M8.75 1.25L12.5 5M8.75 1.25L8.75 5H12.5M10 8.125H5M10 10.625H5M6.25 5.625H5" stroke="#1E1E1E" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                                                                        </svg>
                                                                    </TareaIcono>
                                                                    {entregable.tarea}
                                                                </EntregableCol>
                                                                <EntregableCol width="30%">
                                                                    <CalificacionTexto $valor={entregable.calificacionEntregable}>
                                                                        {entregable.calificacionEntregable !== null ? entregable.calificacionEntregable : 'Sin calificar'}
                                                                    </CalificacionTexto>
                                                                </EntregableCol>
                                                                <EntregableCol width="20%">
                                                                    {entregable.fechaEntrega ? formatearFecha(entregable.fechaEntrega) : '-'}
                                                                </EntregableCol>
                                                            </EntregableItem>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <EmptyEntregables>
                                                        No hay tareas registradas para este curso
                                                    </EmptyEntregables>
                                                )}
                                            </EntregablesContainer>
                                        )}
                                    </CursoItem>
                                ))}
                            </CursosLista>
                        )}
                    </CalificacionesSection>
                </CardContainer>
            </ContentWrapper>
        </CalificacionesContainer>
    );
}

export default CalificacionesCurso;


const CalificacionesContainer = styled.div`
    background-color: #9DCBD7;
    min-height: 100vh;
    width: 100%;
    padding: 90px 20px 40px;
    box-sizing: border-box;
`;

const ContentWrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

const CardContainer = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const PerfilHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 30px;
    background-color: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    gap: 20px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

const AvatarPerfil = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
`;

const PerfilInfo = styled.div`
    flex: 1;
    min-width: 200px;
`;

const NombreCompleto = styled.h1`
    font-size: 1.8em;
    color: #333;
    margin: 0 0 5px 0;
    font-weight: 600;
`;

const PerfilSubtitulo = styled.p`
    font-size: 1em;
    color: #6c757d;
    margin: 0;
`;

const PromedioCard = styled.div`
    background: white;
    padding: 15px 25px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 2px solid #e9ecef;
    min-width: 140px;
`;

const PromedioLabel = styled.div`
    font-size: 0.8em;
    color: #6c757d;
    margin-bottom: 5px;
    font-weight: 600;
    text-transform: uppercase;
`;

const PromedioValor = styled.div`
    font-size: 2em;
    font-weight: 700;
    color: ${props => {
        const val = props.$valor;
        if (val >= 6) return '#28a745';
        return '#d9534f';
    }};
`;

const CalificacionesSection = styled.div`
    padding: 30px;
`;

const CalificacionesTitulo = styled.h2`
    font-size: 1.5em;
    color: #333;
    margin: 0 0 25px 0;
    font-weight: 600;
`;

const SpinnerContainer = styled.div`
    padding: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const EmptyState = styled.div`
    padding: 60px;
    text-align: center;
`;

const EmptyText = styled.p`
    font-size: 1.1em;
    color: #6c757d;
`;

const CursosLista = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const CursoItem = styled.div`
    background: #fafafa;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
`;

const CursoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    cursor: pointer;
    background: ${props => props.$expandido ? 'white' : '#fafafa'};
    transition: background 0.2s ease;

    &:hover {
        background: white;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
`;

const CursoNombre = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.05em;
    font-weight: 600;
    color: #333;
    flex: 1;
`;

const ChevronIcono = styled.span`
    font-size: 0.7em;
    color: #6c757d;
    transition: transform 0.2s ease;
    transform: ${props => props.$expandido ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

const CursoDetalles = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: space-between;
        padding-left: 25px;
    }
`;

const CalificacionTexto = styled.span`
    font-weight: 700;
    font-size: 1.05em;
    min-width: 90px;
    text-align: left;
    color: ${props => {
        if (props.$valor === null) return '#aaa';
        const val = parseFloat(props.$valor);
        if (val >= 6) return '#28a745';
        return '#d9534f';
    }};
`;

const FechaTexto = styled.span`
    font-size: 0.9em;
    color: #6c757d;
    min-width: 140px;
`;

const EntregablesContainer = styled.div`
    background: white;
    padding: 15px 20px;
    border-top: 1px solid #e9ecef;
`;

const EntregablesHeader = styled.div`
    display: flex;
    padding: 10px 0;
    margin-bottom: 8px;
    border-bottom: 1px solid #e9ecef;
    font-weight: 600;
    font-size: 0.85em;
    color: #6c757d;
    text-transform: uppercase;
`;

const HeaderCol = styled.div`
    width: ${props => props.width};
`;

const EntregableItem = styled.div`
    display: flex;
    padding: 12px 0;
    border-bottom: 1px dashed #e9ecef;

    &:last-child {
        border-bottom: none;
    }
`;

const EntregableCol = styled.div`
    width: ${props => props.width};
    display: flex;
    align-items: center;
    font-size: 0.95em;
    color: #555;

    svg {
		display: block;
	}
`;

const TareaIcono = styled.span`
    margin-right: 8px;
    
`;

const EmptyEntregables = styled.div`
    padding: 20px;
    text-align: center;
    color: #6c757d;
    font-style: italic;
`;