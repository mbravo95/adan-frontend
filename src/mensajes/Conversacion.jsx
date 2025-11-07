import { useEffect, useState } from 'react';
import styled, {css} from "styled-components";
import axios from "axios";
import Spinner from '../general/Spinner';

const Conversacion = ({ conversacionId, idUsuarioActual, esNuevaConversacion, onHandleNuevoChat }) => {

    const [mensajes, setMensajes] = useState([]);
    const [participanteNombre, setParticipanteNombre] = useState('Nombre Apellido');
    const [participanteAvatar, setParticipanteAvatar] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensajeNuevo, setMensajeNuevo] = useState('');

    useEffect(() => {
        const fetchConversacion = async () => {
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
                const response1 = await axios.get(`${urlBase}/usuarios/${conversacionId}`, config);
                const destinatario = response1.data;
                setParticipanteNombre(`${destinatario.nombres || ''} ${destinatario.apellidos || ''}`.trim());
                setParticipanteAvatar(destinatario.fotoPerfil || null);
                const response2 = await axios.get(`${urlBase}/mensajes-privados/conversacion/${conversacionId}`, config);
                setMensajes(response2.data);
            } catch (error) {
                console.error("Error al obtener la conversación: ", error);
            } finally {
                setCargando(false);
            }
        };

        fetchConversacion();
    }, [conversacionId, idUsuarioActual]);


    const handleEnviarMensaje = async () => {
        
        
        if (mensajeNuevo.trim() === '') return;

        try {
            const urlBase = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const payload = {
                idDestinatario: conversacionId,
                cuerpoMensaje: mensajeNuevo.trim(),
            };
            const response = await axios.post(`${urlBase}/mensajes-privados`, payload, config);
            setMensajes([...mensajes, response.data]);
            setMensajeNuevo('');
            if(esNuevaConversacion){
                onHandleNuevoChat();
            }
        } catch (error) {
            console.error("Error al enviar el mensaje: ", error);
        }
    }


  return (
    <>
        <HeaderChat>
            <BackButton>←</BackButton>
            <TitleChat>{participanteNombre}</TitleChat>
            <ProfileIcon />
        </HeaderChat>
        
        {cargando && <Spinner />}
        {!cargando &&
            <MensajesScrollable>
                {mensajes.map((msg) => {
                    const esMensajePropio = idUsuarioActual === msg.idRemitente;
                    return (
                        <MensajeBubble 
                            key={msg.id} 
                            $propio={esMensajePropio}
                        >
                            <ContenidoMensaje propio={esMensajePropio}>
                                {msg.cuerpoMensaje}
                            </ContenidoMensaje>
                            <AvatarChat propio={esMensajePropio} /> 
                        </MensajeBubble>
                    );
                })}
            </MensajesScrollable>
        }
        
        {!cargando &&
            <InputArea>
                <InputMensaje placeholder="Mensaje..." value={mensajeNuevo} 
                    onChange={(e) => setMensajeNuevo(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleEnviarMensaje();
                        }
                    }} 
                />
                <BotonEnviar onClick={handleEnviarMensaje}>
                    Enviar
                </BotonEnviar>
            </InputArea>
        }
    </>
  )
}

export default Conversacion;

const HeaderChat = styled.div`
    padding: 15px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: #333;
`;

const TitleChat = styled.div`
    font-size: 1.2em;
    font-weight: 600;
    color: #333;
`;

const ProfileIcon = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #bdbdbd;
    /* Icono de perfil aquí */
`;

const MensajesScrollable = styled.div`
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;


const MensajeBubble = styled.div`
    display: flex;
    margin-bottom: 15px;
    max-width: 70%;
    align-items: flex-end;

    ${props =>
        props.$propio
            ? css`
                  align-self: flex-end;
                  flex-direction: row-reverse;
              `
            : css`
                  align-self: flex-start;
                  flex-direction: row;
              `}
`;

const AvatarChat = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #bdbdbd;
    margin-right: 5px;
    
    ${props =>
        props.propio &&
        css`
            margin-left: 5px;
            margin-right: 0;
        `}
`;

const ContenidoMensaje = styled.div`
    padding: 10px 15px;
    border-radius: 18px;
    line-height: 1.4;
    word-wrap: break-word;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    color: #333;

    ${props =>
        props.propio
            ? css`
                  background-color: #8ce1e5;
                  border-bottom-right-radius: 3px;
              `
            : css`
                  background-color: #fff;
                  border-bottom-left-radius: 3px;
              `}
`;

const InputArea = styled.div`
    display: flex;
    padding: 15px;
    background-color: #fff;
    border-top: 1px solid #ddd;
`;

const InputMensaje = styled.input`
    flex-grow: 1;
    padding: 10px 15px;
    border-radius: 20px;
    border: 1px solid #ccc;
    font-size: 1em;
`;

const BotonEnviar = styled.button`
    background-color: #3b5998;
    color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-left: 10px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;

    &:hover {
        background-color: #2b4480;
    }
`;