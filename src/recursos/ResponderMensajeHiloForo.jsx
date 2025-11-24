import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Container = styled.div`
  background-color: #ffffffff;
  min-height: 100vh;
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
  max-width: 600px;
  padding: 0 20px;
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
  color: #333;
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
`;

const MensajeOriginalContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 24px;
`;

const MensajeOriginalHeader = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MensajeOriginalContent = styled.div`
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
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
  min-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  
  &::placeholder {
    color: #999;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
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

const RespondButton = styled(Button)`
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 4px;
`;

const ResponderMensajeHiloForo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [cuerpo, setCuerpo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensajeOriginal, setMensajeOriginal] = useState(null);
  const { recursoId, hiloId, idMensaje, codigo, seccion } = useParams();
  const correoAutor = profile?.correo || "";

  useEffect(() => {
    // Obtener el mensaje original desde el state de navegación o cargar desde API
    if (location.state?.mensajeOriginal) {
      setMensajeOriginal(location.state.mensajeOriginal);
    } else {
      // Si no hay state, cargar el mensaje desde la API
      cargarMensajeOriginal();
    }
  }, [idMensaje]);

  const cargarMensajeOriginal = async () => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      };
      const response = await axios.get(`${urlBase}/recursos/foro/${recursoId}`, config);
      const hilos = response.data.hilos || [];
      const hilo = hilos.find(h => String(h.id) === String(hiloId));
      if (hilo) {
        const mensaje = hilo.mensajes.find(m => String(m.id) === String(idMensaje));
        if (mensaje) {
          setMensajeOriginal(mensaje.cuerpo);
        }
      }
    } catch (err) {
      toast.error("Error al cargar el mensaje original");
    }
  };

  const handleResponder = async () => {
    setLoading(true);
    setError("");
    try {
      let urlBase = import.meta.env.VITE_BACKEND_URL;
      if (urlBase.endsWith("/")) urlBase = urlBase.slice(0, -1);
      const apiUrl = `${urlBase}/mensajes/foro/responderMensaje`;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = {
        idForo: Number(recursoId),
        idHilo: Number(hiloId),
        idMensajePadre: Number(idMensaje),
        correoAutor,
        cuerpo
      };
      console.log('POST', apiUrl, payload, config);
      await axios.post(apiUrl, payload, config);
      setCuerpo("");
      toast.success("Respuesta publicada correctamente");
      navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}`);
    } catch (err) {
      setError("Error al publicar la respuesta.");
      toast.error("Error al publicar la respuesta");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}`);
  };

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <Title>Responder Mensaje</Title>
          
          {mensajeOriginal && (
            <MensajeOriginalContainer>
              <MensajeOriginalHeader>En respuesta a:</MensajeOriginalHeader>
              <MensajeOriginalContent>{mensajeOriginal}</MensajeOriginalContent>
            </MensajeOriginalContainer>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              {/*<Label htmlFor="cuerpo">Tu respuesta</Label>*/}
              <TextArea
                id="cuerpo"
                value={cuerpo}
                onChange={e => setCuerpo(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                disabled={loading}
              />
            </FormGroup>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonGroup>
              <CancelButton type="button" onClick={handleCancelar} disabled={loading}>
                Cancelar
              </CancelButton>
              <RespondButton type="button" onClick={handleResponder} disabled={loading || !cuerpo}>
                {loading ? "Publicando..." : "Responder"}
              </RespondButton>
            </ButtonGroup>
          </form>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default ResponderMensajeHiloForo;