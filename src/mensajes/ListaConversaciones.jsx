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
                <AvatarLista />
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
            padding-left: 5px; /* Ajuste para compensar el borde */
        `
    }
`;

export const AvatarLista = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #bdbdbd;
    margin-right: 10px;
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