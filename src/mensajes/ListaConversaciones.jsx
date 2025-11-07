import styled, {css} from "styled-components";

const ListaConversaciones = ({ conversaciones, onSelect, selectedId }) => {


  return (
    <div>
        {conversaciones.map((conv) => (
            <ItemConversacion
                key={conv.id}
                selected={conv.id === selectedId}
                onClick={() => onSelect(conv.id)}
            >
                <AvatarLista fotourl={conv.fotoPerfil} />
                <InfoConversacion>
                    <ParticipanteNombre>{conv.participanteNombre}</ParticipanteNombre>
                    <UltimoMensaje>{conv.ultimoMensaje ? conv.ultimoMensaje : ""}</UltimoMensaje>
                </InfoConversacion>
                <TiempoTranscurrido>{conv.tiempoTranscurrido ? conv.tiempoTranscurrido : ""}</TiempoTranscurrido>
            </ItemConversacion>
        ))}
    </div>
  )
}

export default ListaConversaciones;


export const ItemConversacion = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #f0f0f0;
    }

    ${props =>
        props.selected &&
        css`
            background-color: #e0f7fa;
            border-left: 5px solid #00bcd4;
            padding-left: 5px;
        `
    }
`;

export const AvatarLista = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    
    background-color: #bdbdbd; 
    margin-right: 10px;
    
    
    background-size: cover;
    background-position: center;
    
    background-image: url(${props => props.fotourl});

    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const InfoConversacion = styled.div`
    flex-grow: 1;
    overflow: hidden;
`;

export const ParticipanteNombre = styled.div`
    font-weight: bold;
    font-size: 1em;
    color: #333;
`;

export const UltimoMensaje = styled.div`
    font-size: 0.9em;
    color: #777;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const TiempoTranscurrido = styled.div`
    font-size: 0.8em;
    color: #555;
    white-space: nowrap;
`;