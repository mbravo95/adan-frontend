
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";

const Container = styled.div`
  background-color: white;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  padding: 40px;
  box-sizing: border-box;
`;
const Card = styled.div`
  background: #fff;
  color: #222;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 16px #eee;
  max-width: 400px;
  margin: 0 auto;
`;
const Button = styled.button`
  background: #4C241D;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 16px 8px 0 8px;
  box-shadow: 0 2px 8px #eee;
`;
const CancelButton = styled(Button)`
  background: #e0e0e0;
  color: #333;
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
      await fetch(`${urlBase}/calificaciones`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
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
      <Card>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Calificar Estudiante</h2>
        <label htmlFor="calificacion" style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Calificación final:</label>
        <input
          id="calificacion"
          type="text"
          value={calificacion}
          onChange={e => { setCalificacion(e.target.value); setError(""); }}
          style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "12px" }}
        />
        {error && <div style={{ color: "#b71c1c", marginBottom: 12 }}>{error}</div>}
        <div style={{ textAlign: "center" }}>
          <Button onClick={handleConfirmar}>Confirmar calificación</Button>
          <CancelButton onClick={handleCancelar}>Cancelar</CancelButton>
        </div>
      </Card>
    </Container>
  );
};

export default CalificarEstudiante;
