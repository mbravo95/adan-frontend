import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";

const Container = styled.div`
  background-color: #ffffffff;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
`;

const Title = styled.h1`
  color: #000000ff;
  font-size: 28px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: white;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
    box-shadow: 0 0 0 3px rgba(76, 36, 29, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: white;
  box-sizing: border-box;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
    box-shadow: 0 0 0 3px rgba(76, 36, 29, 0.1);
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
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  
  &:hover {
    background-color: #3a1b16;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FileInfo = styled.div`
  color: #666;
  font-size: 14px;
  margin-top: 10px;
`;

const SelectedFile = styled.div`
  background-color: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 6px;
  padding: 10px;
  margin-top: 10px;
  color: #2e7d32;
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
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  background-color: ${props => props.variant === 'secondary' ? '#6c757d' : '#28a745'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#5a6268' : '#218838'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SubirMaterial = () => {
  const { codigo, seccionId } = useParams();
  const navigate = useNavigate();
  
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


      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Material subido exitosamente");

      setFormData({ titulo: "", descripcion: "" });
      setSelectedFile(null);

      
    } catch (error) {
      toast.error("Error al subir el material");
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
          <Title>Subir Material</Title>

          <FormGroup>
            <Label htmlFor="titulo">Titulo</Label>
            <Input
              id="titulo"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleInputChange}
              maxLength="100"
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
            <Button 
              variant="secondary" 
              onClick={handleVolver}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleGuardarCambios}
              disabled={uploading}
            >
              {uploading ? "Subiendo..." : "Guardar Cambios"}
            </Button>
          </ButtonGroup>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default SubirMaterial;
