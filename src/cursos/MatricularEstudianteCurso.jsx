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
        
        setUsuarios(todosLosUsuarios);
        setUsuariosFiltrados(todosLosUsuarios);
        
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.error("Error al cargar los datos", {
          position: "top-center",
          autoClose: 3000,
        });
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
      toast.error("Error: No se ha cargado la información del curso", {
        position: "top-center",
        autoClose: 3000,
      });
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

      toast.success(`${usuario.nombres} ${usuario.apellidos} matriculado exitosamente`, {
        position: "top-center",
        autoClose: 3000,
      });
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Error al matricular el estudiante";
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
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
            <Label>Cedula</Label>
            <Input
              type="text"
              value={filtroXedula}
              onChange={(e) => setFiltroCedula(e.target.value)}
              placeholder="Ingrese la cedula"
            />
          </SearchSection>

          <UsersSection>
            {loading ? (
              <Spinner />
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
  max-width: 800px;
`;

const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  margin-bottom: 30px;
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
  font-weight: 600;
  color: #333;
  font-size: 14px;
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
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
`;

const UserCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  flex: 1;
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
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a1b16;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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
  padding: 12px 24px;
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const NoUsersMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;