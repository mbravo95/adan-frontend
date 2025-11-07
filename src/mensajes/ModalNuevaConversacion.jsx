import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Spinner from '../general/Spinner';

const ModalNuevaConversacion = ({ onClose, onUsuarioSeleccionado, perfil, interlocutores }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);

    
    useEffect(() => {
        
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");
                const config = {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { search: searchTerm } 
                };
                
                const response1 = await axios.get(`${urlBase}/usuarios/${perfil.id}`, config);
                const datosUsuario = response1.data;
                const cursosProfesor = datosUsuario.cursosComoProfesor;
                const cursosEstudiante = datosUsuario.cursosComoEstudiante;

                const promesasDatosCursoProfesor= cursosProfesor.map(curso => {
                    return axios.get(`${urlBase}/cursos/${curso.id}`, config);
                });

                const promesasDatosCursoEstudiante= cursosEstudiante.map(curso => {
                    return axios.get(`${urlBase}/cursos/${curso.id}`, config);
                });

                const respuestasProfesores = await Promise.all(promesasDatosCursoProfesor);
                const respuestasEstudiantes = await Promise.all(promesasDatosCursoEstudiante);

                const estudiantesDeCursosProfesor = respuestasProfesores.flatMap(res => res.data.estudiantes);
                const profesoresDeCursosEstudiante = respuestasEstudiantes.flatMap(res => res.data.profesores);

                const usuariosCombinados = [...estudiantesDeCursosProfesor, ...profesoresDeCursosEstudiante];

                const idsVistos = new Set();
                const usuariosSinDuplicar = usuariosCombinados.filter(usuario => {
                    if (idsVistos.has(usuario.id)) {
                        return false;
                    }
                    if(interlocutores.includes(usuario.id)) return false;
                    if(usuario.id === perfil.id) return false;
                    idsVistos.add(usuario.id);
                    return true;
                });
                setUsuarios(usuariosSinDuplicar);
                setSearchResults(usuariosSinDuplicar);
            } catch (error) {
                console.error("Error al buscar usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const handleSelectUser = (user) => {
        onUsuarioSeleccionado(user); 
        onClose();
    };

    const buscarUsuarios = (term) => {
        setSearchTerm(term);
        if (term.length > 0) {
            const resultadosFiltrados = usuarios.filter(user => `${user.nombres} ${user.apellidos} ${user.correo}`.toLowerCase().includes(term.toLowerCase()));
            setSearchResults(resultadosFiltrados);
        } else {
            setSearchResults(usuarios);
        }
    };


  return (
    <ModalOverlay onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
            <HeaderModal>
                <h2>Iniciar Nueva Conversación</h2>
                <CloseButton onClick={onClose}>&times;</CloseButton>
            </HeaderModal>
            
            <SearchInput
                type="text"
                placeholder="Escribe nombre, apellido o correo..."
                value={searchTerm}
                onChange={(e) => buscarUsuarios(e.target.value)}
            />

            <UserListContainer>
                {loading && <Spinner />}
                {!loading && searchResults.length === 0 && searchTerm.length > 0 && <div>No se encontraron usuarios.</div>}

                {searchResults.map(user => (
                    <UserItem key={user.id} onClick={() => handleSelectUser(user)}>
                        {user.nombres} {user.apellidos} ({user.correo})
                    </UserItem>
                ))}
            </UserListContainer>
        </ModalContent>
    </ModalOverlay>
  )
}

export default ModalNuevaConversacion;


const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000; 
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
`;

const HeaderModal = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: #333;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const UserListContainer = styled.div`
    overflow-y: auto;
    flex-grow: 1;
`;

const UserItem = styled.div`
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
`;