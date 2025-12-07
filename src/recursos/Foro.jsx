import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { puedeAdministrarCursos } from '../utils/permisoCursos';
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

const Title = styled.h1`
	color: #333;
	font-size: 28px;
	margin-bottom: 24px;
	text-align: center;
	font-weight: 600;
`;

const NewThreadButton = styled.button`
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

const ThreadsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
`;

const ThreadCard = styled.div`
	background: #fafafa;
	border: 1px solid #ddd;
	border-radius: 4px;
	padding: 20px 24px;
	display: flex;
	flex-direction: column;
	position: relative;
	cursor: pointer;
	transition: all 0.3s ease;
	
	&:hover {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
	}
`;

const ThreadTitle = styled.strong`
	font-size: 1.1em;
	color: #333;
	margin-bottom: 8px;
	font-weight: 600;
`;

const ThreadMeta = styled.span`
	color: #888;
	font-size: 0.9em;
	display: block;
`;

const DeleteButton = styled.span`
	position: absolute;
	right: 12px;
	top: 12px;
	/*font-size: 18px;*/
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	transition: background-color 0.2s;
	
	svg {
		display: block;
	}
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
`;

const LoadingMessage = styled.div`
	text-align: center;
	color: #666;
	font-size: 16px;
	margin: 30px 0;
`;

const ErrorMessage = styled.div`
	color: #e53e3e;
	text-align: center;
	margin: 30px 0;
	padding: 12px;
	background-color: #fff5f5;
	border: 1px solid #feb2b2;
	border-radius: 4px;
`;

const EmptyMessage = styled.div`
	color: #999;
	text-align: center;
	font-size: 15px;
	margin: 20px 0;
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

const Foro = () => {
	// Cuenta mensajes y respuestas anidadas
	function contarMensajesRecursivo(mensajes) {
		if (!Array.isArray(mensajes)) return 0;
		let total = 0;
		for (const msg of mensajes) {
			total += 1;
			if (Array.isArray(msg.respuestas)) {
				total += contarMensajesRecursivo(msg.respuestas);
			}
		}
		return total;
	}
	
	const { seccion, codigo } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [hilos, setHilos] = useState([]);
	const recursoid = useParams().recursoId;
	const [nombreForo, setNombreForo] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchHilos = async () => {
			try {
				const urlBase = import.meta.env.VITE_BACKEND_URL;
				const token = localStorage.getItem("token");
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const response = await axios.get(`${urlBase}/recursos/foro/${recursoid}`, config);
				setNombreForo(response.data.nombre || "Foro");
				setHilos(response.data.hilos || []);
			} catch (err) {
				setError("Error al cargar los hilos del foro.");
			} finally {
				setLoading(false);
			}
		};
		fetchHilos();
	}, [seccion]);

	const handleCrearNuevoHilo = () => {
		navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoid}/crear-hilo`);
	};

	const irAHilo = (hiloId) => {
		navigate(`/curso/${codigo}/seccion/${seccion}/foro/${recursoid}/hilo/${hiloId}`);
	}
	
	const eliminarHilo = async (hiloId) => {
		if (!confirm('¿Estás seguro de que deseas eliminar este hilo?')) {
			return;
		}
		
		try {
			const urlBase = import.meta.env.VITE_BACKEND_URL;
			const token = localStorage.getItem("token");
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				data: {
					idForo: Number(recursoid),
					idHilo: Number(hiloId)
				}
			};
			console.log('[ELIMINAR HILO] body:', config.data);
			await axios.delete(`${urlBase}/recursos/foro/hilo`, config);
			setHilos(prev => prev.filter(h => h.id !== hiloId));
			toast.success("Hilo eliminado exitosamente");
		} catch (err) {
			toast.error("Error al eliminar el hilo");
		}
	};

	const volverAlCurso = () => {
		navigate(`/curso/${codigo}`);
	};

	return (
		<Container>

			<ContentWrapper>
				<Card>
					<BackButton onClick={volverAlCurso}>
						← Volver al curso
					</BackButton>
					<Title>{nombreForo}</Title>
					<NewThreadButton onClick={handleCrearNuevoHilo}>
						Crear nuevo hilo
					</NewThreadButton>
					{loading ? (
						<LoadingMessage>Cargando hilos...</LoadingMessage>
					) : error ? (
						<ErrorMessage>{error}</ErrorMessage>
					) : (
						<ThreadsList>
							{hilos.length === 0 ? (
								<EmptyMessage>No hay hilos en este foro.</EmptyMessage>
							) : (
								hilos.map((hilo) => (
									<ThreadCard key={hilo.id} onClick={() => irAHilo(hilo.id)}>
										<ThreadTitle>{hilo.titulo}</ThreadTitle>
										{hilo.mensajes && hilo.mensajes.length > 0 && (
											<ThreadMeta>
												{(() => {
													const d = new Date(hilo.mensajes[0].fechaMensaje);
													const fecha = isNaN(d) ? '' : d.toLocaleString('es-ES', {
														day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
													});
													const cantidad = contarMensajesRecursivo(hilo.mensajes);
													return `${fecha} · ${cantidad} mensaje${cantidad === 1 ? '' : 's'}`;
												})()}
											</ThreadMeta>
										)}
										{puedeAdministrarCursos(location.pathname) && (
											<DeleteButton
												title="Eliminar hilo"
												onClick={e => {
													e.stopPropagation();
													eliminarHilo(hilo.id);
												}}
											>
												<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M18.75 6.25L6.25 18.75M6.25 6.25L18.75 18.75" stroke="#1E1E1E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
											</DeleteButton>
										)}
									</ThreadCard>
								))
							)}
						</ThreadsList>
					)}
				</Card>
			</ContentWrapper>
		</Container>
	);
};

export default Foro;