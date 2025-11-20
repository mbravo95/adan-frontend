import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { esUsuarioRegular } from '../utils/permisoCursos';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBell, faComments } from '@fortawesome/free-solid-svg-icons';

function CursosIcono() {
  return (
    <FontAwesomeIcon 
      icon={faGraduationCap} 
      style={{ fontSize: 22, color: "#1E1E1E" }}
    />
  );
}

function NotificacionesIcono() {
  return (
    <FontAwesomeIcon 
      icon={faBell}
      style={{ fontSize: 22, color: "#1E1E1E" }}
    />
  );
}

function MensajesIcono() {
  return (
    <FontAwesomeIcon 
      icon={faComments}
      style={{ fontSize: 22, color: "#1E1E1E" }}
    />
  );
}


const HeaderContainer = styled.header`
  background-color: ${props => props.bgcolor || 'white'};
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  transition: opacity 0.3s ease;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const NavigationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.textcolor || 'black'};
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.textcolor === 'white' ? 'rgba(255,255,255,0.1)' : '#f5f5f5'};
  }
`;

const UserMenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.textcolor === 'white' ? 'rgba(255,255,255,0.1)' : '#f5f5f5'};
  }
`;

const UserName = styled.span`
  color: ${props => props.textcolor || 'black'};
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
`;

const UserIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #666;
  border: 2px solid #ddd;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  display: ${props => props.$isopen ? 'block' : 'none'};
  z-index: 1001;
  transform: translateX(0);
  max-width: 200px;
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  color: black;
  font-size: 14px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, profile } = useAuth();
  
  const getHeaderColors = () => {
    const path = location.pathname;
    
    if (path.startsWith('/curso/')) {
      return {
        bgcolor: '#9DCBD7',
        textcolor: 'black'
      };
    } else {
      return {
        bgcolor: 'white',
        textcolor: 'black'
      };
    }
  };

  const { bgcolor, textcolor } = getHeaderColors();
  
  useEffect(() => {
    const obtenerNombreUsuario = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        if (!token) {
          const mail = localStorage.getItem("mail");
          setUserName(mail ? mail.split('@')[0] : "Usuario");
          return;
        }

        const response = await axios.get(`${urlBase}/usuarios/perfil`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = response.data;
        const nombres = data.nombres || "";
        const apellidos = data.apellidos || "";
        
        if (nombres && apellidos) {
          setUserName(`${nombres} ${apellidos}`.trim());
        } else if (nombres) {
          setUserName(nombres);
        } else {
          const mail = localStorage.getItem("mail");
          setUserName(mail ? mail.split('@')[0] : "Usuario");
        }
        
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        const mail = localStorage.getItem("mail");
        setUserName(mail ? mail.split('@')[0] : "Usuario");
      }
    };

    obtenerNombreUsuario();
  }, []);

  useEffect(() => {
    const recargarPerfil = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${urlBase}/usuarios/perfil`, config);
        setProfile({
          ...response.data,
          id: response.data.id || response.data._id || null
        });
      } catch (error) {
        console.log(error);
        cerrarSesion();
      }
    }
    recargarPerfil();
  }, []);
  
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mail");
    localStorage.removeItem("tipo");
    setProfile({});
    navigate("/login");
  }

  const irPerfil = () => {
    navigate("/usuario");
    setIsMenuOpen(false);
  }

  const irCalificaciones = () => {
    navigate("/calificaciones");
    setIsMenuOpen(false);
  }

  const irCursos = () => {
    navigate("/cursos");
  }

  const irAlHome = () => {
    navigate("/home");
  }

  const irAltaCursos = () => {
    navigate("/crear-curso");
  }

  const irAltaCursosCsv = () => {
    navigate("/crear-curso-csv");
  }

  const irAltaUsuario = () => {
    navigate("/crear-usuario");
  }

  const irAltaUsuarioCsv = () => {
    navigate("/crear-usuario-csv");
  }

  const irAdminCursos = () => {
    navigate("/admin-cursos");
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const handleClickOutside = () => {
    setIsMenuOpen(false);
  }

  const irBusquedaUsuarios = () => {
    navigate("/buscar-usuarios");
    setIsMenuOpen(false);
  }

  const irNotificacionBandeja = () => {
    navigate("/usuario/notificacion-bandeja");
    setIsMenuOpen(false);
  }

  const irMensajes = () => {
    navigate("/mensajes");
  }

  return (
    <>
      <HeaderContainer bgcolor={bgcolor}>
        <Logo src="/logoHeader.png" alt="Logo ADAN" onClick={irAlHome} />

        <UserMenuContainer>

          <UserContainer onClick={irCursos}>
            <CursosIcono />
            Cursos
          </UserContainer>

          <UserContainer onClick={irMensajes}>
            <MensajesIcono />
            Mensajes
          </UserContainer>

          <UserContainer onClick={irNotificacionBandeja}>
            <NotificacionesIcono />
            Notificaciones
          </UserContainer>

          
          {/*
          {!esUsuarioRegular() ? null : (
            <>
              <UserContainer onClick={irMensajes}>
                <MensajesIcono />
                Mensajes
              </UserContainer>

              <UserContainer onClick={irNotificacionBandeja}>
                <NotificacionesIcono />
                Notificaciones
              </UserContainer>
            </>
          )}
          */}

          <UserContainer textcolor={textcolor} onClick={toggleMenu}>
            <UserName textcolor={textcolor}>{userName}</UserName>
            <UserIcon>
              {profile?.fotoPerfil ? (
                (() => {
                  const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/api$/, '').replace(/\/api\/$/, '');
                  const finalUrl = profile.fotoPerfil.startsWith('http')
                    ? profile.fotoPerfil
                    : `${baseUrl}${profile.fotoPerfil}`;
                  return (
                    <img
                      src={finalUrl}
                      alt="Foto de perfil"
                      style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  );
                })()
              ) : (
                <img
                  src="/header/avatar.png"
                  alt="Avatar por defecto"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              )}
            </UserIcon>
          </UserContainer>
          <DropdownMenu $isopen={isMenuOpen}>
            <MenuItem onClick={irPerfil}>
              Perfil
            </MenuItem>
            {esUsuarioRegular && 
              <MenuItem onClick={irCalificaciones}>
                Calificaciones
              </MenuItem>
            }
            <MenuItem onClick={cerrarSesion}>
              Cerrar sesión
            </MenuItem>
          </DropdownMenu>
        </UserMenuContainer>
      </HeaderContainer>
      {isMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999
          }}
          onClick={handleClickOutside}
        />
      )}
    </>

  )
}

export default Header;
