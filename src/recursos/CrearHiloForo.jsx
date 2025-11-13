import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

const Container = styled.div`
  background-color: white;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 32px 40px;
  margin-top: 40px;
  min-width: 400px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #222;
  margin-bottom: 28px;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.1em;
  color: black;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07);
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.1em;
  color: black;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07);
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
`;

const CreateButton = styled(Button)`
  background-color: #5a2e2e;
  color: #fff;
  &:hover {
    background-color: #4b2525;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e0e0e0;
  color: #333;
  &:hover {
    background-color: #d0d0d0;
  }
`;

const CrearHiloForo = () => {
  const { codigo, seccion, foroId, recursoId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCrearHilo = async () => {
    if (!titulo) {
      toast.error("Debes completar el título.");
      return;
    }
    setLoading(true);
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = {
        idForo: recursoId,
        titulo,
        correoAutor: profile?.correo || "",
      };
      console.log('Payload enviado a la API:', payload);
      const hiloResponse = await axios.post(`${urlBase}/recursos/foro/hilo`, payload, config);
      toast.success("Hilo creado correctamente");
      console.log('Respuesta de creación de hilo:', hiloResponse.data);
  const hiloId = hiloResponse.data.idHilo;
      console.log('Valor de hiloId:', hiloId);
      try {
        let urlBaseMsg = import.meta.env.VITE_BACKEND_URL;
        if (urlBaseMsg.endsWith("/")) urlBaseMsg = urlBaseMsg.slice(0, -1);
        const apiUrl = `${urlBaseMsg}/mensajes/foro/publicarMensaje`;
  const correoAutor = profile?.correo || "";
        const msgPayload = {
          idForo: Number(recursoId),
          idHilo: Number(hiloId),
          correoAutor,
          cuerpo,
        };
        console.log('POST', apiUrl, msgPayload, config);
        await axios.post(apiUrl, msgPayload, config);
        setCuerpo("");
        toast.success("Mensaje publicado correctamente");
        navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}`);
      } catch (err) {
        toast.error("Error al publicar el mensaje.");
      }
    } catch (err) {
      toast.error("Error al crear el hilo");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Card>
        <Title>Crear Hilo en Foro</Title>
        <Form>
          <Input
            type="text"
            placeholder="Título del hilo"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            disabled={loading}
          />
          <TextArea
            placeholder="Cuerpo del mensaje"
            value={cuerpo}
            onChange={e => setCuerpo(e.target.value)}
            disabled={loading}
          />
          <ButtonGroup>
            <CreateButton type="button" onClick={handleCrearHilo} disabled={loading}>
              Crear hilo
            </CreateButton>
            <CancelButton type="button" onClick={handleCancelar} disabled={loading}>
              Cancelar
            </CancelButton>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
};
export default CrearHiloForo;

