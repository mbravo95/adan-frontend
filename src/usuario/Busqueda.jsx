import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import axios from "axios";

const Busqueda = () => {

    const [busqueda, setBusqueda] = useState('');
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    const {profile} = useAuth();

    useEffect(() => {
        const cargarUsuarios = async () => {
            const urlBase = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const response = await axios.get(`${urlBase}/usuarios`, config);
                console.log(response.data);
                setUsuarios(response.data.filter(user => user.id !== profile.id));
                setUsuariosFiltrados(response.data.filter(user => user.id !== profile.id));
            } catch (error) {
                console.log(error);
                setUsuarios([]);
                setUsuariosFiltrados([]);
            }
        };

        cargarUsuarios();
    }, []);

    const handleReset = () => {
        setBusqueda('');
        setUsuariosFiltrados(usuarios);
    };

    const handleSearchClick = async() => {
        if (busqueda.trim() === '') {
            setUsuariosFiltrados(usuarios);
            return;
        }

        const filtro = busqueda.toLowerCase();
        try {
            const urlBase = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${urlBase}/usuarios/buscar?texto=${filtro}`, config);
            setUsuariosFiltrados(response.data);
        } catch (error) {
            console.log(error);
            toast.error("Error al buscar los usuarios", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } 
    };

    const handleDeleteUser = (userId) => {
        console.log(`Eliminando usuario con ID: ${userId}`);
    }

    const formatearFecha = (fechaString) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES', opciones);
    };

  return (
    <>
        <Container>
            <ContentWrapper>
                <Title>Gestión de Usuarios</Title>
                
                <FilterBar>
                    <FilterInput
                        type="text"
                        placeholder="Filtrar por nombre, correo, rol o cédula..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <SearchButton onClick={handleSearchClick}>
                        <SearchIconSVG /> Buscar
                    </SearchButton>
                    <ResetButton onClick={handleReset}>
                        <ResetIconSVG /> Restablecer resultados
                    </ResetButton>
                </FilterBar>

                <UserGrid>
                    {usuariosFiltrados.length > 0 ? (
                        usuariosFiltrados.map((user) => (
                            <UserCard key={user.id}>
                                <UserIcon role={user.tipoUsuario}>
                                    {user.fotoPerfil ? (
                                        <img 
                                            src={user.fotoPerfil} 
                                            alt={`${user.nombres} ${user.apellidos}`} 
                                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                        />
                                    ) : (
                                        <img 
                                            src="/header/avatar.png"
                                            alt={`${user.nombres} ${user.apellidos}`} 
                                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                        />
                                    )}
                                </UserIcon>
                                <UserDetails>
                                    <UserName>{user.nombres} {user.apellidos}</UserName>
                                    <UserRol role={user.tipoUsuario}>{user.tipoUsuario}</UserRol>
                                    <DetailRow>
                                        <DetailLabel>Cédula:</DetailLabel>
                                        <DetailValue>{user.cedula}</DetailValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DetailLabel>Correo:</DetailLabel>
                                        <DetailValue>{user.correo}</DetailValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DetailLabel>Fecha de creación:</DetailLabel>
                                        <DetailValue>{formatearFecha(user.fechaCreacion)}</DetailValue>
                                    </DetailRow>
                                </UserDetails>
                                
                                <ActionGroup>
                                    <ActionButton onClick={() => handleDeleteUser(user.id)} danger>Eliminar</ActionButton>
                                </ActionGroup>
                            </UserCard>
                        ))
                    ) : (
                        <NoResults>No se encontraron usuarios que coincidan con el filtro.</NoResults>
                    )}
                </UserGrid>
                
            </ContentWrapper>
        </Container>
    </>
  )
}

export default Busqueda;


const BackgroundColor = '#9DCBD7';
const CardBackground = 'white';
const PrimaryColor = '#5a2e2e';
const SecondaryColor = '#1d3557';

const Container = styled.div`
  background-color: ${BackgroundColor};
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1300px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  margin-bottom: 30px;
  font-weight: 800;
  text-align: center;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  max-width: 900px;
  margin-bottom: 40px;
  padding: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterInput = styled.input`
  flex-grow: 1;
  min-width: 250px;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: ${CardBackground};
`;

const BaseFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s, transform 0.2s;
  flex-shrink: 0;
  svg {
    fill: currentColor;
    width: 1em;
    height: 1em;
  }
`;

const SearchButton = styled(BaseFilterButton)`
  background-color: ${SecondaryColor}; 
  color: white;

  &:hover {
    background-color: #112a45;
    transform: translateY(-1px);
  }
`;

const ResetButton = styled(BaseFilterButton)`
  background-color: ${PrimaryColor};
  color: white;

  &:hover {
    background-color: #4C241D;
    transform: translateY(-1px);
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
  gap: 25px;
  width: 100%;
  margin-bottom: 30px;
`;

const UserCard = styled.div`
  background-color: ${CardBackground};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column; 
  align-items: center;
  text-align: center;
  gap: 15px;
`;

const UserIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${props => props.role === 'ADMINISTRADOR' ? '#f06292' : '#64b5f6'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  margin-top: 5px;
`;

const UserDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const UserName = styled.h2`
  color: #333;
  font-size: 1.3em;
  margin: 0 0 5px 0;
  font-weight: 700;
  line-height: 1.2;
`;

const UserRol = styled.p`
  color: ${props => props.role === 'ADMINISTRADOR' ? '#e53935' : '#1976d2'};
  font-size: 0.9em;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-transform: uppercase;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 8px;
  width: 100%;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #666;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  color: #333;
  font-size: 0.95em;
  font-weight: 500;
  word-break: break-all;
  text-align: center;
`;

const ActionGroup = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 0 10px;
`;

const ActionButton = styled.button`
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    
    background-color: ${props => props.primary ? '#007bff' : (props.danger ? '#dc3545' : '#ccc')};
    color: ${props => props.primary || props.danger ? 'white' : '#333'};

    &:hover {
        background-color: ${props => props.primary ? '#0056b3' : (props.danger ? '#c82333' : '#bbb')};
    }
`;

const NoResults = styled.div`
    grid-column: 1 / -1;
    padding: 40px;
    text-align: center;
    color: #666;
    background-color: #f8f8f8;
    border-radius: 10px;
    font-size: 1.1em;
`;

const SearchIconSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
);

const ResetIconSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.173 2.004a.5.5 0 0 1 .634.032l2.364 2.363a.5.5 0 0 1 0 .708l-2.364 2.364a.5.5 0 0 1-.708-.708l1.791-1.79H9c-2.4 0-4.5 1.7-5.1 4.1a.5.5 0 0 1-.9.3c.4-2.8 2.8-5 5.9-5h3.966L9.899 2.712a.5.5 0 0 1 .032-.634zM4.09 9.902a.5.5 0 0 1 .707 0l1.79 1.79H13c2.4 0 4.5-1.7 5.1-4.1a.5.5 0 0 1 .9-.3c-.4 2.8-2.8 5-5.9 5h-3.966l1.791 1.79a.5.5 0 0 1-.707.707l-2.364-2.364a.5.5 0 0 1 0-.708l2.364-2.363z"/>
    </svg>
);