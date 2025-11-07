import { useEffect, useState, useMemo } from 'react';
import styled, {css} from "styled-components";
import axios from "axios";
import Spinner from '../general/Spinner';

const DEFAULT_AVATAR_URL = "/header/avatar.png";


const Conversacion = ({ conversacionId, idUsuarioActual, esNuevaConversacion, onHandleNuevoChat, onHandleCerrarConversacion, perfil }) => {

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
                
                // Obtener datos del destinatario
                const response1 = await axios.get(`${urlBase}/usuarios/${conversacionId}`, config);
                const destinatario = response1.data;
                setParticipanteNombre(`${destinatario.nombres || ''} ${destinatario.apellidos || ''}`.trim());
                setParticipanteAvatar(destinatario.fotoPerfil || null); // Usar null si no hay foto para el fallback en CSS
                
                // Obtener mensajes
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
                <BackButton onClick={onHandleCerrarConversacion}>←</BackButton>
                <TitleChat>{participanteNombre}</TitleChat>
                <ProfileIcon fotoUrl={participanteAvatar || DEFAULT_AVATAR_URL} />
            </HeaderChat>
            
            {cargando && <Spinner />}
            {!cargando &&
                <MensajesScrollable>
                    {mensajes.map((msg) => {
                        const esMensajePropio = idUsuarioActual === msg.idRemitente;
                        const avatarParaMensaje = esMensajePropio ? perfil.fotoPerfil : (participanteAvatar || DEFAULT_AVATAR_URL);

                        return (
                            <MensajeBubble 
                                key={msg.id} 
                                $propio={esMensajePropio}
                            >
                                <AvatarChat 
                                    $propio={esMensajePropio} 
                                    fotoUrl={avatarParaMensaje} 
                                />
                                <ContenidoMensaje propio={esMensajePropio}>
                                    {msg.cuerpoMensaje}
                                </ContenidoMensaje>
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
                        ▶
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
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
    background-image: ${props => props.fotoUrl && props.fotoUrl !== DEFAULT_AVATAR_URL ? `url(${props.fotoUrl})` : `url(${DEFAULT_AVATAR_URL})`};

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

    display: flex;
    align-items: center;
    justify-content: center;
    color: #555;
    font-size: 1.5em;
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
    max-width: 80%;
    align-items: flex-end; 
    gap: 8px; 

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
    flex-shrink: 0; 
    
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    background-image: ${props => props.fotoUrl && props.fotoUrl !== DEFAULT_AVATAR_URL ? `url(${props.fotoUrl})` : `url(${DEFAULT_AVATAR_URL})`};
    
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b5998; 
    font-size: 1.5em; 
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
                  border: 1px solid #e0e0e0; 
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
    transform: translateX(1px);

    &:hover {
        background-color: #2b4480;
    }
`;