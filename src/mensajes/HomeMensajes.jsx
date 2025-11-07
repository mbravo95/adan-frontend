import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";
import ListaConversaciones from "./ListaConversaciones";
import Conversacion from "./Conversacion";
import ModalNuevaConversacion from "./ModalNuevaConversacion";
import Spinner from '../general/Spinner';
import useAuth from "../hooks/useAuth";

const HomeMensajes = () => {
  const [conversaciones, setConversaciones] = useState([]);
  const [nuevaConversacionModal, setNuevaConversacionModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [interlocutores, setInterlocutores] = useState([]);
  const [nuevoChat, setNuevoChat] = useState(false);

  const cargarConversaciones = async () => {
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
          const response = await axios.get(`${urlBase}/mensajes-privados/conversaciones/interlocutores`, config);
          const interlocutoresResponse = response.data;
          setInterlocutores(interlocutoresResponse);

          const promesasDatosUsuario = interlocutoresResponse.map(interlocutorId => {
                return axios.get(`${urlBase}/usuarios/${interlocutorId}`, config);
            });

          const respuestasUsuarios = await Promise.all(promesasDatosUsuario);
          
          const obtenerConversaciones = respuestasUsuarios.map((response, index) => {
            const datosUsuario = response.data;
            return {
              id: datosUsuario.id,
              participanteNombre: `${datosUsuario.nombres || ''} ${datosUsuario.apellidos || ''}`.trim(),
              ultimoMensaje: "",
              tiempoTranscurrido: "",
              fotoPerfil: datosUsuario.fotoPerfil || "/header/avatar.png"
            };
        });
         setConversaciones(obtenerConversaciones);
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
        } finally {
          setCargando(false);
        }
    };

  const { profile } = useAuth();

  useEffect(() => {
    cargarConversaciones();
  },[]);

  const handleSeleccionarConversacion = (convId) => {
        setUsuarioSeleccionado(convId);
    };

  const handleModal = () => {
    setNuevaConversacionModal(!nuevaConversacionModal);
  }


  const handleNuevaConversacion = (user) => {
    setUsuarioSeleccionado(user.id);
    setNuevoChat(true);
  }

  const handleNuevoChat = () => {
    cargarConversaciones();
    setNuevoChat(false);
  }


  return (
        

            <>
                {nuevaConversacionModal && (
                        <ModalNuevaConversacion
                            onClose={handleModal}
                            onUsuarioSeleccionado={handleNuevaConversacion}
                            perfil={profile}
                            interlocutores={interlocutores}
                        />
                )}


                <MensajesLayout>
                    <PanelIzquierdo>
                        <BotonNuevaConversacion onClick={handleModal}>
                            + Nueva conversación
                        </BotonNuevaConversacion>
                        {cargando &&  <Spinner />}
                        {!cargando &&
                            <ListaConversaciones
                                conversaciones={conversaciones}
                                onSelect={handleSeleccionarConversacion}
                                selectedId={usuarioSeleccionado}
                            />
                        }
                    </PanelIzquierdo>

                    <PanelDerecho>
                        {usuarioSeleccionado ? (
                            <Conversacion
                                conversacionId={usuarioSeleccionado}
                                idUsuarioActual={profile.id}
                                esNuevaConversacion={nuevoChat}
                                onHandleNuevoChat={handleNuevoChat}
                                onHandleCerrarConversacion={() => setUsuarioSeleccionado(null)}
                                perfil={profile}
                            />
                        ) : (
                            <MensajeInicial>Selecciona una conversación</MensajeInicial>
                        )}
                    </PanelDerecho>
                </MensajesLayout>
            </>
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
    width: 350px;
    min-width: 300px;
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