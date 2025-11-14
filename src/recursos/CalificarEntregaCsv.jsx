import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Container = styled.div`
  background-color: #fff;
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
  max-width: 800px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  padding: 32px 28px;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 24px;
  text-align: center;
`;

const FileInputContainer = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 24px;
  transition: border-color 0.3s;
  cursor: pointer;

  &:hover {
    border-color: #3182ce;
  }

  &.dragover {
    border-color: #3182ce;
    background-color: #f7fafc;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  cursor: pointer;
  display: block;
  width: 100%;
`;

const FileText = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  margin: 0;
`;

const FileSubtext = styled.p`
  font-size: 0.9rem;
  color: #718096;
  margin: 8px 0 0 0;
`;

const SelectedFile = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileName = styled.span`
  color: #2d3748;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: #c53030;
  }
`;

const UploadButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
`;

const InfoTitle = styled.h4`
  color: #2b6cb0;
  margin: 0 0 8px 0;
  font-size: 1rem;
`;

const InfoText = styled.p`
  color: #2c5282;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.1;
`;

const ResultadoContainer = styled.div`
  margin-top: 24px;
  padding: 20px;
  border-radius: 8px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
`;

const ResultadoTitulo = styled.h3`
  margin: 0 0 16px 0;
  color: #2d3748;
  font-size: 1.2rem;
`;

const ListaExitosa = styled.div`
  margin-bottom: 20px;
`;

const ListaErrores = styled.div`
  margin-bottom: 16px;
`;

const SubTitulo = styled.h4`
  margin: 0 0 8px 0;
  color: #2b6cb0;
  font-size: 1rem;
`;

const SubTituloError = styled.h4`
  margin: 0 0 8px 0;
  color: #c53030;
  font-size: 1rem;
`;

const ListaItem = styled.div`
  padding: 6px 12px;
  margin: 4px 0;
  border-radius: 4px;
  background: #e6fffa;
  border-left: 4px solid #38b2ac;
  font-size: 0.9rem;
  color: #234e52;
`;

const ErrorItem = styled.div`
  padding: 6px 12px;
  margin: 4px 0;
  border-radius: 4px;
  background: #fed7d7;
  border-left: 4px solid #e53e3e;
  font-size: 0.9rem;
  color: #822727;
`;

const NuevoCargaButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 16px;

  &:hover {
    background: #2d3748;
  }
`;

const CalificarEntregaCsv = () => {
  const { tareaId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast.error("Por favor selecciona un archivo CSV válido");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast.error("Por favor arrastra un archivo CSV válido");
    }
    event.target.classList.remove('dragover');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.target.classList.add('dragover');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.target.classList.remove('dragover');
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const limpiarResultados = () => {
    setResultado(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Por favor selecciona un archivo CSV");
      return;
    }
    if (!tareaId) {
      toast.error("No se encontró el id de la tarea");
      return;
    }
    setLoading(true);
    setResultado(null);
    try {
      let urlBase = import.meta.env.VITE_BACKEND_URL;
      if (urlBase.endsWith("/")) urlBase = urlBase.slice(0, -1);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('file', selectedFile);
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      };
      const response = await axios.post(`${urlBase}/entregables/calificar-csv`, formData, config);
      setResultado(response.data);
      const totalExitosos = response.data.exitosos || 0;
      const totalErrores = response.data.errores || 0;
      if (totalExitosos > 0) {
        toast.success(`${totalExitosos} entregas calificadas exitosamente`);
      }
      if (totalErrores > 0) {
        toast.warning(`${totalErrores} errores encontrados`);
      }
      setSelectedFile(null);
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || error.response.data?.error || "Formato de archivo incorrecto";
        toast.error(`Error 400: ${errorMessage}`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al procesar el archivo CSV");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
    <ContentWrapper>
      <Title>Calificar entregas vía CSV</Title>
      <InfoBox>
        <InfoTitle>Formato del archivo CSV</InfoTitle>
        <InfoText>
          El archivo debe contener las columnas:.<br />
          La primera fila debe contener el nombre de las columnas.<br /><br />
          Ejemplo:<br />
        </InfoText>
      </InfoBox>
      {!selectedFile ? (
        <FileInputContainer
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <FileLabel htmlFor="csvFile">
            <FileText>Haz clic aquí o arrastra un archivo CSV</FileText>
            <FileSubtext>Solo archivos .csv son permitidos</FileSubtext>
          </FileLabel>
          <FileInput
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
          />
        </FileInputContainer>
      ) : (
        <SelectedFile>
          <FileName>📄 {selectedFile.name}</FileName>
          <RemoveButton onClick={removeFile}>Remover</RemoveButton>
        </SelectedFile>
      )}
      <UploadButton
        onClick={handleUpload}
        disabled={!selectedFile || loading}
      >
        {loading ? "Procesando..." : "Calificar entregas"}
      </UploadButton>
      {resultado && (
        <ResultadoContainer>
          <ResultadoTitulo>Resultados de la carga</ResultadoTitulo>
          {resultado.detalle_exitos && resultado.detalle_exitos.length > 0 && (
            <ListaExitosa>
              <SubTitulo>✅ Calificaciones exitosas ({resultado.detalle_exitos.length}):</SubTitulo>
              {resultado.detalle_exitos.map((item, index) => (
                <ListaItem key={`success-${index}`}>
                  👤 {item}
                </ListaItem>
              ))}
            </ListaExitosa>
          )}
          {resultado.detalle_errores && resultado.detalle_errores.length > 0 && (
            <ListaErrores>
              <SubTituloError>❌ Errores encontrados ({resultado.detalle_errores.length}):</SubTituloError>
              {resultado.detalle_errores.map((error, index) => (
                <ErrorItem key={`error-${index}`}>
                  ⚠️ {error}
                </ErrorItem>
              ))}
            </ListaErrores>
          )}
          <NuevoCargaButton onClick={limpiarResultados}>
            Nueva Carga
          </NuevoCargaButton>
        </ResultadoContainer>
      )}
    </ContentWrapper>
    </Container>
  );
};

export default CalificarEntregaCsv;