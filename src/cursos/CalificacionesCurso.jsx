import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const CalificacionesCurso = () => {

    const [cargando, setCargando] = useState(false);

    const { profile } = useAuth();

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
            const responseEntregables = await axios.get(`${urlBase}/calificaciones/usuario/${profile.id}/entregables`, config);
            console.log(responseEntregables);
            const responseCursos = await axios.get(`${urlBase}/calificaciones/usuario/${profile.id}/cursos`, config);
            console.log(responseCursos);
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
        <h1>Calificaciones del Curso</h1>
    </>
  )
}

export default CalificacionesCurso;