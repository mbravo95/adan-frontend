import { useEffect, useState } from 'react';
import styled, {css} from "styled-components";

const Conversacion = ({ conversacionId, idUsuarioActual}) => {

    const [mensajes, setMensajes] = useState([]);
    const [participanteNombre, setParticipanteNombre] = useState('Nombre Apellido');
    
    useEffect(() => {
        // Datos simulados
        // Usuario es 100
        setMensajes([
            { id: 1, emisorId: 99, contenido: "Ejemplo de mensaje" }, // Otro usuario
            { id: 2, emisorId: 99, contenido: "Ejemplo de mensaje" }, // Otro usuario
            { id: 3, emisorId: 100, contenido: "Ejemplo de mensaje" }, // Usuario actual
            { id: 4, emisorId: 100, contenido: "Ejemplo de mensaje" }, // Usuario actual
            { id: 5, emisorId: 99, contenido: "Ejemplo de mensaje" }, // Otro usuario
        ]);
        
    }, [conversacionId, idUsuarioActual]);


  return (
    <>
        <HeaderChat>
            <BackButton>←</BackButton>
            <TitleChat>{participanteNombre}</TitleChat>
            <ProfileIcon />
        </HeaderChat>
        
        <MensajesScrollable>
            {mensajes.map((msg) => {
                const esMensajePropio = msg.emisorId === idUsuarioActual;

                return (
                    <MensajeBubble 
                        key={msg.id} 
                        propio={esMensajePropio} // Prop para alineación y estilos
                    >
                        <ContenidoMensaje propio={esMensajePropio}>
                            {msg.contenido}
                        </ContenidoMensaje>
                        {/* Opcionalmente puedes mostrar el avatar en ambos lados o solo en el lado ajeno */}
                        <AvatarChat propio={esMensajePropio} /> 
                    </MensajeBubble>
                );
            })}
        </MensajesScrollable>
        
        <InputArea>
            <InputMensaje placeholder="Mensaje..." />
            <BotonEnviar>{/* Ícono de flecha o enviar */}</BotonEnviar>
        </InputArea>
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
        props.propio
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