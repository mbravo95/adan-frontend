import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

const Container = styled.div`
	background-color: white;
	width: 100vw;
	min-height: calc(100vh - 60px);
	margin-top: 60px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	box-sizing: border-box;
`;

const Card = styled.div`
	background: #f8f9fa;
	border-radius: 12px;
	box-shadow: 0 4px 16px rgba(0,0,0,0.08);
	padding: 32px 40px;
	margin-top: 40px;
	min-width: 400px;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.h1`
	font-size: 2.2em;
	color: #222;
	margin-bottom: 32px;
	font-family: 'Inter', sans-serif;
	font-weight: 800;
`;

const ThreadsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	width: 100%;
	margin-bottom: 32px;
`;

const ThreadCard = styled.div`
	background: #fff;
	border-radius: 10px;
	padding: 18px 24px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.07);
	color: #222;
	font-size: 1.1em;
	display: flex;
	flex-direction: column;
	border: 1px solid #e0e0e0;
`;

const NewThreadButton = styled.button`
	background: #5a2e2e;
	color: #fff;
	border: none;
	border-radius: 8px;
	padding: 14px 32px;
	font-size: 1.1em;
	font-weight: bold;
	cursor: pointer;
	margin-bottom: 10px;
	margin-top: 10px;
	transition: background 0.2s;
	&:hover {
		background: #4b2525;
	}
`;

const Foro = () => {
	const { seccion, codigo } = useParams();
	const navigate = useNavigate();
	const [hilos, setHilos] = useState([]);
	const recursoid = useParams().foroId;
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
				const response = await axios.get(`${urlBase}/recursos/${recursoid}`, config);
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
		navigate(`/curso/${codigo}/seccion/${seccion}/crear-foro`);
	};

	return (
		<Container>
			<Card>
				<Title>{nombreForo}</Title>
				<NewThreadButton onClick={handleCrearNuevoHilo}>Crear nuevo hilo</NewThreadButton>
				{loading ? (
					<div style={{ textAlign: 'center', color: '#666', fontSize: '16px', margin: '30px 0' }}>Cargando hilos...</div>
				) : error ? (
					<div style={{ color: 'red', textAlign: 'center', margin: '30px 0' }}>{error}</div>
				) : (
					<ThreadsList>
						{hilos.length === 0 ? (
							<div style={{ color: '#999', textAlign: 'center', fontSize: '15px', margin: '20px 0' }}>No hay hilos en este foro.</div>
						) : (
							hilos.map((hilo) => (
								<ThreadCard key={hilo.id}>
									<strong style={{ fontSize: '1.15em', color: '#222', marginBottom: '6px' }}>{hilo.id}</strong>
								</ThreadCard>
							))
						)}
					</ThreadsList>
				)}
			</Card>
		</Container>
	);
};

export default Foro;
