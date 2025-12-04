import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from '../general/Spinner';

const Busqueda = () => {

    const [busqueda, setBusqueda] = useState('');
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    const {profile} = useAuth();

    useEffect(() => {
        const cargarUsuarios = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
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
        setLoading(true);
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

            setUsuariosFiltrados(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.log(error);

            setUsuariosFiltrados([]);
            
            if (error.response?.status !== 404) {
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
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBloqueo = async (user) => {
        if (!confirm(`¿Estás seguro de que deseas ${user.bloqueado ? 'desbloquear' : 'bloquear'} este usuario?`)) {
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
            };
            

            const endpoint = user.bloqueado 
                ? `${urlBase}/usuarios/${user.id}/desbloquear`
                : `${urlBase}/usuarios/baja/${user.id}`;
            
            console.log('Llamando a endpoint:', endpoint);
            console.log('Token:', token ? 'Presente' : 'No presente');
            
            await axios.put(endpoint, {}, config);
            

            const usuariosActualizados = usuarios.map(u => 
                u.id === user.id ? { ...u, bloqueado: !u.bloqueado } : u
            );
            setUsuarios(usuariosActualizados);
            setUsuariosFiltrados(usuariosFiltrados.map(u => 
                u.id === user.id ? { ...u, bloqueado: !u.bloqueado } : u
            ));
            
            toast.success(`Usuario ${user.bloqueado ? 'desbloqueado' : 'bloqueado'} exitosamente`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Respuesta del servidor:', error.response?.data);
            console.error('Status:', error.response?.status);
            
            let mensajeError = `Error al ${user.bloqueado ? 'desbloquear' : 'bloquear'} el usuario`;
            
            if (error.response?.status === 403) {
                mensajeError = "No tienes permisos para realizar esta acción. Verifica que seas administrador.";
            } else if (error.response?.status === 401) {
                mensajeError = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
            } else if (error.response?.data?.mensaje) {
                mensajeError = error.response.data.mensaje;
            }
            
            toast.error(mensajeError, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const formatearFecha = (fechaString) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    return (
        <>
            <Container>
                <ContentWrapper>
                    {/*<Title>Gestión de Usuarios</Title>*/}
                    
                    <FilterBar>
                        <FilterInput
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                        />
                        <SearchButton onClick={handleSearchClick}>
                            <SearchIconSVG /> Buscar
                        </SearchButton>
                        <ResetButton onClick={handleReset}>
                            <ResetIconSVG /> Restablecer resultados
                        </ResetButton>
                    </FilterBar>

                    {loading && <Spinner />}
                    {!loading &&
                        <UserGrid>
                            {usuariosFiltrados.length > 0 ? (
                                usuariosFiltrados.map((user) => (
                                    <UserCard key={user.id} data-testid={`user-card-${user.id}`}>
                                        <UserIcon role={user.tipoUsuario}>
                                            {user.fotoPerfil ? (
                                                <img 
                                                    src={`${import.meta.env.VITE_BACKEND_URL.replace('/api', '')}${user.fotoPerfil}`} 
                                                    alt={`${user.nombres} ${user.apellidos}`} 
                                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
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
                                            <UserStatus blocked={user.bloqueado}>
                                                {user.bloqueado ? 'Bloqueado' : 'Activo'}
                                            </UserStatus>
                                            <DetailRow>
                                                <DetailLabel>Cédula:</DetailLabel>
                                                <DetailValue>{user.cedula ? user.cedula : "No disponible"}</DetailValue>
                                            </DetailRow>
                                            <DetailRow>
                                                <DetailLabel>Correo:</DetailLabel>
                                                <DetailValue>{user.correo}</DetailValue>
                                            </DetailRow>
                                            <DetailRow>
                                                <DetailLabel>Fecha de Ingreso:</DetailLabel>
                                                <DetailValue>{formatearFecha(user.fechaCreacion)}</DetailValue>
                                            </DetailRow>
                                        </UserDetails>
                                        
                                        <ActionGroup>
                                            <ActionButton 
                                                onClick={() => handleToggleBloqueo(user)} 
                                                danger={!user.bloqueado}
                                                success={user.bloqueado}
                                            >
                                                {user.bloqueado ? 'Desbloquear' : 'Bloquear'}
                                            </ActionButton>
                                        </ActionGroup>
                                    </UserCard>
                                ))
                            ) : (
                                <NoResults>No se encontraron usuarios que coincidan con la búsqueda</NoResults>
                            )}
                        </UserGrid>
                    }
                    
                </ContentWrapper>
            </Container>
        </>
    );
};

export default Busqueda;


const BackgroundColor = '#9DCBD7';
const CardBackground = 'white';
const PrimaryColor = '#5a2e2e';
const SecondaryColor = '#1d3557';

const Container = styled.div`
  background-color: ${BackgroundColor};
  min-height: 100vh;
  width: 100%;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /*padding: 40px 20px;*/
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
  margin-top: 40px;
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
    width: 1em;
    height: 1em;
  }
`;

const SearchButton = styled(BaseFilterButton)`
  background-color: #2a2a2a;
  color: white;

  &:hover {
    background-color: #171717ff;
    transform: translateY(-1px);
  }
`;

const ResetButton = styled(BaseFilterButton)`
  background-color: #2a2a2a;
  color: white;

  &:hover {
    background-color: #171717ff;
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

const UserStatus = styled.p`
  color: ${props => props.blocked ? '#e53935' : '#4caf50'};
  font-size: 0.85em;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  background-color: ${props => props.blocked ? 'rgba(229, 57, 53, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${props => props.blocked ? '#ffcdd2' : '#c8e6c9'};
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
    
    background-color: ${props => 
        props.success ? '#4caf50' : 
        props.danger ? '#d72d3eff' : 
        props.primary ? '#007bff' : '#ccc'
    };
    color: ${props => props.primary || props.danger || props.success ? 'white' : '#333'};

    &:hover {
        background-color: ${props => 
            props.success ? '#45a049' : 
            props.danger ? '#c82333' : 
            props.primary ? '#0056b3' : '#bbb'
        };
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
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.2 42L26.6 29.4C25.6 30.2 24.45 30.8333 23.15 31.3C21.85 31.7667 20.4667 32 19 32C15.3667 32 12.2917 30.7417 9.775 28.225C7.25833 25.7083 6 22.6333 6 19C6 15.3667 7.25833 12.2917 9.775 9.775C12.2917 7.25833 15.3667 6 19 6C22.6333 6 25.7083 7.25833 28.225 9.775C30.7417 12.2917 32 15.3667 32 19C32 20.4667 31.7667 21.85 31.3 23.15C30.8333 24.45 30.2 25.6 29.4 26.6L42 39.2L39.2 42ZM19 28C21.5 28 23.625 27.125 25.375 25.375C27.125 23.625 28 21.5 28 19C28 16.5 27.125 14.375 25.375 12.625C23.625 10.875 21.5 10 19 10C16.5 10 14.375 10.875 12.625 12.625C10.875 14.375 10 16.5 10 19C10 21.5 10.875 23.625 12.625 25.375C14.375 27.125 16.5 28 19 28Z" fill="white"/>
    </svg>
);

const ResetIconSVG = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M46 8.00015V20.0002M46 20.0002H34M46 20.0002L36.72 11.2802C34.5705 9.12958 31.9113 7.55856 28.9904 6.7137C26.0695 5.86883 22.9822 5.77765 20.0166 6.44867C17.0509 7.11968 14.3036 8.53102 12.0309 10.551C9.75827 12.571 8.03434 15.1337 7.02 18.0002M2 40.0002V28.0002M2 28.0002H14M2 28.0002L11.28 36.7202C13.4295 38.8707 16.0887 40.4417 19.0096 41.2866C21.9305 42.1315 25.0178 42.2226 27.9834 41.5516C30.9491 40.8806 33.6964 39.4693 35.9691 37.4493C38.2417 35.4293 39.9657 32.8666 40.98 30.0002" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);