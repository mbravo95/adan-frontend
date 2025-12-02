import { useEffect, useState } from 'react';
import styled, {css} from "styled-components";
import axios from "axios";
import Spinner from '../general/Spinner';

const DEFAULT_AVATAR_URL = "/header/avatar.png";


const construirUrlFoto = (fotoPerfil) => {
  if (!fotoPerfil) return DEFAULT_AVATAR_URL;
  
  if (fotoPerfil.startsWith('http')) {
    return fotoPerfil;
  }
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL
    .replace(/\/api$/, '')
    .replace(/\/api\/$/, '');
  
  return `${baseUrl}${fotoPerfil}`;
};

const Conversacion = ({ conversacionId, idUsuarioActual, esNuevaConversacion, onHandleNuevoChat, onHandleCerrarConversacion, perfil }) => {

    const [mensajes, setMensajes] = useState([]);
    const [participanteNombre, setParticipanteNombre] = useState('Cargando...');
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
                setParticipanteAvatar(construirUrlFoto(destinatario.fotoPerfil));
                
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
        <ConversacionContainer>
            <HeaderChat>
                <BackButton onClick={onHandleCerrarConversacion}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z" fill="#1D1B20"/>
                    </svg>
                </BackButton>
                <TitleChat>{participanteNombre}</TitleChat>
                <ProfileIcon fotoUrl={participanteAvatar || DEFAULT_AVATAR_URL} />
            </HeaderChat>
            
            {cargando && <SpinnerContainer><Spinner /></SpinnerContainer>}
            {!cargando &&
                <MensajesScrollable>
                    {mensajes.map((msg) => {
                        const esMensajePropio = idUsuarioActual === msg.idRemitente;
                        const avatarParaMensaje = esMensajePropio 
                            ? construirUrlFoto(perfil.fotoPerfil) 
                            : (participanteAvatar || DEFAULT_AVATAR_URL);

                        return (
                            <MensajeBubble 
                                key={msg.id} 
                                $propio={esMensajePropio}
                            >
                                {!esMensajePropio && (
                                    <AvatarChat 
                                        fotoUrl={avatarParaMensaje} 
                                    />
                                )}
                                <ContenidoMensaje $propio={esMensajePropio}>
                                    {msg.cuerpoMensaje}
                                </ContenidoMensaje>
                            </MensajeBubble>
                        );
                    })}
                </MensajesScrollable>
            }
            
            {!cargando &&
                <InputArea>
                    <InputMensaje 
                        placeholder="Mensaje..." 
                        value={mensajeNuevo} 
                        onChange={(e) => setMensajeNuevo(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleEnviarMensaje();
                            }
                        }} 
                    />
                    <BotonEnviar onClick={handleEnviarMensaje}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 20V4L22 12L3 20ZM5 17L16.85 12L5 7V10.5L11 12L5 13.5V17ZM5 17V12V7V10.5V13.5V17Z" fill="#1D1B20"/>
                        </svg>
                    </BotonEnviar>
                </InputArea>
            }
        </ConversacionContainer>
    )
}

export default Conversacion;

const ConversacionContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
`;

const HeaderChat = styled.div`
    padding: 15px;
    background-color: #E0E0E0;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
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
    display: flex;
    align-items: center;
    justify-content: center;
    color: #555;
    font-size: 1.5em;
`;

const SpinnerContainer = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MensajesScrollable = styled.div`
    flex: 1;
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
        props.$propio
            ? css`
                  background-color: #9DCBD7;
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
    flex-shrink: 0;
`;

const InputMensaje = styled.input`
    flex-grow: 1;
    padding: 10px 15px;
    border-radius: 20px;
    border: 1px solid #ccc;
    font-size: 1em;
`;

const BotonEnviar = styled.button`
    background-color: #9DCBD7;
    color: white;
    border-radius: 20px;
    width: 45px;
    height: 40px;
    margin-left: 10px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
        background-color: #8bbac6;
    }

    svg {
        display: block;
    }
`;