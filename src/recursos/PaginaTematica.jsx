import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import Spinner from "../general/Spinner";


const PaginaTematica = () => {

    const [titulo,  setTitulo] = useState("");
    const [contenido,  setContenido] = useState("");
    const { codigo, paginaId } = useParams();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const cargarPaginaTematica = async () => {
            try {
                setLoading(true);
                const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${urlBase}/recursos/${paginaId}`, config);
                const pagina = response.data;
                const { nombre, urlHtml } = pagina;
                setTitulo(nombre);
                setContenido(urlHtml);
            } catch (error) {
                console.error("Error al obtener los datos de la página temática:", error);
                toast.error("Error al cargar la página temática", {
                          position: "top-center",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                      });
            } finally {
                setLoading(false);
            }
        };
        cargarPaginaTematica();
    }, []);

    const onVolver = () => {
        navigate(`/curso/${codigo}`);
    };


  return (
    <>
            <PaginaContenedor>
                {loading && <Spinner />}
                {!loading &&
                    <ContenidoCard>
                        <TituloPagina>{titulo}</TituloPagina>
                        
                        <HtmlContenedor dangerouslySetInnerHTML={{ __html: contenido }} />
                        
                        <BotonVolver onClick={onVolver}>
                        ← Volver al Curso
                        </BotonVolver>
                    </ContenidoCard>
                }
            </PaginaContenedor>
    </>
  )
}

export default PaginaTematica;


const PaginaContenedor = styled.div`
    background-color: #f7f7f7;
    min-height: 100vh;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;


const ContenidoCard = styled.div`
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 30px;
    display: flex;
    flex-direction: column;
`;

const TituloPagina = styled.h1`
    font-size: 2em;
    color: #333;
    margin-bottom: 25px;
    text-align: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
    width: 100%;
    max-width: 800px;
`;


const HtmlContenedor = styled.div`
    background-color: #2c3e50;
    color: #ecf0f1;
    border-radius: 8px;
    padding: 25px;
    margin-top: 20px;
    margin-bottom: 30px;
    overflow-x: auto;
    line-height: 1.6;
    font-family: 'Roboto Mono', monospace;

    h1, h2, h3, h4, h5, h6 {
        color: #ecf0f1;
        margin-top: 1.5em;
        margin-bottom: 0.8em;
    }
    p {
        margin-bottom: 1em;
    }
    a {
        color: #8ce1e5;
        text-decoration: underline;
    }
    ul, ol {
        margin-left: 20px;
        margin-bottom: 1em;
    }
    pre {
        background-color: #34495e;
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
    }
    code {
        background-color: #34495e;
        padding: 2px 4px;
        border-radius: 3px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1.5em;
        margin-bottom: 1.5em;
    }
    th, td {
        border: 1px solid #4a6a81;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #3a5369;
    }
`;


const BotonVolver = styled.button`
    background-color: #3b5998;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    align-self: center;
    margin-top: 20px;

    &:hover {
        background-color: #2b4480;
        transform: translateY(-1px);
    }
    &:active {
        transform: translateY(0);
    }
`;