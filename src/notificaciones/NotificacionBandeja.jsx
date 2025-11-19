import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificacionBandeja = ({ idUsuario }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

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

  if (loading) return <div>Cargando notificaciones...</div>;
  if (error) return <div>{error}</div>;

  if (!notificaciones.length) return <div>No hay notificaciones.</div>;

  return (
    <div>
      <h3>Notificaciones</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notificaciones.map(n => (
          <li
            key={n.id}
            style={{
              background: n.leida ? '#f0f0f0' : '#ffe4b2',
              marginBottom: 8,
              padding: 8,
              borderRadius: 4,
              cursor: 'pointer',
              border: openId === n.id ? '2px solid #f4b400' : '2px solid transparent'
            }}
            onClick={() => {
              if (openId !== n.id && !n.leida) {
                marcarLeida(n.id);
              }
              setOpenId(openId === n.id ? null : n.id);
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><strong>{n.titulo}</strong></span>
              <span style={{ fontSize: '0.85em', color: '#888' }}>{new Date(n.fechaNotificacion).toLocaleString()}</span>
            </div>
            <div style={{ fontSize: '0.8em', color: n.leida ? '#666' : '#d35400' }}>{n.leida ? 'Leída' : 'No leída'}</div>
            {openId === n.id && (
              <div style={{ marginTop: 8, fontSize: '1em', color: '#333', wordBreak: 'break-word' }}>
                {n.notificacion}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default NotificacionBandeja;
