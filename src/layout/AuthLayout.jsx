import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
    const token = localStorage.getItem("token");
    const location = useLocation();
    const path = location.pathname;
    return (
    <>
        {(path == "/" && token) ? <Navigate to="/home" /> : <Navigate to="/login" /> }
        {token ? <Navigate to="/home" /> : <Outlet /> }
    </>
  )
}

export default AuthLayout;