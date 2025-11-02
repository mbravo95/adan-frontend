import { useState, useEffect } from "react";
import axios from "axios";

const initialCursoState = {
    id: null,
    nombre: "Cargando...",
    codigo: "codigoCurso"
};

const useCursoData = (codigo) => {
    const [cursoActual, setCursoActual] = useState(initialCursoState);
    const [secciones, setSecciones] = useState([]);
    const [recursosPorSeccion, setRecursosPorSeccion] = useState({});
    const [loadingSecciones, setLoadingSecciones] = useState(true);
    const [seccionesColapsadas, setSeccionesColapsadas] = useState({});

  
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
        refetchDatos
    };
};

export default useCursoData;