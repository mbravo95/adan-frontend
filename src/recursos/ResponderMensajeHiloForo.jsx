import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const FormContainer = styled.div`
  max-width: 800px;
  margin: 32px auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 32px 28px;
`;

const MensajeOriginalContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
`;

const MensajeOriginalHeader = styled.h4`
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #495057;
  font-weight: 600;
`;

const MensajeOriginalContent = styled.div`
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 1.1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  font-size: 1rem;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 18px;
  resize: vertical;
  font-family: inherit;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

const Boton = styled.button`
  padding: 10px 22px;
  background: #3182ce;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
  }
`;

const BotonCancelar = styled(Boton)`
  background: #aaa;
  &:hover {
    background: #888;
  }
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
    <FormContainer>
      <h2 style={{ marginBottom: '24px', color: '#2d3748' }}>Responder Mensaje</h2>
      
      {mensajeOriginal && (
        <MensajeOriginalContainer>
          <MensajeOriginalHeader>En respuesta a:</MensajeOriginalHeader>
          <MensajeOriginalContent>{mensajeOriginal}</MensajeOriginalContent>
        </MensajeOriginalContainer>
      )}

      <Label htmlFor="cuerpo">Tu respuesta</Label>
      <TextArea
        id="cuerpo"
        value={cuerpo}
        onChange={e => setCuerpo(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        disabled={loading}
      />
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <ButtonRow>
        <BotonCancelar type="button" onClick={handleCancelar} disabled={loading}>
          Cancelar
        </BotonCancelar>
        <Boton type="button" onClick={handleResponder} disabled={loading || !cuerpo}>
          {loading ? "Publicando..." : "Responder"}
        </Boton>
      </ButtonRow>
    </FormContainer>
  );
};

export default ResponderMensajeHiloForo;