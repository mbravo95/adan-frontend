import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { esUsuarioRegular } from '../utils/permisoCursos';

const NotificacionBandeja = ({ idUsuario }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!esUsuarioRegular()) {
      navigate("/not-found");
    }
  }, [navigate]);

  const marcarLeida = async (id) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      await axios.put(`${urlBase}/notificaciones/usuario/${idUsuario}/leida/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    } catch (err) {
      // Silenciar error
    }
  };

  const eliminarNotificacion = async (id, e) => {
    e.stopPropagation();
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      await axios.delete(`${urlBase}/notificaciones/eliminar/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert('Error al eliminar la notificación');
    }
  };

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        setLoading(true);
        setError(null);
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${urlBase}/notificaciones/usuario/${idUsuario}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        setNotificaciones(response.data);
      } catch (err) {
        setError("Error al cargar notificaciones");
      } finally {
        setLoading(false);
      }
    };
    if (idUsuario) fetchNotificaciones();
  }, [idUsuario]);

  if (loading) return (
    <Container>
      <LoadingMessage>Cargando notificaciones...</LoadingMessage>
    </Container>
  );
  
  if (error) return (
    <Container>
      <ErrorMessage>{error}</ErrorMessage>
    </Container>
  );

  if (!notificaciones.length) return (
    <Container>
      <EmptyMessage>No hay notificaciones.</EmptyMessage>
    </Container>
  );

  return (
    <Container>
      <Title>Notificaciones</Title>
      <NotificationList>
        {notificaciones.map(n => (
          <NotificationItem
            key={n.id}
            $isRead={n.leida}
            $isOpen={openId === n.id}
            onClick={() => {
              if (openId !== n.id && !n.leida) {
                marcarLeida(n.id);
              }
              setOpenId(openId === n.id ? null : n.id);
            }}
          >
            <NotificationHeader>
              <NotificationTitle>{n.titulo}</NotificationTitle>
              <DeleteButton
                onClick={(e) => eliminarNotificacion(n.id, e)}
                title="Eliminar notificación"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </DeleteButton>
            </NotificationHeader>
            <BadgeAndDateContainer>
              <StatusBadge $isRead={n.leida}>
                {n.leida ? 'Leída' : 'No leída'}
              </StatusBadge>
              <NotificationDate>
                {new Date(n.fechaNotificacion).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </NotificationDate>
            </BadgeAndDateContainer>
            {openId === n.id && (
              <NotificationContent>
                {n.notificacion}
              </NotificationContent>
            )}
          </NotificationItem>
        ))}
      </NotificationList>
    </Container>
  );
}

export default NotificacionBandeja;

const Container = styled.div`
  width: 100%;
  margin-top: 70px;
  padding: 30px;
  box-sizing: border-box;
`;

const Title = styled.h3`
  color: #333;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 0;
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NotificationItem = styled.li`
  background: ${props => props.$isRead ? '#fafafa' : '#9dcbd799'};
  border: 2px solid ${props => props.$isOpen ? '#4C241D' : '#ddd'};
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
`;

const NotificationTitle = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: #333;
  flex: 1;
`;

const BadgeAndDateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const NotificationDate = styled.span`
  font-size: 13px;
  color: #888;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  line-height: 0;
  border-radius: 4px;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.6;
  }
  
  &:active {
    opacity: 0.4;
  }
`;

const StatusBadge = styled.div`
  display: inline-block;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
  background-color: ${props => props.$isRead ? '#e0e0e0' : '#99ccd8ff'};
  color: ${props => props.$isRead ? '#666' : '#000'};
  margin-bottom: 8px;
`;

const NotificationContent = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  word-break: break-word;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 16px;
  padding: 40px 20px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e53e3e;
  font-size: 16px;
  padding: 20px;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 4px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 40px 20px;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px dashed #ddd;
`;