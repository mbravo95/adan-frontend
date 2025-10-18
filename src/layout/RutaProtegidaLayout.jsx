import { Navigate, Outlet } from "react-router-dom";
import Header from "../general/Header";

const RutaProtegidaLayout = () => {
    const token = localStorage.getItem("token");
  return (
    <>
        <Header />
        {token ? <Outlet /> : <Navigate to="/login" />}
    </>
  )
}

export default RutaProtegidaLayout