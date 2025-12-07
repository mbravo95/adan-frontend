import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { puedeAdministrarCursos } from '../utils/permisoCursos';
import useAuth from '../hooks/useAuth';
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

const Container = styled.div`
	background-color: #ffffffff;
	min-height: 100vh;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding-top: 90px;
	padding-bottom: 20px;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 900px;
	padding: 0 20px;
`;

const Card = styled.div`
	background-color: white;
	border-radius: 10px;
	padding: 40px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	border: 1px solid #e0e0e0;
	width: 100%;
`;

const Title = styled.h2`
	color: #333;
	font-size: 28px;
	margin-bottom: 20px;
	text-align: center;
	font-weight: 600;
`;

const MessageList = styled.div`
	margin-top: 20px;
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
	border: 1px solid #ddd;
	border-radius: 4px;
	padding: 24px;
	margin-bottom: 16px;
	display: flex;
	gap: 0;
	position: relative;
	transform: translateZ(0);
	contain: layout;
	min-height: 80px;
	transition: all 0.3s ease;
	
	&:hover {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
	}
`;

const ContenidoMensaje = styled.div`
	flex: 1;
	min-width: 0;
	padding-bottom: 25px;
`;

const MensajeOriginal = styled.div`
	background: #f0f0f0;
	border-left: 3px solid #ccc;
	padding: 8px 12px;
	margin-bottom: 12px;
	font-size: 0.9rem;
	color: #666;
	border-radius: 4px;
	word-wrap: break-word;
	overflow-wrap: break-word;
	word-break: break-word;
	white-space: pre-wrap;
	
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

	svg {
		display: block;
	}
	
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
	margin: 0 auto 28px auto;
	padding: 14px 20px;
	background-color: #2a2a2a;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	
	&:hover {
		background-color: #171717ff;
	}
`;

const CuerpoMensaje = styled.div`
	font-size: 1rem;
	color: #333;
	word-wrap: break-word;
	overflow-wrap: break-word;
	word-break: break-word;
	white-space: pre-wrap;
	max-width: 100%;
	margin-top: 13px;
`;

const FotoPerfil = styled.img`
	width: 64px;
	height: 64px;
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

const BackButton = styled.button`
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #d0d0d0;
  }
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

	const volverAlForo = () => {
		navigate(`/curso/${codigo}/foro/${recursoId}`);
	};

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
					<FotoPerfil
						src={finalUrl}
						alt="Foto de perfil"
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
							<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M14.6882 5.2085C16.3722 5.2085 17.8175 5.75537 19.0241 6.84912C20.2307 7.94287 20.834 9.30572 20.834 10.9377C20.834 12.5696 20.2307 13.9325 19.0241 15.0262C17.8175 16.12 16.3722 16.6668 14.6882 16.6668H8.12565L10.834 19.3752L9.37565 20.8335L4.16732 15.6252L9.37565 10.4168L10.834 11.8752L8.12565 14.5835H14.6882C15.7819 14.5835 16.7324 14.2363 17.5397 13.5418C18.347 12.8474 18.7507 11.9793 18.7507 10.9377C18.7507 9.896 18.347 9.02794 17.5397 8.3335C16.7324 7.63905 15.7819 7.29183 14.6882 7.29183H7.29232V5.2085H14.6882Z" fill="#1D1B20"/>
							</svg>
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
								<svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M5.20833 19.7917H6.69271L16.875 9.60937L15.3906 8.125L5.20833 18.3073V19.7917ZM3.125 21.875V17.4479L16.875 3.72396C17.0833 3.53299 17.3134 3.38542 17.5651 3.28125C17.8168 3.17708 18.0816 3.125 18.3594 3.125C18.6372 3.125 18.9062 3.17708 19.1667 3.28125C19.4271 3.38542 19.6528 3.54167 19.8438 3.75L21.276 5.20833C21.4844 5.39931 21.6363 5.625 21.7318 5.88542C21.8273 6.14583 21.875 6.40625 21.875 6.66667C21.875 6.94444 21.8273 7.2092 21.7318 7.46094C21.6363 7.71267 21.4844 7.94271 21.276 8.15104L7.55208 21.875H3.125ZM16.1198 8.88021L15.3906 8.125L16.875 9.60937L16.1198 8.88021Z" fill="#1D1B20"/>
								</svg>
							</span>
							<span
								title="Eliminar mensaje"
								style={{ color: '#ff0000' }}
								onClick={e => {
									e.stopPropagation();
									eliminarMensaje(msg.id);
								}}
							>
								<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6.66732 19.7918L5.20898 18.3335L11.0423 12.5002L5.20898 6.66683L6.66732 5.2085L12.5007 11.0418L18.334 5.2085L19.7923 6.66683L13.959 12.5002L19.7923 18.3335L18.334 19.7918L12.5007 13.9585L6.66732 19.7918Z" fill="#1D1B20"/>
								</svg>
							</span>
						</>
					)}
				</BotonesAccion>
			</MessageItem>
		);
	}

	return (
		<Container>
			<ContentWrapper>
				<Card>
					<BackButton onClick={volverAlForo}>
						← Volver al foro
					</BackButton>
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
			</ContentWrapper>
		</Container>
	);
}

export default Hilo;