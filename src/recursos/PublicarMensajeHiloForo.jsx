import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const FormContainer = styled.div`
  max-width: 500px;
  margin: 32px auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 32px 28px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  font-size: 1rem;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 18px;
  resize: vertical;
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



const PublicarMensajeHiloForo = ({ onCancelar }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [cuerpo, setCuerpo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { recursoId, hiloId, codigo, seccion } = useParams();
  const correoAutor = profile?.correo || "";

  const handlePublicar = async () => {
    setLoading(true);
    setError("");
    try {
      let urlBase = import.meta.env.VITE_BACKEND_URL;
      if (urlBase.endsWith("/")) urlBase = urlBase.slice(0, -1);
      const apiUrl = `${urlBase}/mensajes/foro/publicarMensaje`;
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
        correoAutor,
        cuerpo,
      };
      console.log('POST', apiUrl, payload, config);
      await axios.post(apiUrl, payload, config);
      setCuerpo("");
      toast.success("Mensaje publicado correctamente");
      navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}`);
    } catch (err) {
      setError("Error al publicar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Label htmlFor="cuerpo">Mensaje</Label>
      <TextArea
        id="cuerpo"
        value={cuerpo}
        onChange={e => setCuerpo(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
        disabled={loading}
      />
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <ButtonRow>
        <BotonCancelar type="button" onClick={onCancelar} disabled={loading}>Cancelar</BotonCancelar>
        <Boton type="button" onClick={handlePublicar} disabled={loading || !cuerpo}>
          {loading ? "Publicando..." : "Publicar"}
        </Boton>
      </ButtonRow>
    </FormContainer>
  );
};

export default PublicarMensajeHiloForo;
