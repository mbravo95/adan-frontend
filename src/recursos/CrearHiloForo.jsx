import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

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
  margin-bottom: 20px;
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
      <ContentWrapper>
        <FormWrapper>
          <Title>Crear Hilo en Foro</Title>
          <form onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Título del hilo"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                disabled={loading}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="cuerpo">Mensaje inicial</Label>
              <TextArea
                id="cuerpo"
                placeholder="Cuerpo del mensaje"
                value={cuerpo}
                onChange={e => setCuerpo(e.target.value)}
                disabled={loading}
              />
            </FormGroup>
            <ButtonGroup>
              <CancelButton type="button" onClick={handleCancelar} disabled={loading}>
                Cancelar
              </CancelButton>
              <CreateButton type="button" onClick={handleCrearHilo} disabled={loading}>
                {loading ? "Creando..." : "Crear hilo"}
              </CreateButton>
            </ButtonGroup>
          </form>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default CrearHiloForo;