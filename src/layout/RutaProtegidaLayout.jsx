import { Navigate, Outlet } from "react-router-dom";
import Header from "../general/Header";

const RutaProtegidaLayout = () => {
    const token = localStorage.getItem("token");

    if(!token) {
      return <Navigate to="/login" />;
    }

    return (
      <>
        <Header />
        <Outlet />
      </>
    );
}

export default RutaProtegidaLayout