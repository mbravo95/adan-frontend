import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoImage = styled.img`
  height: 30px;
  width: auto;
  cursor: pointer;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

const Icon = styled.img`
  height: 24px;
  width: 24px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const MessagesIcon = styled(Icon)`
  height: 28px;
  width: 28px;
`;

const ProfileContainer = styled.div`
  position: relative;
  cursor: pointer;
  margin-left: 5px;
`;

const ProfileIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  width: 180px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  font-size: 1em;
  font-family: 'Inter', sans-serif;
  color: #333;
  cursor: pointer;
  transition: background-color 0.1s;

  &:hover {
    background-color: #f4f4f4;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 5px 0;
`;

const CenterSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  gap: 30px;
`;

const Button = styled.button`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
  background-color: #e0e0e0;
  color: #333;
  &:hover {
    background-color: #d0d0d0;
  }
`;

const Header = () => {

  const navigate = useNavigate();

  const [abrirMenu, setAbrirMenu] = useState(false);

  const { setProfile, profile } = useAuth();

  const rol = localStorage.getItem("tipo");
  
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tipo");
    setProfile({});
    navigate("/login");
  }

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
        setProfile(response.data);
      } catch (error) {
        console.log(error);
        cerrarSesion();
      }
    }
    recargarPerfil();
  }, []);
  
  return (
    <>
        <HeaderContainer>
        <LeftSection>
          <LogoImage src="/header/logo_1.png" alt="Logo ADAN" onClick={() => navigate('/home')}/>
        </LeftSection>
        { rol == "ADMINISTRADOR" &&
        <CenterSection>
          <Button onClick={() => navigate('/crear-usuario')}>Crear nuevo usuario</Button>
          <Button onClick={() => navigate('/crear-curso')}>Crear nuevo curso</Button>
        </CenterSection>
        }
        <RightSection>
          <Icon src="/header/logo_2.png" alt="Icono 2" onClick={() => navigate('/home')} />
          <MessagesIcon src="/header/mensajes.png" alt="Mensajes" onClick={() => console.log('Ir a los mensajes')} />
          <Icon src="/header/notificaciones.png" alt="Notificaciones" onClick={() => console.log('Ir a las notificaciones')} />
          <ProfileContainer onClick={() => setAbrirMenu(!abrirMenu)}>
            <ProfileIcon src={profile.fotoPerfil ? profile.fotoPerfil : "/header/avatar.png"} alt="Perfil" />
            {abrirMenu && (
              <DropdownMenu>
                <DropdownItem onClick={() => navigate('/usuario')}>Ver perfil</DropdownItem>
                <Divider />
                <DropdownItem onClick={() => cerrarSesion()}>Cerrar sesión</DropdownItem>
              </DropdownMenu>
            )}
          </ProfileContainer>
        </RightSection>
      </HeaderContainer>
    </>
  )
}

export default Header