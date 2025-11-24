import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Spinner from "../general/Spinner";
import useCursoData from "../hooks/useCursoData";

const MatricularEstudianteCurso = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cursoDesdePagina = location.state?.cursoActual;
  
  const [cursoActual, setCursoActual] = useState(
    cursoDesdePagina || {
      id: null,
      nombre: "Cargando...",
      codigo: codigo
    }
  );
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [filtroXedula, setFiltroCedula] = useState("");
  const [loading, setLoading] = useState(true);
  const [matriculando, setMatriculando] = useState({});

  const { esProfesor, loadingSecciones  } = useCursoData(codigo);
  const rol = localStorage.getItem("tipo");
  if (!loadingSecciones && rol !== "ADMINISTRADOR" && !esProfesor) {
    return <Navigate to="/home" />;
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No hay token");
          toast.error("No hay token de autenticación");
          return;
        }

        if (cursoDesdePagina) {
          setCursoActual(cursoDesdePagina);
        } else {
          const cursoResponse = await axios.get(`${urlBase}/cursos/buscar?texto=${codigo}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const cursoEncontrado = Array.isArray(cursoResponse.data) ? cursoResponse.data[0] : cursoResponse.data;
          
          if (cursoEncontrado) {
            setCursoActual({
              id: cursoEncontrado.id,
              nombre: cursoEncontrado.nombre || "Curso sin nombre",
              codigo: cursoEncontrado.codigo || "Sin código",
              ...cursoEncontrado
            });
          } else {
            setCursoActual({
              id: null,
              nombre: "Curso no encontrado",
              codigo: codigo
            });
          }
        }

        const usuariosResponse = await axios.get(`${urlBase}/usuarios`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      
        const todosLosUsuarios = usuariosResponse.data || [];

        const cursosTodosResponse = await axios.get(`${urlBase}/cursos`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const cursosTodos = cursosTodosResponse.data;
        const elCurso = cursosTodos.filter(curso => curso.id == cursoActual.id)[0];
        const usuariosFiltrados = todosLosUsuarios.filter(usuario => !elCurso.estudiantes.some(estudiante => estudiante.id == usuario.id) && !elCurso.profesores.some(profesor => profesor.id == usuario.id) && usuario.tipoUsuario != "ADMINISTRADOR");
        setUsuarios(usuariosFiltrados);
        setUsuariosFiltrados(usuariosFiltrados);
        
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, [codigo, cursoDesdePagina]);

  useEffect(() => {
    if (filtroXedula.trim() === "") {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtrados = usuarios.filter(usuario =>
        usuario.cedula && usuario.cedula.toString().includes(filtroXedula)
      );
      setUsuariosFiltrados(filtrados);
    }
  }, [filtroXedula, usuarios]);

  const matricularEstudiante = async (usuario) => {
    if (!cursoActual.id) {
      toast.error("Error: No se ha cargado la información del curso");
      return;
    }

    setMatriculando(prev => ({ ...prev, [usuario.id]: true }));
    
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.post(`${urlBase}/cursos/estudiantes`, {
        idCurso: cursoActual.id,
        idUsuario: usuario.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(`${usuario.nombres} ${usuario.apellidos} matriculado exitosamente`);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Error al matricular el estudiante";
      
      toast.error(errorMessage);
    } finally {
      setMatriculando(prev => ({ ...prev, [usuario.id]: false }));
    }
  };

  const volver = () => {
    navigate(`/curso/${codigo}/participantes`, {
      state: { cursoActual }
    });
  };

  return (
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <Title>Matricular Estudiante</Title>
          <CourseInfo>
            {cursoActual.nombre} - Código: {cursoActual.codigo}
          </CourseInfo>

          <SearchSection>
            <Label>Cédula</Label>
            <Input
              type="text"
              value={filtroXedula}
              onChange={(e) => setFiltroCedula(e.target.value)}
              placeholder="Ingrese la cédula"
            />
          </SearchSection>

          <UsersSection>
            {loading ? (
              <LoadingContainer>
                <Spinner />
              </LoadingContainer>
            ) : usuariosFiltrados.length > 0 ? (
              <UsersList>
                {usuariosFiltrados.map((usuario) => (
                  <UserCard key={usuario.id}>
                    <UserInfo>
                      <UserName>
                        {usuario.nombres} {usuario.apellidos}
                      </UserName>
                      <UserDetails>
                        Cédula: {usuario.cedula} | Email: {usuario.correo}
                      </UserDetails>
                    </UserInfo>
                    <EnrollButton
                      onClick={() => matricularEstudiante(usuario)}
                      disabled={matriculando[usuario.id]}
                    >
                      {matriculando[usuario.id] ? "Matriculando..." : "Matricular"}
                    </EnrollButton>
                  </UserCard>
                ))}
              </UsersList>
            ) : (
              <NoUsersMessage>
                {filtroXedula.trim() === "" 
                  ? "No hay usuarios disponibles"
                  : `No se encontraron usuarios con la cédula "${filtroXedula}"`
                }
              </NoUsersMessage>
            )}
          </UsersSection>

          <ButtonGroup>
            <BackButton onClick={volver}>
              Volver a Participantes
            </BackButton>
          </ButtonGroup>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default MatricularEstudianteCurso;

const Container = styled.div`
  background-color: #ffffffff;
  min-height: 100vh;
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
  max-width: 800px;
  padding: 0 20px;
`;

const FormWrapper = styled.div`
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
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
`;

const CourseInfo = styled.p`
  color: #666;
  font-size: 16px;
  text-align: center;
  margin-bottom: 30px;
`;

const SearchSection = styled.div`
  margin-bottom: 30px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 1em;
  margin-left: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const UsersSection = styled.div`
  width: 100%;
`;

const UsersList = styled.div`
  max-height: calc(3 * 72px);
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fafafa;
  
  /* Estilos del scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const UserCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  margin-right: 16px;
`;

const UserName = styled.h3`
  color: #333;
  font-size: 16px;
  margin: 0 0 4px 0;
  font-weight: 600;
`;

const UserDetails = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
`;

const EnrollButton = styled.button`
  background-color: #4C241D;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background-color: #3a1b16;
  }
  
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
`;

const BackButton = styled.button`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
  padding: 14px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const NoUsersMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px dashed #ddd;
`;