import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
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

const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  flex: 1;
  max-width: 500px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 30px;
  text-align: center;
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
  border: 6px solid #ddd;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  margin-top: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #bbb;
  }
`;

const ProfileName = styled.h2`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ChangePhotoText = styled.p`
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  cursor: pointer;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  
  &::placeholder {
    color: #999;
  }
  
  /* Estilos específicos para input type="date" */
  &[type="date"] {
    color: #333 !important;
    
    &::-webkit-calendar-picker-indicator {
      background-image: url("data:image/svg+xml;charset=UTF8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3e%3cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3e%3c/svg%3e");
      background-color: transparent;
      background-size: 20px;
      background-repeat: no-repeat;
      background-position: center;
      width: 20px;
      height: 20px;
      cursor: pointer;
      filter: none;
    }
    
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const SaveButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
  
  &:hover:not(:disabled) {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
    color: #999;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
  
  &:hover:not(:disabled) {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
    color: #999;
  }
`;

const EditProfile = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: ""
  });
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingFoto, setLoadingFoto] = useState(false);
  const [errorFoto, setErrorFoto] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${urlBase}/usuarios/perfil`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = response.data;
        
        // Formatear fecha para input date
        const formatearFechaParaInput = (fechaString) => {
          if (!fechaString) return "";
          try {
            // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
            if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) {
              return fechaString;
            }
            
            // Intentar parsear diferentes formatos
            const fecha = new Date(fechaString);
            
            // Verificar que la fecha sea válida
            if (isNaN(fecha.getTime())) {
              return "";
            }
            
            // Formatear como YYYY-MM-DD
            const año = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            
            return `${año}-${mes}-${dia}`;
          } catch (error) {
            return "";
          }
        };

        const fechaFormateada = formatearFechaParaInput(data.fechaNacimiento);
        console.log("Fecha original:", data.fechaNacimiento);
        console.log("Fecha formateada:", fechaFormateada);

        setFormData({
          nombre: data.nombres || "",
          apellido: data.apellidos || "",
          fechaNacimiento: fechaFormateada
        });
        if (data.fotoPerfil) {
          setProfileImageUrl(data.fotoPerfil);
        }
        
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosUsuario();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No hay token disponible");
        alert("No hay sesión activa. Por favor, inicia sesión nuevamente.");
        return;
      }

      // Preparar datos para enviar
      const datosParaEnviar = {
        nombres: formData.nombre,
        apellidos: formData.apellido,
        fechaNacimiento: formData.fechaNacimiento,
        fotoPerfil: null // Por ahora null, se implementará después
      };

      console.log("Enviando datos:", datosParaEnviar);

      const response = await axios.put(`${urlBase}/usuarios/perfil`, datosParaEnviar, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Perfil actualizado exitosamente:", response.data);
      
      // Redirigir al perfil después de guardar
      navigate('/usuario');
      
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      // Aquí podrías agregar una notificación de error al usuario
      alert("Error al guardar los cambios. Por favor, inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/usuario');
  };

  const handleFotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingFoto(true);
    setErrorFoto("");
    try {
      console.log("Intentando subir foto", file);
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("foto", file);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${urlBase}/usuarios/perfil/foto`, formData, config);
      // Si el backend responde con la URL de la nueva foto
      if (response.data && response.data.url) {
        setProfileImageUrl(response.data.url);
      }
    } catch (err) {
      setErrorFoto("Error al subir la foto");
      console.error("Error al subir la foto", err);
    } finally {
      setLoadingFoto(false);
    }
  };

  // Obtener nombre completo para mostrar
  const nombreCompleto = () => {
    if (formData.nombre && formData.apellido) {
      return `${formData.nombre} ${formData.apellido}`.trim();
    }
    
    // Fallback al correo si no hay datos cargados aún
    return localStorage.getItem("mail")?.split('@')[0] || "Usuario";
  };

  return (
    <Container>
      <ContentWrapper>
        <MainContent>
          <ProfileSection>
            <ProfileImage onClick={handleFotoClick} title="Haz click para cambiar foto">
              {loadingFoto ? (
                <span style={{ fontSize: "2rem" }}>Cargando...</span>
              ) : profileImageUrl ? (
                (() => {
                  const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/api$/, '').replace(/\/api\/$/, '');
                  const finalUrl = profileImageUrl.startsWith('http')
                    ? profileImageUrl
                    : `${baseUrl}${profileImageUrl}`;
                  console.log('URL de imagen de perfil:', finalUrl);
                  return (
                    <img
                      src={finalUrl}
                      alt="Foto de perfil"
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  );
                })()
              ) : (
                <span role="img" aria-label="profile" style={{ fontSize: "5rem" }}>
                  👤
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFotoChange}
              />
            </ProfileImage>
            <ProfileName>{nombreCompleto()}</ProfileName>
            <ChangePhotoText onClick={handleFotoClick}>Cambiar foto de perfil</ChangePhotoText>
            {errorFoto && <p style={{ color: 'red', marginTop: 8 }}>{errorFoto}</p>}
          </ProfileSection>
          
          <FormWrapper>
            <Title>Editar Perfil</Title>

            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder={loading ? "Cargando..." : "Ingresa tu nombre"}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Apellido</Label>
              <Input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                placeholder={loading ? "Cargando..." : "Ingresa tu apellido"}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Fecha de Nacimiento</Label>
              <Input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                disabled={loading}
              />
            </FormGroup>

            <ButtonGroup>
              <SaveButton onClick={handleSave} disabled={saving || loading}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </SaveButton>
              <CancelButton onClick={handleCancel} disabled={saving}>
                Cancelar
              </CancelButton>
            </ButtonGroup>
          </FormWrapper>
        </MainContent>
      </ContentWrapper>
    </Container>
  )
}

export default EditProfile