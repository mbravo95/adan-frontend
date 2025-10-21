import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  background-color: #9DCBD7;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
`;

const MainContent = styled.div`
  display: flex;
  gap: 80px;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
`;

const ProfileImage = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  color: #666;
  border: 6px solid white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
  margin-top: 60px;
`;

const ProfileName = styled.h2`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProfileRole = styled.p`
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 25px 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
`;

const EditButton = styled.button`
  background-color: white;
  color: #333;
  border: none;
  padding: 14px 32px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    background-color: #f8f8f8;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DataSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
`;

const UserCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #666;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  color: #333;
  font-size: 16px;
  font-weight: 500;
`;

const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nombres: "Cargando...",
    apellidos: "Cargando...",
    correo: "Cargando...",
    cedula: "Cargando...",
    fechaNacimiento: "Cargando...",
    fechaIngreso: "Cargando...",
    rol: "Cargando..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect ejecutándose...");
    
    const obtenerDatosUsuario = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        console.log("URL Base:", urlBase);
        console.log("Token:", token ? "Token encontrado" : "No hay token");
        
        if (!token) {
          console.log("No hay token, mostrando mensaje");
          setUserData({
            nombres: "No disponible",
            apellidos: "No disponible",
            correo: "No hay token",
            cedula: "No disponible", 
            fechaNacimiento: "No disponible",
            fechaIngreso: "No disponible",
            rol: "No disponible"
          });
          setLoading(false);
          return;
        }

        console.log("Haciendo llamada a:", `${urlBase}/usuarios/perfil`);

        const response = await axios.get(`${urlBase}/usuarios/perfil`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Respuesta de la API (objeto):", response.data);
        console.log("Respuesta de la API (JSON string):", JSON.stringify(response.data, null, 2));

        const data = response.data;
        
        // Función para formatear fecha a YYYY-MM-DD
        const formatearFecha = (fechaString) => {
          if (!fechaString) return "No disponible";
          try {
            const fecha = new Date(fechaString);
            return fecha.toISOString().split('T')[0]; // Obtiene solo YYYY-MM-DD
          } catch (error) {
            return fechaString; // Si no se puede parsear, devuelve original
          }
        };
        
        setUserData({
          nombres: data.nombres || "No disponible",
          apellidos: data.apellidos || "No disponible",
          correo: data.correo || "No disponible",
          cedula: data.cedula || "No disponible",
          fechaNacimiento: formatearFecha(data.fechaNacimiento), 
          fechaIngreso: formatearFecha(data.fechaInscripcion),
          rol: data.tipoUsuario || data.rol || localStorage.getItem("tipo") || "No disponible"
        });
        
        console.log("Datos actualizados:", userData);
        
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        console.log("Detalles del error:", error.response?.status, error.response?.data);
        setUserData({
          nombres: "Error al cargar",
          apellidos: "Error al cargar",
          correo: localStorage.getItem("mail") || "Error al cargar",
          cedula: "Error al cargar",
          fechaNacimiento: "Error al cargar", 
          fechaIngreso: "Error al cargar",
          rol: localStorage.getItem("tipo") || "Error al cargar"
        });
      } finally {
        console.log("Finalizando carga...");
        setLoading(false);
      }
    };

    console.log("Llamando a obtenerDatosUsuario...");
    obtenerDatosUsuario();
  }, []);

  // Obtener nombre completo para mostrar
  const nombreCompleto = () => {
    const nombres = userData.nombres;
    const apellidos = userData.apellidos;
    
    if (nombres !== "Cargando..." && nombres !== "No disponible" && nombres !== "Error al cargar") {
      const nombreCompleto = `${nombres} ${apellidos}`.trim();
      return nombreCompleto || "Usuario";
    }
    
    // Fallback al correo si no hay nombres
    return userData.correo !== "Cargando..." && userData.correo !== "No disponible" 
      ? userData.correo.split('@')[0] 
      : localStorage.getItem("mail")?.split('@')[0] || "Usuario";
  };

  const irEditarPerfil = () => {
    navigate('/usuario/editar');
  };

  return (
    <Container>
      <ContentWrapper>
        <MainContent>
          <ProfileSection>
            <ProfileImage>
              👤
            </ProfileImage>
            <ProfileName>{nombreCompleto()}</ProfileName>
            <ProfileRole>{userData.rol}</ProfileRole>
          </ProfileSection>
          
          <DataSection>
            <Title>Perfil del Usuario</Title>
            <UserCard>
              <DataRow>
                <Label>Nombres:</Label>
                <Value>{userData.nombres}</Value>
              </DataRow>
              <DataRow>
                <Label>Apellidos:</Label>
                <Value>{userData.apellidos}</Value>
              </DataRow>
              <DataRow>
                <Label>Correo:</Label>
                <Value>{userData.correo}</Value>
              </DataRow>
              <DataRow>
                <Label>Cédula:</Label>
                <Value>{userData.cedula}</Value>
              </DataRow>
              <DataRow>
                <Label>Fecha de Nacimiento:</Label>
                <Value>{userData.fechaNacimiento}</Value>
              </DataRow>
              <DataRow>
                <Label>Fecha de Ingreso:</Label>
                <Value>{userData.fechaIngreso}</Value>
              </DataRow>
            </UserCard>
          </DataSection>
        </MainContent>
        
        <EditButton onClick={irEditarPerfil}>
          Editar perfil
        </EditButton>
      </ContentWrapper>
    </Container>
  )
}

export default Perfil