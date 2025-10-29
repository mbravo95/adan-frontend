import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";

const PaginaTarea = () => {

    const { codigo, tareaId } = useParams();

    useEffect(() => {
      const obtenerTarea = async () => {
        try {
          const urlBase = import.meta.env.VITE_BACKEND_URL;
          const token = localStorage.getItem("token");
          const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`${urlBase}/recursos/${tareaId}`, config);
          console.log(response);
        } catch (error) {
          console.error("Error al obtener los datos de la tarea:", error);
          toast.error("Error al cargar la tarea", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        }
      };

      obtenerTarea();
    }, []);

  return (
    <>
      <h1>Tarea</h1>
    </>
  )
}

export default PaginaTarea