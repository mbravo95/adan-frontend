import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";
import ListaConversaciones from "./ListaConversaciones";
import Conversacion from "./Conversacion";

const HomeMensajes = () => {

  const [interlocutores, setInterlocutores] = useState([]);
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState(null);
  const [conversaciones, setConversaciones] = useState([]);

  useEffect(() => {
    const cargarConversaciones = async () => {
      try {
          const urlBase = import.meta.env.VITE_BACKEND_URL;
          const token = localStorage.getItem("token");
          const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`${urlBase}/mensajes-privados/conversaciones/interlocutores`, config);
          setInterlocutores(response.data);
          /*
          // Forzado de envio de mensaje
          const response3 = await axios.post(`${urlBase}/mensajes-privados`, {idDestinatario: 8, cuerpoMensaje: "Prueba mensaje"}, config);
          console.log(response3);
          */
         const conversas = [{id: 1, participanteNombre: "Jorge", ultimoMensaje: "10/11/2022", tiempoTranscurrido: "Hace tres años"}]
         setConversaciones(conversas);
        } catch (error) {
          console.error("Error al obtener las conversaciones: ", error);
          toast.error("Error al obtener las conversaciones", {
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

    cargarConversaciones();
  },[]);

  const handleSeleccionarConversacion = (convId) => {
        setConversacionSeleccionada(convId);
    };


  return (
        <MensajesLayout>
            <PanelIzquierdo>
                <BotonNuevaConversacion>
                    + Nueva conversación
                </BotonNuevaConversacion>
                <ListaConversaciones
                    conversaciones={conversaciones}
                    onSelect={handleSeleccionarConversacion}
                    selectedId={conversacionSeleccionada}
                />
            </PanelIzquierdo>

            <PanelDerecho>
                {conversacionSeleccionada ? (
                    <Conversacion
                        conversacionId={conversacionSeleccionada}
                        idUsuarioActual={100}
                    />
                ) : (
                    <MensajeInicial>Selecciona una conversación</MensajeInicial>
                )}
            </PanelDerecho>
        </MensajesLayout>
  )
}

export default HomeMensajes;

const MensajesLayout = styled.div`
    display: flex;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    height: calc(100vh - 60px);
    background-color: #e5f1f7;
`;

const PanelIzquierdo = styled.div`
    width: 300px;
    min-width: 280px;
    background-color: #fff;
    border-right: 1px solid #ddd;
    padding: 15px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
`;

const BotonNuevaConversacion = styled.button`
    background-color: #3b5998;
    color: white;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    border: none;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 15px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #2b4480;
    }
`;

const PanelDerecho = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #f7f7f7;
`;

const MensajeInicial = styled.div`
    padding: 20px;
    text-align: center;
    color: #999;
    font-size: 1.1em;
    margin-top: 50px;
`;