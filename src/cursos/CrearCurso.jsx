import { Outlet, Navigate } from "react-router-dom";

const CrearCurso = () => {
  
  const rol = localStorage.getItem("tipo");
  
  return (
    <>
        {rol == "ADMINISTRADOR" ? <Outlet /> : <Navigate to="/usuario" />}
        <h1>Crear cursos</h1>
    </>
  )
}

export default CrearCurso