import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

const AsignarDocente = () => {

    const [usuarios, setUsuarios] = useState([]);
    
    const navigate = useNavigate();
    const location = useLocation();
    const curso = location.state.curso;

    useEffect(() => {
        const listarUsuarios = async () => {
            try {
                const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${urlBase}/usuarios`, config);
                const usuariosData = response.data;
                const usuariosFiltrados = usuariosData.filter((usuario) => usuario.tipoUsuario === "USUARIO" && !usuario.cursosComoEstudiante.some((cursoEstudiante) => cursoEstudiante.id === curso.id) && !usuario.cursosComoProfesor.some((cursoProfesor) => cursoProfesor.id === curso.id));
                setUsuarios(usuariosFiltrados);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        };
        listarUsuarios();
    }, []);

  return (
    <>
        <h1>Asignar docente al curso {curso.nombre}</h1>
        <ul>
            {usuarios.map((usuario) => (
                <li key={usuario.id}>{usuario.nombre}</li>
            ))}
        </ul>
    </>
  )
}

export default AsignarDocente;