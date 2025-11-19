

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

const Container = styled.div`
  background-color: white;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center; 
`;

const Card = styled.div`
  background: #fff;
  color: #222;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 16px #eee;
  max-width: 500px;
  margin: 0 auto;
`;
const CalificarButton = styled.button`
  width: 100%;
  margin-top: 32px;
  background: #4C241D;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #eee;
`;

const DesmatricularButton = styled.button`
  width: 100%;
  margin-top: 18px;
  background: #d72d3eff;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #eee;
`;


const CalificacionPerfilEstudiante = () => {
  const { estudianteId, id } = useParams();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [calificacion, setCalificacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token");

        const estudianteResp = await axios.get(`${urlBase}/usuarios/${estudianteId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setEstudiante(estudianteResp.data);
        // el get de calificaciones
        /*const calificacionResp = await axios.get(`${urlBase}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCalificacion(calificacionResp.data);*/
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (estudianteId && id) fetchDatos();
  }, [estudianteId, id]);


  const handleDesmatricular = async () => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${urlBase}/cursos/desmatricularEstudiante`, {
        idCurso: Number(id),
        idUsuario: Number(estudianteId)
      }, config);
      toast.success("Estudiante desmatriculado correctamente");
      navigate(-1);
    } catch (err) {
      toast.error("Error al desmatricular estudiante");
    }
  };

  if (loading) return <Container>Cargando datos...</Container>;
  if (error) return <Container>Error: {error}</Container>;
  if (!estudiante) return <Container>No se encontró el estudiante.</Container>;

  return (
    <Container>
      <Card>
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Perfil del Estudiante</h2>
        <p><strong>Nombre:</strong> {estudiante.nombres} {estudiante.apellidos}</p>
        <p><strong>Correo:</strong> {estudiante.correo}</p>
        <p><strong>Cédula:</strong> {estudiante.cedula}</p>
        <h3 style={{ marginTop: 24 }}>Calificación en el curso:</h3>
        <div style={{ textAlign: 'center' }}>
          <CalificarButton onClick={() => navigate(`/curso/${id}/estudiante/${estudianteId}/calificar`)}>
            Calificar estudiante
          </CalificarButton>
          <DesmatricularButton onClick={handleDesmatricular}>
            Desmatricular estudiante
          </DesmatricularButton>
        </div>
      </Card>
    </Container>
  );
};

export default CalificacionPerfilEstudiante;
