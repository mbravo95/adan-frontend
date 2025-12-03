import styled, {css} from "styled-components";

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

const ListaConversaciones = ({ conversaciones, onSelect, selectedId }) => {
  return (
    <div>
      {conversaciones.map((conv) => (
        <ItemConversacion
          key={conv.id}
          selected={conv.id === selectedId}
          onClick={() => onSelect(conv.id)}
        >
          <AvatarLista fotoUrl={construirUrlFoto(conv.fotoPerfil)} />
          <InfoConversacion>
            <ParticipanteNombre>{conv.participanteNombre}</ParticipanteNombre>
            <UltimoMensaje>
              {conv.esPropioUltimo && <span style={{ fontWeight: '500' }}>Tú: </span>}
              {conv.ultimoMensaje || "No hay mensajes"}
            </UltimoMensaje>
          </InfoConversacion>
          {conv.tiempoTranscurrido && (
            <TiempoTranscurrido>{conv.tiempoTranscurrido}</TiempoTranscurrido>
          )}
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
  gap: 10px;
  
  &:hover {
    background-color: #f0f0f0;
  }

  ${props =>
    props.selected &&
    css`
      background-color: #e0f7fa;
      border-left: 5px solid #000000ff;
      padding-left: 5px;
    `
  }
`;

export const AvatarLista = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #bdbdbd; 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${props => 
    props.fotoUrl && props.fotoUrl !== DEFAULT_AVATAR_URL 
      ? `url(${props.fotoUrl})` 
      : `url(${DEFAULT_AVATAR_URL})`
  };
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const InfoConversacion = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

export const ParticipanteNombre = styled.div`
  font-weight: bold;
  font-size: 1em;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const UltimoMensaje = styled.div`
  font-size: 0.9em;
  color: #777;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const TiempoTranscurrido = styled.div`
  font-size: 0.8em;
  color: #555;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: auto;
`;