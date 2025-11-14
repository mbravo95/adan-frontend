import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { puedeAdministrarCursos } from '../utils/permisoCursos';
import useAuth from '../hooks/useAuth';
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
  font-size: 0.85rem;
  color: #888;
  position: absolute;
  bottom: 8px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e0e6ed;
  z-index: 1;
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
	min-height: 80px;
`;const ContenidoMensaje = styled.div`
  flex: 1;
  min-width: 0; /* Evitar flex shrink issues */
  padding-bottom: 25px; /* Espacio para la fecha */
`;

const MensajeOriginal = styled.div`
  background: #f0f0f0;
  border-left: 3px solid #ccc;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #666;
  border-radius: 4px;
  
  &::before {
    content: "En respuesta a:";
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #999;
    margin-bottom: 4px;
  }
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
	font-size: 1rem;
`;

const FotoPerfil = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 8px;
  background-color: #f0f0f0;
  border: 2px solid #e2e8f0;
`;

const InfoAutor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  width: 120px;
  min-width: 120px;
  flex-shrink: 0;
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
	const { profile } = useAuth();
	const [titulo, setTitulo] = useState("");
	const [mensajes, setMensajes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [mensajesVisibles, setMensajesVisibles] = useState(10);
	const [fotosAutores, setFotosAutores] = useState({});

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
					const aplanarMensajes = (mensajes, mensajePadre = null) => {
						let todosLosMensajes = [];
						
						mensajes.forEach(mensaje => {
							todosLosMensajes.push({
								...mensaje,
								mensajeOriginal: mensajePadre ? mensajePadre.cuerpo : null,
								respuestas: []
							});

							if (mensaje.respuestas && mensaje.respuestas.length > 0) {
								todosLosMensajes = todosLosMensajes.concat(
									aplanarMensajes(mensaje.respuestas, mensaje)
								);
							}
						});
						
						return todosLosMensajes;
					};

					const mensajesAplanados = aplanarMensajes(hilo.mensajes || []);
					const mensajesOrdenados = mensajesAplanados.sort(
						(a, b) => new Date(a.fechaMensaje) - new Date(b.fechaMensaje)
					);
					
					setMensajes(mensajesOrdenados);
					setMensajesVisibles(10);
					// Obtener los idAutor únicos
					const idsAutores = [...new Set(mensajesOrdenados.map(m => m.idAutor).filter(Boolean))];
					// Peticiones para cada autor
					const urlBase = import.meta.env.VITE_BACKEND_URL;
					const token = localStorage.getItem("token");
					const config = {
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						}
					};
					const promesas = idsAutores.map(id =>
						axios.get(`${urlBase}/usuarios/${id}`, config)
							.then(res => ({ id, fotoPerfil: res.data.fotoPerfil }))
							.catch(() => ({ id, fotoPerfil: null }))
					);
					const resultados = await Promise.all(promesas);
					const fotos = {};
					resultados.forEach(({ id, fotoPerfil }) => {
						fotos[id] = fotoPerfil;
					});
					setFotosAutores(fotos);
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

	const irAResponderMensaje = (recursoId, hiloId, mensajeId) => {
		navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoId}/hilo/${hiloId}/responder-mensaje/${mensajeId}`, {
			state: { 
				responderA: mensajeId,
				mensajeOriginal: mensajes.find(m => m.id === mensajeId)?.cuerpo
			}
		});
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
		axios.put(`${urlBase}/mensajes/foro/${recursoId}/hilo/${hiloId}/editarMensaje/${idMensaje}`, payload, config)
			.then(() => {
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
		let fotoPerfil = fotosAutores[msg.idAutor] || null;
		let finalUrl = '/default-profile.png';
		if (fotoPerfil) {
			const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/api$/, '').replace(/\/api\/$/, '');
			finalUrl = fotoPerfil.startsWith('http') ? fotoPerfil : `${baseUrl}${fotoPerfil}`;
		}

		if (msg.idAutor === profile?.id) {
			console.log('FORO FOTO PERFIL', msg.idAutor, finalUrl, msg);
		}
		return (
			<MessageItem key={msg.id}>
				<InfoAutor>
					<img
						src={finalUrl}
						alt="Foto de perfil"
						style={{ width: "64px", height: "64px", objectFit: "cover", marginBottom: "8px" }}
					/>
					<span style={{ 
						fontWeight: 600, 
						fontSize: '0.85rem',
						textAlign: 'center',
						lineHeight: 1.2,
						color: '#4a5568'
					}}>
						{msg.autorNombres} {msg.autorApellidos}
					</span>
				</InfoAutor>
				<SeparadorAutor />
			<ContenidoMensaje>
				{msg.mensajeOriginal && (
					<MensajeOriginal>
						{msg.mensajeOriginal}
					</MensajeOriginal>
				)}
				<CuerpoMensaje>{msg.cuerpo}</CuerpoMensaje>
			</ContenidoMensaje>
			<Meta>{formatFecha(msg.fechaMensaje)}</Meta>
				<BotonesAccion>
					{msg.cuerpo !== "{Mensaje Eliminado}" && (
						<span
							title="Responder mensaje"
							style={{ color: '#4285f4' }}
							onClick={e => {
								e.stopPropagation();
								irAResponderMensaje(recursoId, hiloId, msg.id);
							}}
						>
							↩️
						</span>
					)}
					{(puedeAdministrarCursos(location.pathname) || msg.idAutor === profile?.id) && msg.cuerpo !== "{Mensaje Eliminado}" && (
						<>
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
						</>
					)}
				</BotonesAccion>
			</MessageItem>
		);
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
