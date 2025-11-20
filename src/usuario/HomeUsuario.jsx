import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { esUsuarioRegular } from "../utils/permisoCursos";


const BackgroundColor = "#9DCBD7";
const PrimaryColor = "#5a2e2e";

const Container = styled.div`
  background-color: ${BackgroundColor};
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center; 
  padding-top: 70px;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  gap: 40px;
  align-items: center;
  flex-wrap: wrap;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  min-width: 300px;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 300px;
`;

const Logo = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 440px;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: 3em;
  color: #333;
  text-align: center;
  font-weight: 800;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 2.2em;
  }
`;

const AdminPanel = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const AdminTitle = styled.h2`
  font-size: 2em;
  color: #333;
  text-align: center;
  font-weight: 700;
  margin: 0;
`;

const GridButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AdminButton = styled.button`
  background-color: white;
  color: #333;
  border: none;
  padding: 20px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: ${PrimaryColor};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;


const HomeUsuario = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Usuario");

  const regular = esUsuarioRegular();

  const handleNavigation = (path) => navigate(path);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");

        if (!token) {
          const mail = localStorage.getItem("mail");
          setUserName(mail?.split("@")[0] || "Usuario");
          return;
        }

        const res = await axios.get(`${base}/usuarios/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserName(res.data.nombres || res.data.apellidos || "Usuario");
      } catch (e) {
        const mail = localStorage.getItem("mail");
        setUserName(mail?.split("@")[0] || "Usuario");
      }
    };

    cargarUsuario();
  }, []);

  return (
    <Container>
      <ContentWrapper>
        <LeftSection>
          {regular ? (
            <Title>Bienvenido/a {userName}!</Title>
          ) : (
            <AdminPanel>
              <AdminTitle>Panel de Administración</AdminTitle>

              <GridButtons>
                <AdminButton onClick={() => handleNavigation("/admin-cursos")}>
                  Administrar Cursos
                </AdminButton>

                <AdminButton onClick={() => handleNavigation("/buscar-usuarios")}>
                  Administrar Usuarios
                </AdminButton>

                <AdminButton onClick={() => handleNavigation("/crear-curso")}>
                  Crear Curso
                </AdminButton>

                <AdminButton onClick={() => handleNavigation("/crear-usuario")}>
                  Crear Usuario
                </AdminButton>

                <AdminButton onClick={() => handleNavigation("/crear-curso-csv")}>
                  Crear Cursos CSV
                </AdminButton>

                <AdminButton onClick={() => handleNavigation("/crear-usuario-csv")}>
                  Crear Usuarios CSV
                </AdminButton>
                
              </GridButtons>
            </AdminPanel>
          )}
        </LeftSection>

        <RightSection>
          <Logo
            src = "/serpiente.png"
            alt="Logo"
          />
        </RightSection>
      </ContentWrapper>
    </Container>
  );
};

export default HomeUsuario;
