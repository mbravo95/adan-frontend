import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
	max-width: 1000px;
	margin: 40px auto;
`;

const Card = styled.div`
	background: #e2e2e2ff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.07);
	padding: 32px 28px;
`;

const Title = styled.h2`
	font-size: 3rem;
	font-weight: 600;
	margin-bottom: 18px;
	color: #2d3748;
`;

const MessageList = styled.div`
	margin-top: 18px;
`;

const Meta = styled.div`
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 6px;
  position: absolute;
  right: 24px;
  bottom: 18px;
`;

const MessageItem = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  padding: 24px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const ContenidoMensaje = styled.div`
  flex: 1;
`;

const BotonPublicar = styled.button`
	display: block;
	margin: 28px auto 0 auto;
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

const CuerpoMensaje = styled.div`
	font-size: 1.25rem;
`;

const FotoPerfil = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
`;

const InfoAutor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
`;

const SeparadorAutor = styled.div`
  width: 1px;
  background: #e2e8f0;
  align-self: stretch;
  margin: 0 24px;
`;

const Hilo = () => {
	const { recursoId, hiloId, codigo, seccion } = useParams();
	const navigate = useNavigate();
	const [titulo, setTitulo] = useState("");
	const [mensajes, setMensajes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchForoYHilo = async () => {
			try {
				const urlBase = import.meta.env.VITE_BACKEND_URL;
				const token = localStorage.getItem("token");
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const response = await axios.get(`${urlBase}/recursos/foro/${recursoId}`, config);
				const hilos = response.data.hilos || [];
				const hilo = hilos.find(h => String(h.id) === String(hiloId));
				if (hilo) {
					setTitulo(hilo.titulo || "Hilo");
					setMensajes(hilo.mensajes || []);
				} else {
					setTitulo("Hilo no encontrado");
					setMensajes([]);
				}
			} catch (err) {
				setError("Error al cargar los mensajes del hilo.");
			} finally {
				setLoading(false);
			}
		};
		fetchForoYHilo();
	}, [recursoId, hiloId]);

	const irAPublicarMensaje = (recursoId, hiloId) => {
		navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}/publicar-mensaje`);
	};

	function formatFecha(fecha) {
		if (!fecha) return "";
		const d = new Date(fecha);
		if (isNaN(d)) return fecha;
		return d.toLocaleString('es-ES', {
			day: '2-digit', month: '2-digit', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}

	function renderMensaje(msg) {
		return [
			<MessageItem key={msg.id}>
				<InfoAutor>
					<FotoPerfil src={msg.fotoPerfil || '/default-profile.png'} alt="Foto de perfil" />
					<span style={{ fontWeight: 600, marginTop: 6 }}>{msg.autorNombres} {msg.autorApellidos}</span>
				</InfoAutor>
				<SeparadorAutor />
				<ContenidoMensaje>
					<CuerpoMensaje>{msg.cuerpo}</CuerpoMensaje>
					<Meta>{formatFecha(msg.fechaMensaje)}</Meta>
				</ContenidoMensaje>
			</MessageItem>,
			Array.isArray(msg.respuestas) && msg.respuestas.length > 0 &&
				msg.respuestas.map((resp) => renderMensaje(resp))
		];
	}

	return (
		<Container>
			<Card>
				<Title>{titulo}</Title>
				<BotonPublicar onClick={() => irAPublicarMensaje(recursoId, hiloId)}>
					Publicar nuevo mensaje
				</BotonPublicar>
				{loading ? (
					<div style={{ textAlign: 'center', color: '#666', fontSize: '16px', margin: '30px 0' }}>Cargando mensajes...</div>
				) : error ? (
					<div style={{ color: 'red', textAlign: 'center', margin: '30px 0' }}>{error}</div>
				) : (
					<MessageList>
						{mensajes.length === 0 ? (
							<div style={{ color: '#999', textAlign: 'center', fontSize: '15px', margin: '20px 0' }}>No hay mensajes en este hilo.</div>
						) : (
							mensajes.map((msg) => renderMensaje(msg))
						)}
					</MessageList>
				)}
			</Card>
		</Container>
	);
}

export default Hilo;
