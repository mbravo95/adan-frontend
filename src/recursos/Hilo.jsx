import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { puedeAdministrarCursos } from '../utils/permisoCursos';
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

const MainContainer = styled.div`
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const Container = styled.div`
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	scroll-behavior: smooth;
	padding: 20px 16px;
	max-width: 1000px;
	margin: 0 auto;
	width: 100%;
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
  margin-top: 12px;
  text-align: right;
`;

const MessageItem = styled.div`
	background: #fafafa;
	border: 1px solid #e0e6ed;
	border-radius: 8px;
	padding: 24px;
	margin-bottom: 16px;
	display: flex;
	gap: 0;
	position: relative;
	transform: translateZ(0);
	contain: layout;
`;const ContenidoMensaje = styled.div`
  flex: 1;
  min-width: 0; /* Evitar flex shrink issues */
`;

const BotonesAccion = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  top: 12px;
  right: 12px;
  
  span {
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(0,0,0,0.1);
    }
  }
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
	const location = useLocation();
	const [titulo, setTitulo] = useState("");
	const [mensajes, setMensajes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [mensajesVisibles, setMensajesVisibles] = useState(10); // Mostrar solo 10 inicialmente

	useEffect(() => {
		const fetchForoYHilo = async () => {
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
					setTitulo(hilo.titulo || "Hilo");
					setMensajes(hilo.mensajes || []);
					// Resetear mensajes visibles cuando cambie el hilo
					setMensajesVisibles(10);
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

	function eliminarMensaje(idMensaje) {
		if (!confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
			return;
		}
		
		const urlBase = import.meta.env.VITE_BACKEND_URL;
		const token = localStorage.getItem("token");
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		};
		const payload = {
			cuerpo: "{Mensaje Eliminado}"
		};
		console.log('[ELIMINAR MENSAJE] PUT:', `${urlBase}/mensajes/foro/${recursoId}/hilo/${hiloId}/editarMensaje/${idMensaje}`, payload);
		axios.put(`${urlBase}/mensajes/foro/${recursoId}/hilo/${hiloId}/editarMensaje/${idMensaje}`, payload, config)
			.then(() => {
				// Actualizar el mensaje en la lista local
				setMensajes(prev => prev.map(m => 
					m.id === idMensaje 
						? { ...m, cuerpo: "{Mensaje Eliminado}" }
						: m
				));
				toast.success("Mensaje eliminado exitosamente");
			})
			.catch(() => {
				toast.error("Error al eliminar el mensaje");
			});
	}

	function irAEditarMensaje(idMensaje) {
		navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}/editar-mensaje/${idMensaje}`);
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
				{puedeAdministrarCursos(location.pathname) && (
					<BotonesAccion>
						<span
							title="Editar mensaje"
							style={{ color: '#ffd000' }}
							onClick={e => {
								e.stopPropagation();
								irAEditarMensaje(msg.id);
							}}
						>
							✏️
						</span>
						<span
							title="Eliminar mensaje"
							style={{ color: '#ff0000' }}
							onClick={e => {
								e.stopPropagation();
								eliminarMensaje(msg.id);
							}}
						>
							❌
						</span>
					</BotonesAccion>
				)}
			</MessageItem>,
			Array.isArray(msg.respuestas) && msg.respuestas.length > 0 &&
				msg.respuestas.map((resp) => renderMensaje(resp))
		];
	}

	return (
		<MainContainer>
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
					<MessageList 
						onScroll={(e) => {
							const { scrollTop, scrollHeight, clientHeight } = e.target;
							// Cargar más mensajes cuando se acerca al final
							if (scrollHeight - scrollTop <= clientHeight + 100 && mensajesVisibles < mensajes.length) {
								setMensajesVisibles(prev => Math.min(prev + 5, mensajes.length));
							}
						}}
					>
						{mensajes.length === 0 ? (
							<div style={{ color: '#999', textAlign: 'center', fontSize: '15px', margin: '20px 0' }}>No hay mensajes en este hilo.</div>
						) : (
							<>
								{mensajes.slice(0, mensajesVisibles).map((msg) => renderMensaje(msg))}
								{mensajesVisibles < mensajes.length && (
									<div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
										Cargando más mensajes... ({mensajesVisibles} de {mensajes.length})
									</div>
								)}
							</>
						)}
					</MessageList>
				)}
			</Card>
		</Container>
		</MainContainer>
	);
}

export default Hilo;
