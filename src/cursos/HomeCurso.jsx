import { Outlet, Navigate } from "react-router-dom";

const HomeCurso = () => {
  const rol = localStorage.getItem("tipo");
  return (
    <>
        <h1>Admin cursos</h1>
        {rol == "ADMINISTRADOR" ? <Outlet /> : <Navigate to="/usuario" />}
    </>
  )
}

export default HomeCurso