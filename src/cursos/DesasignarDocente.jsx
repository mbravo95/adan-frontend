import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from '../general/Spinner';

const DesasignarDocente = () => {

    
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const rol = localStorage.getItem("tipo");
    if (rol !== "ADMINISTRADOR") {
      return <Navigate to="/home" />;
    }
    
    const navigate = useNavigate();
    const location = useLocation();
    const curso = location.state.curso;

    useEffect(() => {
    const listarUsuarios = async () => {
                try {
                    setLoading(true);
                    const urlBase = import.meta.env.VITE_BACKEND_URL;
                    const token = localStorage.getItem("token");
                    const config = {
                        headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        },
                    };
                    const response = await axios.get(`${urlBase}/usuarios`, config);
                    const usuariosData = response.data;
                    const usuariosFiltrados = usuariosData.filter((usuario) => usuario.tipoUsuario === "USUARIO" && usuario.cursosComoProfesor.some((cursoProfesor) => cursoProfesor.id === curso.id));
                    setUsuarios(usuariosFiltrados);
                    console.log("Usuarios obtenidos:", usuariosFiltrados);
                } catch (error) {
                    console.error("Error al obtener los usuarios:", error);
                    const message = error.response?.data?.message || "Error al obtener los usuarios";
                    toast.error(message, {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                } finally {
                  setLoading(false);
                }
            };
            listarUsuarios();
        }, []);
    
        const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
    
        const handleSelectChange = (event) => {
            setDocenteSeleccionado(parseInt(event.target.value));
        };
    
        const handleSave = async () => {
            try {
                const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.post(`${urlBase}/cursos/desmatricularProfesor`, {
                    idUsuario: docenteSeleccionado,
                    idCurso: curso.id
                }, config);
                console.log(response);
                toast.success("Docente desasignado exitosamente", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                navigate('/admin-cursos');
            } catch (error) {
                console.error("Error al desasignar el docente:", error);
                const message = error.response?.data?.message || "Error al desasignar el docente";
                toast.error(message, {
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
    
        const handleDiscard = () => {
            navigate('/admin-cursos');
        };

  return (
    <Container>
      {loading && <Spinner />}
      {!loading && (
        <ContentWrapper>
          <FormWrapper>
            <Title>
              Seleccione un profesor para desasignar del curso {curso.nombre}
            </Title>
            <form>
              <FormGroup>
                <Label htmlFor="docentes-list">Docentes asignados</Label>
                <UserCard>
                  {usuarios.length === 0 ? (
                    <EmptyListMessage>
                      Este curso no tiene docentes asignados.
                    </EmptyListMessage>
                  ) : (
                    <UserList>
                      {usuarios.map((usuario) => (
                        <UserItem key={usuario.id}>
                          <UserLabel htmlFor={`teacher-${usuario.id}`}>
                            <RadioButton
                              type="radio"
                              id={`teacher-${usuario.id}`}
                              name="selectedTeacher"
                              value={usuario.id}
                              checked={docenteSeleccionado === usuario.id}
                              onChange={handleSelectChange}
                            />
                            <UserInfo>
                              <UserName>{usuario.nombres} {usuario.apellidos}</UserName>
                              <UserCedula>{usuario.cedula}</UserCedula>
                            </UserInfo>
                          </UserLabel>
                        </UserItem>
                      ))}
                    </UserList>
                  )}
                </UserCard>
              </FormGroup>

              <ButtonGroup>
                <SaveButton 
                  type="button"
                  onClick={handleSave} 
                  disabled={docenteSeleccionado === null}
                >
                  Aceptar
                </SaveButton>
                <DiscardButton 
                  type="button"
                  onClick={handleDiscard}
                >
                  Cancelar
                </DiscardButton>
              </ButtonGroup>
            </form>
          </FormWrapper>
        </ContentWrapper>
      )}
    </Container>
  );
}

export default DesasignarDocente;

const Container = styled.div`
  background-color: #9DCBD7;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 70px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  color: #555;
  font-size: 1.6em;
  /*margin-bottom: 10px;*/
  text-align: center;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 1em;
  font-weight: 500;
  color: #333;
  margin-left: 5px;
  display: block;
  margin-bottom: 8px;
`;

const UserCard = styled.div`
  background-color: white;
  border-radius: 4px;
  padding: 0;
  border: 1px solid #ddd;
  width: 100%;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  max-height: 280px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4C241D;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #3a1b16;
  }
`;

const UserItem = styled.li`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 15px;
`;

const UserName = styled.span`
  font-size: 1em;
  font-weight: 500;
  color: #333;
`;

const UserCedula = styled.span`
  font-size: 0.95em;
  font-weight: 400;
  color: #888;
  
  &::before {
    content: "|";
    margin-right: 15px;
    color: #ccc;
  }
`;

const RadioButton = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
  
  &:checked {
    accent-color: #4C241D;
  }
`;

const EmptyListMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #888;
  font-size: 1em;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const SaveButton = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const DiscardButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
`;