import { useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();
  
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  
  return (
    <>
        <input
          type="button"
          value="Cerrar sesion"
          onClick={() => cerrarSesion()}
        />
    </>
  )
}

export default Header