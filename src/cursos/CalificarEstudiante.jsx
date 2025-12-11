
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";

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

const ErrorMessage = styled.div`
  color: #b71c1c;
  font-size: 14px;
  margin-bottom: 15px;
  padding: 8px 12px;
  background-color: #ffebee;
  border-radius: 4px;
  border-left: 4px solid #b71c1c;
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

const CalificarEstudiante = () => {
  const [calificacion, setCalificacion] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id, estudianteId } = useParams();


  const handleConfirmar = async () => {
    if (!calificacion) {
      setError("Debes ingresar una calificación.");
      return;
    }
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const body = {
        idUsuario: Number(estudianteId),
        idCurso: Number(id),
        calificacion: calificacion
      };
      await fetch(`${urlBase}/calificaciones/curso`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      try {
        await fetch(`${urlBase}/notificaciones/avisoCalificacionFinal/curso/${id}/usuario/${estudianteId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (notifError) {
        console.error("Error enviando notificación de calificación final", notifError);
      }

      toast.success("Calificación guardada correctamente");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setError("Error al guardar la calificación.");
    }
  };

  const handleCancelar = () => {
    navigate(-1);
  };


  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <Title>Calificar Estudiante</Title>
          <form>
            <FormGroup>
              <Label htmlFor="calificacion">Calificación final</Label>
              <Input
                id="calificacion"
                type="text"
                value={calificacion}
                onChange={e => { setCalificacion(e.target.value); setError(""); }}
                placeholder="Ingresa la calificación"
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonGroup>
              <CreateButton type="button" onClick={handleConfirmar}>
                Aceptar
              </CreateButton>
              <CancelButton type="button" onClick={handleCancelar}>
                Cancelar
              </CancelButton>
            </ButtonGroup>
          </form>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default CalificarEstudiante;
