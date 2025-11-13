import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth"; 

const initialCursoState = {
    id: null,
    nombre: "Cargando...",
    codigo: "codigoCurso"
};

// Contador global para rastrear invocaciones
const invocationCounter = {};

const useCursoData = (codigo) => {
    // Log de invocación por página
    const callerInfo = new Error().stack.split('\n')[2];
    const pageMatch = callerInfo.match(/([^\\\/]+\.jsx)/);
    const pageName = pageMatch ? pageMatch[1] : 'Unknown';
    
    if (!invocationCounter[pageName]) {
        invocationCounter[pageName] = 0;
    }
    invocationCounter[pageName]++;
    
    console.log(`[HOOK USAGE] useCursoData invocado en ${pageName} - Llamada #${invocationCounter[pageName]} (codigo: ${codigo})`);
    
    const [cursoActual, setCursoActual] = useState(initialCursoState);
    const [secciones, setSecciones] = useState([]);
    const [recursosPorSeccion, setRecursosPorSeccion] = useState({});
    const [loadingSecciones, setLoadingSecciones] = useState(true);
    const [seccionesColapsadas, setSeccionesColapsadas] = useState({});
    const [perteneceAlCursoState, setPerteneceAlCursoState] = useState(false);

  
    const { profile } = useAuth();
    const {nombres, apellidos, id} = profile;
    const nombreCompleto = `${nombres} ${apellidos}`;
    
    const esProfesor = useMemo(() => {
        const listaProfesores = cursoActual.profesores;
        
        if (!listaProfesores || loadingSecciones) {
            return false;
        }
        
        let nombresProfesores;

        if (Array.isArray(listaProfesores)) {
            nombresProfesores = listaProfesores.map(p => p.trim().toUpperCase());
        } else if (typeof listaProfesores === 'string') {
            nombresProfesores = listaProfesores
                .split(',')
                .map(p => p.trim().toUpperCase());
        } else {
            return false;
        }

        const usuarioMayusculas = nombreCompleto.trim().toUpperCase();
        return nombresProfesores.includes(usuarioMayusculas);
    },[cursoActual.profesores, nombreCompleto, loadingSecciones]);
    
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

    const obtenerDatosDelCurso = async () => {
        setLoadingSecciones(true);
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No hay token disponible.");
          setLoadingSecciones(false);
          return;
        }

        try {
           
            const cursoResponse = await axios.get(`${urlBase}/cursos/buscar?texto=${codigo}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const cursoEncontrado = Array.isArray(cursoResponse.data) ? cursoResponse.data[0] : cursoResponse.data;
            
            if (cursoEncontrado) {
                setCursoActual({
                    id: cursoEncontrado.id,
                    nombre: cursoEncontrado.nombre || "Curso sin nombre",
                    codigo: cursoEncontrado.codigo || "Sin código",
                    ...cursoEncontrado
                });
            } else {
                setCursoActual({ id: null, nombre: "Curso no encontrado", codigo: codigo });
            }

           
            const seccionesResponse = await axios.get(`${urlBase}/secciones`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const seccionesFiltradas = seccionesResponse.data.filter(seccion => 
                seccion.codigoCurso === codigo
            );
            
            setSecciones(seccionesFiltradas);
            
            
            seccionesFiltradas.forEach(seccion => {
                obtenerRecursosDeSeccion(seccion.id);
            });

            const response = await axios.get(`${urlBase}/cursos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const cursos = response.data;
            
            const idUsuarioLogueado = id;

            const cursoEncontradoArray = cursos.filter(curso => curso.codigo === codigo);

            if (cursoEncontradoArray.length > 0) {
                const cursoEncontrado = cursoEncontradoArray[0];
                const esProfesorDelCurso = (cursoEncontrado.profesores || []).some(p => p.id === idUsuarioLogueado);
                const esEstudianteDelCurso = (cursoEncontrado.estudiantes || []).some(e => e.id === idUsuarioLogueado);
                setPerteneceAlCursoState(esProfesorDelCurso || esEstudianteDelCurso);
            } else {
                setPerteneceAlCursoState(false);
            }

        } catch (error) {
            console.error("Error al obtener datos del curso:", error);
            setCursoActual({ id: null, nombre: "Error al cargar", codigo: "---" });
            setSecciones([]);
        } finally {
            setLoadingSecciones(false);
        }
    };

    
    const toggleSeccion = (seccionId) => {
      setSeccionesColapsadas(prev => ({
        ...prev,
        [seccionId]: !prev[seccionId]
      }));
    };

    const refetchDatos = () => {
        obtenerDatosDelCurso();
    };

    
    useEffect(() => {
        if (codigo) {
            obtenerDatosDelCurso();
        }
    }, [codigo]);

    useEffect(() => {
      if (secciones.length > 0) {
        const colapsadas = {};
        secciones.forEach(s => { 
            colapsadas[s.id] = true; 
        });
        setSeccionesColapsadas(colapsadas);
      }
    }, [secciones]);

    // Log del resumen de invocaciones cada 10 llamadas
    const totalInvocations = Object.values(invocationCounter).reduce((sum, count) => sum + count, 0);
    if (totalInvocations % 10 === 0) {
        console.log(`[HOOK SUMMARY] Resumen de useCursoData:`, invocationCounter);
    }

    return {
        cursoActual,
        secciones,
        recursosPorSeccion,
        loadingSecciones,
        seccionesColapsadas,
        setLoadingSecciones,
        setSecciones,
        setRecursosPorSeccion,
        toggleSeccion,
        refetchDatos,
        esProfesor,
        perteneceAlCursoState
    };
};

export default useCursoData;