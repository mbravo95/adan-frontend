import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const VerCurso = () => {

  const [curso, setCurso] = useState({});

  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  // Parche BORRAR
  const secciones = [{id: 152, titulo: 'Tema 1', codigoCurso: 'CALC1', visible: true, recursos: []},
                                       {id: 153, titulo: 'Tema 2', codigoCurso: 'CALC1', visible: true, recursos: []},
                                       {id: 154, titulo: 'Tema 3', codigoCurso: 'CALC1', visible: true, recursos: []}];

  useEffect(() => {

    const cargarCurso = async() => {
        try {
            const urlBase = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${urlBase}/cursos/${id}`, config);
            setCurso(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    cargarCurso();
  },[]);

  const crearTarea = (seccionid) => {
    const { id } = curso;
    navigate(`/crear-tarea`, { state: { seccionid, id}, replace: true });
  }

  const crearForo = (seccionid) => {
    const { id } = curso;
    navigate(`/crear-foro`, { state: { seccionid, id}, replace: true });
  }

  return (
    <>
        <h1>{curso.nombre}</h1>
        {secciones.map((seccion, index) => (
            <ul key={seccion.id}>
                <li>
                    {seccion.titulo}
                </li>
                <li>
                    <button type="button" onClick={() => crearTarea(seccion.id)}>Crear tarea</button>
                </li>
                <li>
                    <button type="button" onClick={() => crearForo(seccion.id)}>Crear foro</button>
                </li>
            </ul>
          ))}
    </>
  )
}

export default VerCurso