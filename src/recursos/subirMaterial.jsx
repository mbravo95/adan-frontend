import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import useCursoData from "../hooks/useCursoData";



const SubirMaterial = () => {
  const { codigo, seccion } = useParams();
  const navigate = useNavigate();

  const { esProfesor, loadingSecciones  } = useCursoData(codigo);
  const rol = localStorage.getItem("tipo");
  if (!loadingSecciones && rol !== "ADMINISTRADOR" && !esProfesor) {
    return <Navigate to="/home" />;
  }
  
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
    
      setSelectedFile(file);
      toast.success(`Archivo "${file.name}" seleccionado correctamente`);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleGuardarCambios = async () => {
    if (!formData.titulo.trim()) {
      toast.error("el titulo es obligatorio");
      return;
    }

    if (!formData.descripcion.trim()) {
      toast.error("la descripcion es obligatoria");
      return;
    }

    if (!selectedFile) {
      toast.error("debe seleccionar un archivo");
      return;
    }

    setUploading(true);
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("archivo", selectedFile);
      form.append("nombre", formData.titulo);
      form.append("descripcion", formData.descripcion);

      const response = await axios.post(
        `${urlBase}/recursos/cursos/${codigo}/secciones/${seccion}/materiales`,
        form,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log("[SUBIR MATERIAL] Respuesta backend (success):", response);
      const successMsg = response.data?.message || "Material subido exitosamente";
      toast.success(successMsg);
      setFormData({ titulo: "", descripcion: "" });
      setSelectedFile(null);
      navigate(`/curso/${codigo}`);
    } catch (error) {
      console.log("[SUBIR MATERIAL] Respuesta backend (error):", error?.response);
      console.log("[SUBIR MATERIAL] Error completo:", error);
      const errorMsg = error?.response?.data?.message || "Error al subir el material";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleVolver = () => {
    navigate(-1);
  };

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          {/*<Title>Subir Material</Title>*/}

          <form>
            <FormGroup>
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                name="titulo"
                type="text"
                value={formData.titulo}
                onChange={handleInputChange}
                maxLength="100"
                placeholder="Título del material"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="descripcion">Descripcion</Label>
              <TextArea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                maxLength="500"
                placeholder="Descripción del material"
                rows="4"
              />
            </FormGroup>

            <FormGroup>
              <Label>Archivo</Label>
              <FileUploadSection>
                <FileUploadButton
                  type="button"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  Adjuntar Archivo
                </FileUploadButton>
                
                <FileInput
                  id="file-input"
                  type="file"
                  onChange={handleFileSelect}
                />

                {selectedFile && (
                  <SelectedFile>
                    <span>
                      {selectedFile.name} 
                      <small> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</small>
                    </span>
                    <RemoveFileButton onClick={removeFile}>
                      ✕
                    </RemoveFileButton>
                  </SelectedFile>
                )}
              </FileUploadSection>
            </FormGroup>

            <ButtonGroup>
              <CreateButton 
                type="button"
                onClick={handleGuardarCambios}
                disabled={uploading}
              >
                {uploading ? "Subiendo..." : "Aceptar"}
              </CreateButton>
              <CancelButton 
                type="button"
                onClick={handleVolver}
                disabled={uploading}
              >
                Cancelar
              </CancelButton>
            </ButtonGroup>
          </form>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default SubirMaterial;


const Container = styled.div`
  background-color: #ffffffff;
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
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 1em;
  font-weight: 500;
  color: #333;
  margin-left: 5px;
  display: block;
  margin-bottom: 8px;
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
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const FileUploadSection = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  background-color: white;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4C241D;
    background-color: #f8f9fa;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadButton = styled.button`
  background-color: #4C241D;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a1b16;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SelectedFile = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  color: #333;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  
  &:hover {
    color: #b71c1c;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
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

const CreateButton = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
`;