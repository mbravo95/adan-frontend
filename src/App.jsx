import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./usuario/Login";
import RutaProtegidaLayout from "./layout/RutaProtegidaLayout";
import AuthLayout from "./layout/AuthLayout";
import CrearCurso from "./cursos/CrearCurso";
import HomeUsuario from "./usuario/HomeUsuario";
import EditProfile from "./usuario/EditProfile";
import CrearUsuario from "./usuario/CrearUsuario";
import Perfil from "./usuario/Perfil";
import { AuthProvider } from "./context/AuthProvider";
import OlvidoPassword from "./usuario/OlvidoPassword";
import ListadoCursos from "./cursos/ListadoCursos";
import NotFound from "./general/NotFound";
import VerCurso from "./cursos/VerCurso";
import CrearTarea from "./recursos/CrearTarea";

function App() {

  const token = localStorage.getItem("token");

  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
            />
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />}/>
              <Route path="olvido-password" element={<OlvidoPassword />}/>
            </Route>
            <Route element={<RutaProtegidaLayout/>}>
              <Route path="/usuario" element={<Perfil />} />
              <Route path="/usuario/editar" element={<EditProfile />} />
              <Route path="/crear-usuario" element={<CrearUsuario />} />
              <Route path="/crear-curso" element={<CrearCurso />} />
              <Route path="/crear-tarea" element={<CrearTarea />} />
              <Route path="/home" element={<HomeUsuario />} />
              <Route path="/busqueda" element={<ListadoCursos />} />
              <Route path="/curso/:id" element={<VerCurso />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
