import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Spinner from "../general/Spinner";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const EntregasTarea = () => {
  const { tareaId } = useParams();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [calificandoId, setCalificandoId] = useState(null);
  const [calificacion, setCalificacion] = useState("");

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${urlBase}/entregables/tareas/${tareaId}/entregas`, config);
        setEntregas(response.data);
      } catch (error) {
        setEntregas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEntregas();
  }, [tareaId]);
  

  const descargarEntrega = async (tareaId, entregaId, nombreArchivo) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const downloadUrl = `${urlBase}/entregables/${tareaId}/entregas/${entregaId}/descargar`;
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al descargar el archivo");
      const blob = await response.blob();
      const filename = nombreArchivo || `entrega_${entregaId}.zip`;
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Error al descargar el archivo");
    }
  };

  const handleEnviarCalificacion = async (entrega) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const body = {
        idEntregable: entrega.id,
        idTarea: tareaId,
        calificacion: calificacion
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`${urlBase}/entregables/calificar`, body, config);
      toast.success("Calificación enviada correctamente");
      setCalificandoId(null);
      setCalificacion("");
    } catch (error) {
      toast.error("Error al enviar la calificación");
    }
  };

  return (
    <PageContainer>
      <Title>Entregas de la tarea</Title>
      {loading ? (
        <Spinner />
      ) : entregas.length === 0 ? (
        <EmptyMessage>No hay entregas para esta tarea.</EmptyMessage>
      ) : (
        <EntregaList>
          {entregas.map((entrega) => (
            <EntregaItem key={entrega.id}>
              <EntregaInfo>
                <strong>Alumno:</strong> {entrega.nombres} {entrega.apellidos}<br />
                <strong>Fecha de entrega:</strong> {entrega.fechaEntrega ? new Date(entrega.fechaEntrega).toLocaleString('es-ES') : "-"}<br />
                <strong>Archivo:</strong> {entrega.urlEntregable ? entrega.urlEntregable.split('\\').pop() : "-"}<br />
                <strong>Calificación:</strong> {entrega.calificacion ? entrega.calificacion : "Sin calificar"}
              </EntregaInfo>
              <div style={{display:'flex', alignItems:'center'}}>
                <DownloadButton
                  onClick={() => descargarEntrega(entrega.idTarea || tareaId, entrega.id, entrega.urlEntregable ? entrega.urlEntregable.split('\\').pop() : undefined)}
                  as="button"
                >
                  Descargar
                </DownloadButton>
                <button
                  style={{
                    background: '#28a745',
                    color: '#fff',
                    padding: '10px 18px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    marginLeft: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => setCalificandoId(entrega.id)}
                >
                  Calificar entrega
                </button>
              </div>
              {calificandoId === entrega.id && (
                <div style={{marginTop:'10px', display:'flex', alignItems:'center', gap:'10px'}}>
                  <input
                    type="text"
                    value={calificacion}
                    onChange={e => setCalificacion(e.target.value)}
                    placeholder="Ingresa la calificación"
                    style={{padding:'8px', borderRadius:'4px', border:'1px solid #ccc'}}
                  />
                  <button
                    style={{background:'#007bff', color:'#fff', padding:'8px 16px', borderRadius:'4px', border:'none', fontWeight:'bold', cursor:'pointer'}}
                    onClick={() => handleEnviarCalificacion(entrega)}
                  >
                    Enviar
                  </button>
                  <button
                    style={{background:'#ccc', color:'#333', padding:'8px 16px', borderRadius:'4px', border:'none', fontWeight:'bold', cursor:'pointer'}}
                    onClick={() => {
                      setCalificandoId(null);
                      setCalificacion("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </EntregaItem>
          ))}
        </EntregaList>
      )}
    </PageContainer>
  );
};

export default EntregasTarea;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  background: #f8f8f8;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 32px 24px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2em;
  color: #222;
  margin-bottom: 28px;
`;

const EntregaList = styled.ul`
  list-style: none;
  padding: 0;
`;

const EntregaItem = styled.li`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 18px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EntregaInfo = styled.div`
  font-size: 1.1em;
  color: #333;
`;

const DownloadButton = styled.a`
  background: #007bff;
  color: #fff;
  padding: 10px 18px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.2s;
  &:hover {
    background: #0056b3;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.2em;
  margin-top: 40px;
`;
