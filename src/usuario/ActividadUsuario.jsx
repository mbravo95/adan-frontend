import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../general/Spinner';

const ActividadUsuario = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  const userName = location.state?.userName || 'Usuario';
  const userEmail = location.state?.userEmail || '';

  useEffect(() => {
    cargarActividades();
  }, [userId]);

  const cargarActividades = async () => {
    setLoading(true);
    const urlBase = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${urlBase}/actividades/usuario/${userId}`,
        config
      );
      setActividades(response.data || []);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      if (error.response?.status === 204) {
        setActividades([]);
      } else {
        toast.error('Error al cargar las actividades del usuario', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const obtenerTituloActividad = (tipo) => {
    const titulos = {
      ALTA_MENSAJE: 'Mensaje en foro',
      MOD_MENSAJE: 'Mensaje en foro modificado',
      ALTA_ENTREGA: 'Entrega de tarea',
      CALIF_CURSO: 'Calificación de curso',
      CALIF_ENTREGA: 'Calificación de entrega'
    };
    return titulos[tipo] || tipo;
  };

  const obtenerIconoActividad = (tipo) => {
    const iconos = {
      ALTA_MENSAJE: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 30C42 31.0609 41.5786 32.0783 40.8284 32.8284C40.0783 33.5786 39.0609 34 38 34H14L6 42V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H38C39.0609 6 40.0783 6.42143 40.8284 7.17157C41.5786 7.92172 42 8.93913 42 10V30Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      MOD_MENSAJE: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 7.99996H8C6.93913 7.99996 5.92172 8.42139 5.17157 9.17154C4.42143 9.92168 4 10.9391 4 12V40C4 41.0608 4.42143 42.0782 5.17157 42.8284C5.92172 43.5785 6.93913 44 8 44H36C37.0609 44 38.0783 43.5785 38.8284 42.8284C39.5786 42.0782 40 41.0608 40 40V26M37 4.99996C37.7956 4.20432 38.8748 3.75732 40 3.75732C41.1252 3.75732 42.2044 4.20432 43 4.99996C43.7956 5.79561 44.2426 6.87475 44.2426 7.99996C44.2426 9.12518 43.7956 10.2043 43 11L24 30L16 32L18 24L37 4.99996Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      ALTA_ENTREGA: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30M34 16L24 6M24 6L14 16M24 6V30" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      CALIF_CURSO: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L30.18 16.52L44 18.54L34 28.28L36.36 42.04L24 35.54L11.64 42.04L14 28.28L4 18.54L17.82 16.52L24 4Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      CALIF_ENTREGA: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 22L24 28L44 8M42 24V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H32" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return iconos[tipo] || (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M38 42L24 32L10 42V10C10 8.93913 10.4214 7.92172 11.1716 7.17157C11.9217 6.42143 12.9391 6 14 6H34C35.0609 6 36.0783 6.42143 36.8284 7.17157C37.5786 7.92172 38 8.93913 38 10V42Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  const obtenerColorActividad = (tipo) => {
    const colores = {
      ALTA_MENSAJE: '#2196F3',
      MOD_MENSAJE: '#FF9800',
      ALTA_ENTREGA: '#00BCD4',
      CALIF_CURSO: '#9C27B0',
      CALIF_ENTREGA: '#4CAF50'
    };
    return colores[tipo] || '#757575';
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const actividadesFiltradas = filtroTipo === 'TODOS' 
    ? actividades 
    : actividades.filter(a => a.tipo === filtroTipo);

  const tiposActividad = ['TODOS', 'CALIF_CURSO', 'ALTA_ENTREGA', 'CALIF_ENTREGA', 'ALTA_MENSAJE', 'MOD_MENSAJE'];


  return (
    <Container>
      <ContentWrapper>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            ← Volver
          </BackButton>
          <HeaderContent>
            <TitleWithIcon>
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38 42L24 32L10 42V10C10 8.93913 10.4214 7.92172 11.1716 7.17157C11.9217 6.42143 12.9391 6 14 6H34C35.0609 6 36.0783 6.42143 36.8284 7.17157C37.5786 7.92172 38 8.93913 38 10V42Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            <Title>Resumen de Actividad</Title>
            </TitleWithIcon>
            <UserInfo>
              <UserName>{userName}</UserName>
              {userEmail && <UserEmail>{userEmail}</UserEmail>}
            </UserInfo>
          </HeaderContent>
        </Header>

        <FilterSection>
          <FilterLabel>Filtrar por tipo:</FilterLabel>
          <FilterButtons>
            {tiposActividad.map(tipo => (
              <FilterButton
                key={tipo}
                active={filtroTipo === tipo}
                onClick={() => setFiltroTipo(tipo)}
              >
                {tipo === 'TODOS' ? 'Todas' : obtenerTituloActividad(tipo)}
              </FilterButton>
            ))}
          </FilterButtons>
        </FilterSection>

        {loading ? (
          <LoadingContainer>
            <Spinner />
            <LoadingText>Cargando actividades...</LoadingText>
          </LoadingContainer>
        ) : actividadesFiltradas.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38 42L24 32L10 42V10C10 8.93913 10.4214 7.92172 11.1716 7.17157C11.9217 6.42143 12.9391 6 14 6H34C35.0609 6 36.0783 6.42143 36.8284 7.17157C37.5786 7.92172 38 8.93913 38 10V42Z" stroke="#999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </EmptyIcon>
            <EmptyText>
              {filtroTipo === 'TODOS' 
                ? 'No hay actividades registradas para este usuario'
                : `No hay actividades de tipo "${obtenerTituloActividad(filtroTipo)}"`
              }
            </EmptyText>
          </EmptyState>
        ) : (
          <ActividadesList>
            {actividadesFiltradas.map((actividad, index) => (
              <ActividadItem key={index} color={obtenerColorActividad(actividad.tipo)}>
                <ActividadIcono>{obtenerIconoActividad(actividad.tipo)}</ActividadIcono>
                <ActividadContent>
                  <ActividadInfo>
                    <ActividadTitulo>{obtenerTituloActividad(actividad.tipo)}</ActividadTitulo>
                    <ActividadFecha>{formatearFecha(actividad.fecha)}</ActividadFecha>
                  </ActividadInfo>
                  <ActividadDetalles>
                    {actividad.idMensaje && <Detalle>ID Mensaje: {actividad.idMensaje}</Detalle>}
                    {actividad.idEntregable && <Detalle>ID Entregable: {actividad.idEntregable}</Detalle>}
                    {actividad.idCurso && <Detalle>ID Curso: {actividad.idCurso}</Detalle>}
                  </ActividadDetalles>
                </ActividadContent>
              </ActividadItem>
            ))}
          </ActividadesList>
        )}

        <Footer>
          <FooterText>
            Mostrando {actividadesFiltradas.length} de {actividades.length} actividades
          </FooterText>
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default ActividadUsuario;


const BackgroundColor = '#9DCBD7';

const Container = styled.div`
  background-color: ${BackgroundColor};
  min-height: 100vh;
  width: 100%;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Header = styled.div`
  background: #667eea;
  padding: 30px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2em;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UserName = styled.h2`
  margin: 0;
  font-size: 1.3em;
  font-weight: 600;
  opacity: 0.95;
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: 0.95em;
  opacity: 0.85;
`;

const FilterSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FilterLabel = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.1em;
  color: #333;
  font-weight: 600;
`;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? '#667eea' : '#ddd'};
  background-color: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background-color: ${props => props.active ? '#5568d3' : '#f0f0f0'};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  gap: 20px;
  background: white;
  border-radius: 10px;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1.1em;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const EmptyText = styled.p`
  color: #999;
  font-size: 1.2em;
  margin: 0;
  max-width: 500px;
`;

const ActividadesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActividadItem = styled.div`
  display: flex;
  gap: 20px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  border-left: 5px solid ${props => props.color};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  align-items: flex-start;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ActividadIcono = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
`;

const ActividadContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
`;

const ActividadTitulo = styled.h3`
  margin: 0;
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
`;

const ActividadInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const ActividadFecha = styled.p`
  margin: 0;
  font-size: 0.9em;
  color: #666;
`;

const ActividadDetalles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  justify-content: flex-start;
`;

const Detalle = styled.span`
  font-size: 0.85em;
  background-color: #f5f5f5;
  padding: 6px 12px;
  border-radius: 15px;
  color: #555;
  border: 1px solid #e0e0e0;
  font-weight: 500;
`;

const Footer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FooterText = styled.p`
  margin: 0;
  color: #666;
  font-size: 1em;
  font-weight: 500;
`;