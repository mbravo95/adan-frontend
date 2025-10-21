import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

const HeaderContainer = styled.header`
  background-color: ${props => props.bgColor || 'white'};
  width: 100%;
  height: 60px;
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

const Logo = styled.h1`
  color: ${props => props.textColor || 'black'};
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  transition: color 0.3s ease;
`;

const NavigationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.textColor || 'black'};
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.textColor === 'white' ? 'rgba(255,255,255,0.1)' : '#f5f5f5'};
  }
`;

const UserMenuContainer = styled.div`
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
    background-color: ${props => props.textColor === 'white' ? 'rgba(255,255,255,0.1)' : '#f5f5f5'};
  }
`;

const UserName = styled.span`
  color: ${props => props.textColor || 'black'};
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
  display: ${props => props.isOpen ? 'block' : 'none'};
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
  
  const getHeaderColors = () => {
    const path = location.pathname;
    
    if (path.startsWith('/curso/')) {
      return {
        bgColor: '#9DCBD7',
        textColor: 'black'
      };
    } else {
      return {
        bgColor: 'white',
        textColor: 'black'
      };
    }
  };

  const { bgColor, textColor } = getHeaderColors();
  
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
  
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mail");
    localStorage.removeItem("tipo");
    navigate("/login");
  }

  const irPerfil = () => {
    navigate("/usuario");
    setIsMenuOpen(false);
  }

  const irCursos = () => {
    navigate("/cursos");
  }

  const irAltaCursos = () => {
    navigate("/crear-curso");
  }

  const irAltaUsuario = () => {
    navigate("/crear-usuario");
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const handleClickOutside = () => {
    setIsMenuOpen(false);
  }

  const esUsuarioRegular = localStorage.getItem("tipo") !== "ADMINISTRADOR";
  
  return (
    <>
      <HeaderContainer bgColor={bgColor}>
        <Logo textColor={textColor}>adan</Logo>
        
        <NavigationSection>
            <NavButton textColor={textColor} onClick={irCursos}>
              Cursos
            </NavButton>
            {esUsuarioRegular ? null : (
              <>
                <NavButton textColor={textColor} onClick={irAltaCursos}>
                  Crear Curso
                </NavButton>
                <NavButton textColor={textColor} onClick={irAltaUsuario}>
                  Crear Usuario
                </NavButton> 
              </>
            )}
        </NavigationSection>
        
        <UserMenuContainer>
          <UserContainer textColor={textColor} onClick={toggleMenu}>
            <UserName textColor={textColor}>{userName}</UserName>
            <UserIcon>
              👤
            </UserIcon>
          </UserContainer>
          <DropdownMenu isOpen={isMenuOpen}>
            <MenuItem onClick={irPerfil}>
              Perfil
            </MenuItem>
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

export default Header