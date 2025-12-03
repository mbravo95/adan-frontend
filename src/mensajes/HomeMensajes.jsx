import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";
import ListaConversaciones from "./ListaConversaciones";
import Conversacion from "./Conversacion";
import ModalNuevaConversacion from "./ModalNuevaConversacion";
import Spinner from '../general/Spinner';
import useAuth from "../hooks/useAuth";


const construirUrlFoto = (fotoPerfil) => {
  if (!fotoPerfil) return "/header/avatar.png";
  
  if (fotoPerfil.startsWith('http')) {
    return fotoPerfil;
  }
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL
    .replace(/\/api$/, '')
    .replace(/\/api\/$/, '');
  
  return `${baseUrl}${fotoPerfil}`;
};

const HomeMensajes = () => {
  const [conversaciones, setConversaciones] = useState([]);
  const [nuevaConversacionModal, setNuevaConversacionModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [interlocutores, setInterlocutores] = useState([]);
  const [nuevoChat, setNuevoChat] = useState(false);
  const [busquedaConversacion, setBusquedaConversacion] = useState('');

  const { profile } = useAuth();

  const calcularTiempoTranscurrido = (fecha) => {
    const ahora = new Date();
    const fechaMensaje = new Date(fecha);
    const diferencia = ahora - fechaMensaje;
    
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);
    
    if (minutos < 1) return "ahora";
    if (minutos < 60) return `${minutos}m`;
    if (horas < 24) return `${horas}h`;
    return `${dias}d`;
  };

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
      const interlocutoresData = response.data;

      const idsInterlocutores = interlocutoresData.map(interlocutor => interlocutor.id);
      setInterlocutores(idsInterlocutores);

      const conversacionesFormateadas = interlocutoresData.map(interlocutor => ({
        id: interlocutor.id,
        participanteNombre: `${interlocutor.nombres || ''} ${interlocutor.apellidos || ''}`.trim(),
        ultimoMensaje: interlocutor.ultimoMensaje || "",
        tiempoTranscurrido: calcularTiempoTranscurrido(interlocutor.fechaUltimoMensaje),
        fotoPerfil: construirUrlFoto(interlocutor.fotoPerfil),
        esPropioUltimo: interlocutor.esPropioUltimo
      }));

      setConversaciones(conversacionesFormateadas);

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

  useEffect(() => {
    cargarConversaciones();
  }, []);

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

  const conversacionesFiltradas = conversaciones.filter(conv => 
    conv.participanteNombre.toLowerCase().includes(busquedaConversacion.toLowerCase())
  );

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
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 3.125V11.875M3.125 7.5H11.875" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Nueva conversación
          </BotonNuevaConversacion>
          
          <InputBusquedaContainer>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.25 13.125L8.3125 9.1875C8 9.4375 7.64062 9.63542 7.23437 9.78125C6.82812 9.92708 6.39583 10 5.9375 10C4.80208 10 3.84115 9.60677 3.05469 8.82031C2.26823 8.03385 1.875 7.07292 1.875 5.9375C1.875 4.80208 2.26823 3.84115 3.05469 3.05469C3.84115 2.26823 4.80208 1.875 5.9375 1.875C7.07292 1.875 8.03385 2.26823 8.82031 3.05469C9.60677 3.84115 10 4.80208 10 5.9375C10 6.39583 9.92708 6.82812 9.78125 7.23437C9.63542 7.64062 9.4375 8 9.1875 8.3125L13.125 12.25L12.25 13.125ZM5.9375 8.75C6.71875 8.75 7.38281 8.47656 7.92969 7.92969C8.47656 7.38281 8.75 6.71875 8.75 5.9375C8.75 5.15625 8.47656 4.49219 7.92969 3.94531C7.38281 3.39844 6.71875 3.125 5.9375 3.125C5.15625 3.125 4.49219 3.39844 3.94531 3.94531C3.39844 4.49219 3.125 5.15625 3.125 5.9375C3.125 6.71875 3.39844 7.38281 3.94531 7.92969C4.49219 8.47656 5.15625 8.75 5.9375 8.75Z" fill="#1D1B20"/>
            </svg>
            <InputBusqueda
                type="text"
                placeholder="Buscar..."
                value={busquedaConversacion}
                onChange={(e) => setBusquedaConversacion(e.target.value)}
            />
          </InputBusquedaContainer>

          {cargando && <Spinner />}
          {!cargando && conversacionesFiltradas.length === 0 && busquedaConversacion && (
            <MensajeSinResultados>No se encontraron conversaciones</MensajeSinResultados>
          )}
          {!cargando && (
            <ListaConversaciones
              conversaciones={conversacionesFiltradas}
              onSelect={handleSeleccionarConversacion}
              selectedId={usuarioSeleccionado}
            />
          )}
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
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background-color: #e5f1f7;
  overflow: hidden;
`;

const PanelIzquierdo = styled.div`
  width: 350px;
  min-width: 350px;
  background-color: #9dcbd7dd;
  border-right: 1px solid #ddd;
  padding: 15px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
`;

const BotonNuevaConversacion = styled.button`
  background-color: black;
  color: white;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 15px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #333;
  }
`;

const InputBusquedaContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 15px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    pointer-events: none;
  }
`;

const InputBusqueda = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 15px 0 40px;
  box-sizing: border-box;
  border-radius: 20px;
  border: 2px solid #333;
  font-size: 0.95em;
  background-color: #fff;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #919191ff;
  }

  &::placeholder {
    color: #999;
  }
`;

const MensajeSinResultados = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 0.9em;
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