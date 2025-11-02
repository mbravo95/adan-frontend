import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from '../general/Spinner';

const AsignarDocente = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const curso = location.state.curso;

    useEffect(() => {
        const rol = localStorage.getItem("tipo");
        if (rol !== "ADMINISTRADOR") {
          return <Navigate to="/home" />;
        }
      
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
                const usuariosFiltrados = usuariosData.filter((usuario) => usuario.tipoUsuario === "USUARIO" && !usuario.cursosComoEstudiante.some((cursoEstudiante) => cursoEstudiante.id === curso.id) && !usuario.cursosComoProfesor.some((cursoProfesor) => cursoProfesor.id === curso.id));
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
            const response = await axios.post(`${urlBase}/cursos/profesores`, {
                idUsuario: docenteSeleccionado,
                idCurso: curso.id
            }, config);
            console.log(response);
            toast.success("Docente asignado exitosamente", {
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
            console.error("Error al asignar el docente:", error);
            const message = error.response?.data?.message || "Error al asignar el docente";
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
    <>
        <Container>
            {loading && <Spinner />}
            { !loading &&
              <ContentWrapper>
                  <Title>Asignar Docente al Curso</Title>
                  <Description>
                      Seleccione un profesor para asignar al curso {curso.nombre}
                  </Description>

                  <UserCard>
                      {usuarios.length === 0 ? (
                          <EmptyListMessage>
                              Este curso no tiene docentes disponibles para asignar.
                          </EmptyListMessage>
                      ) : (
                      <UserList>
                          {usuarios.map((usuario) => (
                              <UserItem key={usuario.id}>
                                  <Label htmlFor={`teacher-${usuario.id}`}>
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
                                  </Label>
                              </UserItem>
                          ))}
                      </UserList>
                      )}
                  </UserCard>


                  <ButtonContainer>
                      <SaveButton onClick={handleSave} disabled={docenteSeleccionado === null}>
                          Guardar Cambios
                      </SaveButton>
                      <DiscardButton onClick={handleDiscard}>
                          Descartar
                      </DiscardButton>
                  </ButtonContainer>

              </ContentWrapper>
            }
        </Container>
    </>
  )
}

export default AsignarDocente;


const BackgroundColor = '#a7d9ed';
const ButtonPrimaryColor = '#5a2e2e';
const ButtonSecondaryColor = '#d0e0e0';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${BackgroundColor};
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 550px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  margin-bottom: 10px;
  letter-spacing: 1px;
  font-weight: 800;
  text-align: center;
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.1em;
  color: #555;
  margin: 0 0 25px 0;
  line-height: 1.5;
`;

const UserCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UserItem = styled.li`
  padding: 12px 10px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.label`
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
    font-size: 1.1em;
    font-weight: 500;
    color: #333;
`;

const UserCedula = styled.span`
    font-size: 1em;
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
  
  &:checked {
    accent-color: ${ButtonPrimaryColor};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  margin-top: 30px;
`;

const BaseButton = styled.button`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);
  }

  &:active {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SaveButton = styled(BaseButton)`
  background-color: ${ButtonPrimaryColor};
  color: #fff;
`;

const DiscardButton = styled(BaseButton)`
  background-color: ${ButtonSecondaryColor};
  color: #333;

  &:hover {
    background-color: #c0d0d0;
  }
`;

const EmptyListMessage = styled.div`
    padding: 20px;
    text-align: center;
    color: #888;
    font-size: 1.1em;
    font-weight: 500;
`;