import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ModalNuevaConversacion = ({ onClose, onUsuarioSeleccionado }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    /*
    // Para buscar usuarios
    useEffect(() => {
        if (searchTerm.length < 3) {
            setSearchResults([]);
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");
                const config = {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { search: searchTerm } 
                };
                
                const response = await axios.get(`${urlBase}/usuarios/buscar`, config); 
                setSearchResults(response.data); 
            } catch (error) {
                console.error("Error al buscar usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        // Metodo para que no le peguen muchas veces a la api si se hiciera por el inputchange
        const debounceTimer = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    */

    // Llama a la función del padre y cierra el modal
    const handleSelectUser = (user) => {
        onUsuarioSeleccionado(user); 
        onClose();
    };


  return (
    <ModalOverlay onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}> {/* Evita que el clic en el modal lo cierre */}
            <HeaderModal>
                <h2>Iniciar Nueva Conversación</h2>
                <CloseButton onClick={onClose}>&times;</CloseButton>
            </HeaderModal>
            
            <SearchInput
                type="text"
                placeholder="Escribe nombre, apellido o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <UserListContainer>
                {loading && <div>Cargando...</div>}
                {!loading && searchResults.length === 0 && searchTerm.length >= 3 && <div>No se encontraron usuarios.</div>}
                
                {searchResults.map(user => (
                    <UserItem key={user.id} onClick={() => handleSelectUser(user)}>
                        {/* Muestra el nombre completo del usuario */}
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