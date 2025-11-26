import styled from "styled-components";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Outlet, Navigate, useNavigate } from "react-router-dom";


const CrearUsuario = () => {

  const rol = localStorage.getItem("tipo");
  
    const navigate = useNavigate();
  
    const [cedula, setCedula] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [tipo, setTipo] = useState("");
  
    const crear = async () => {
      if((tipo != "ADMINISTRADOR" && (nombres == "" || cedula == "" || apellidos == "")) || correo == "" || tipo == ""){
        toast.error("Debe completar todos los campos", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
        const response = await axios.post(`${urlBase}/usuarios/alta`, {cedula, nombres, apellidos, correo, tipoUsuario: tipo}, config);
        console.log(response);
        toast.success("Usuario agregado exitosamente", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/home');
      } catch (error) {
        console.log(error);
        const {response} = error;
        const {data} = response;
        toast.error(data, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  return (
  <>
    {rol === "ADMINISTRADOR" ? <Outlet /> : <Navigate to="/home" />}
    <Container>
      <ContentWrapper>
        <FormWrapper>
          <Title>Crear Usuario</Title>

          <Form onSubmit={(e) => e.preventDefault()}>
            
            <RadioGroup>
              <RadioLabel>
                <RadioInput 
                  type="radio" 
                  name="tipo" 
                  checked={tipo === "USUARIO"} 
                  onChange={() => setTipo("USUARIO")}
                />
                Profesor / Estudiante
              </RadioLabel>

              <RadioLabel>
                <RadioInput 
                  type="radio" 
                  name="tipo" 
                  checked={tipo === "ADMINISTRADOR"} 
                  onChange={() => setTipo("ADMINISTRADOR")}
                />
                Administrador
              </RadioLabel>
            </RadioGroup>

            {(tipo == "" || tipo == "USUARIO") && (
              <>
                <Input type="text" placeholder="Nombre" onChange={(e) => setNombres(e.target.value)} />
                <Input type="text" placeholder="Apellido" onChange={(e) => setApellidos(e.target.value)} />
                <Input type="number" placeholder="Cédula de Identidad" onChange={(e) => setCedula(e.target.value)} />
              </>
            )}

            <Input type="email" placeholder="Correo electrónico" onChange={(e) => setCorreo(e.target.value)} />

            <ButtonGroup>
              <CreateButton onClick={() => crear()}>
                Crear Usuario
              </CreateButton>
              <CancelButton onClick={() => navigate('/home')}>
                Cancelar
              </CancelButton>
            </ButtonGroup>

          </Form>
        </FormWrapper>
      </ContentWrapper>
    </Container>
  </>
)
}

export default CrearUsuario;

const Container = styled.div`
  background-color: #9DCBD7;
  min-height: 100vh;
  width: 100%;
  padding-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
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
  max-width: 400px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const CreateButton = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;

  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 10px;

  appearance: none;
  border: 2px solid #4C241D;
  border-radius: 50%;
  cursor: pointer;

  &:checked {
    background-color: #4C241D;
  }
`;

    /*
  return (
    <>
      {rol == "ADMINISTRADOR" ? <Outlet /> : <Navigate to="/home" />}
      <Container>
        <FormWrapper>
          <Title>CREAR USUARIO</Title>
          <Form>
            <RadioGroup>
              <RadioLabel>
                <RadioInput type="radio" name="tipo" value="Administrador" checked={tipo == 'ADMINISTRADOR'} onChange={() => setTipo("ADMINISTRADOR")}/>
                Administrador
              </RadioLabel>
              <RadioLabel>
                <RadioInput type="radio" name="tipo" value="Profesor/Estudiante" checked={tipo == 'USUARIO'} onChange={() => setTipo("USUARIO")} />
                Profesor/Estudiante
              </RadioLabel>
            </RadioGroup>
            { (tipo == "" || tipo == "USUARIO") && 
              <Input type="text" onChange={(e) => setNombres(e.target.value)} placeholder="Nombre" />
            }  
            { (tipo == "" || tipo == "USUARIO") && 
              <Input type="text" onChange={(e) => setApellidos(e.target.value)} placeholder="Apellido" />
            }
            { (tipo == "" || tipo == "USUARIO") && 
              <Input type="number" onChange={(e) => setCedula(e.target.value)} placeholder="Cedula de Identidad" />
            }
            <Input type="email" onChange={(e) => setCorreo(e.target.value)} placeholder="Correo electronico" />
            <CreateButton type="button" onClick={() => crear()}>Crear usuario</CreateButton>
            <CancelButton type="button" onClick={() => navigate('/curso')}>Cancelar</CancelButton>
          </Form>
        </FormWrapper>
      </Container>
    </>
  )
}

export default CrearUsuario;


const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 400px;
`;

const Container = styled.div`
  background-color: #9DCBD7;
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  color: black;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const Button = styled.button`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
  
  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);
  }

  &:active {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transform: translateY(1px);
  }
`;

const CreateButton = styled(Button)`
  background-color: #5a2e2e;
  color: #fff;
  margin-top: 10px;

  &:hover {
    background-color: #4b2525;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e0e0e0;
  color: #333;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.1em;
  color: #333;
  font-weight: 500;
`;

const RadioInput = styled.input`
  margin-right: 10px;
  width: 20px;
  height: 20px;
  
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  border-radius: 50%;
  border: 2px solid #5a2e2e;
  background-color: #fff;
  transition: all 0.2s ease;

  &:checked {
    background-color: #5a2e2e; 
    border-color: #3e2121ff;
  }

  &:focus {
    outline: 2px solid #585858ff;
    outline-offset: 1px;
  }
`;*/