import React, { useState, useEffect } from "react";
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

const EditarMensajeHiloForo = ({ onCancelar }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [cuerpo, setCuerpo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const { recursoId, hiloId, codigo, seccion, idMensaje } = useParams();
  const correoAutor = profile?.correo || "";

  // Cargar datos del mensaje a editar
  useEffect(() => {
    const cargarMensaje = async () => {
      try {
        setLoadingData(true);
        let urlBase = import.meta.env.VITE_BACKEND_URL;
        if (urlBase.endsWith("/")) urlBase = urlBase.slice(0, -1);
        
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // Obtener datos del foro para encontrar el mensaje
        const response = await axios.get(`${urlBase}/recursos/foro/${recursoId}`, config);
        const hilos = response.data.hilos || [];
        const hilo = hilos.find(h => String(h.id) === String(hiloId));
        
        if (hilo) {
          const mensaje = hilo.mensajes?.find(m => String(m.id) === String(idMensaje));
          if (mensaje) {
            setCuerpo(mensaje.cuerpo);
          } else {
            setError("Mensaje no encontrado");
          }
        } else {
          setError("Hilo no encontrado");
        }
      } catch (err) {
        console.error("Error al cargar mensaje:", err);
        setError("Error al cargar los datos del mensaje");
      } finally {
        setLoadingData(false);
      }
    };

    if (idMensaje) {
      cargarMensaje();
    }
  }, [recursoId, hiloId, idMensaje]);

  const handleEditar = async () => {
    setLoading(true);
    setError("");
    try {
      let urlBase = import.meta.env.VITE_BACKEND_URL;
      if (urlBase.endsWith("/")) urlBase = urlBase.slice(0, -1);
      const apiUrl = `${urlBase}/mensajes/foro/${recursoId}/hilo/${hiloId}/editarMensaje/${idMensaje}`;
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
        idMensaje: Number(idMensaje),
        correoAutor,
        cuerpo,
      };
      console.log('PUT', apiUrl, payload, config);
      await axios.put(apiUrl, payload, config);
      toast.success("Mensaje editado correctamente");
      navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}`);
    } catch (err) {
      setError("Error al editar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}`);
  };

  if (loadingData) {
    return (
      <FormContainer>
        <div style={{ textAlign: 'center', color: '#666' }}>Cargando datos del mensaje...</div>
      </FormContainer>
    );
  }

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
        <BotonCancelar type="button" onClick={handleCancelar} disabled={loading}>Cancelar</BotonCancelar>
        <Boton type="button" onClick={handleEditar} disabled={loading || !cuerpo}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Boton>
      </ButtonRow>
    </FormContainer>
  );
};

export default EditarMensajeHiloForo;
