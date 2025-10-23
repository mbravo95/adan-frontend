import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const VerCurso = () => {

  const [curso, setCurso] = useState({});

  const params = useParams();
  const { id } = params;

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
            console.log(response);
            setCurso(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    cargarCurso();
  },[]);

  return (
    <>
        <h1>{curso.nombre}</h1>
    </>
  )
}

export default VerCurso