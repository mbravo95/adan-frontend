import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {

  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<Login />}/>
              <Route path="olvido-password" element={<OlvidoPassword />}/>
            </Route>
            <Route path="/usuario" element={<RutaProtegidaLayout/>}>
              <Route index element={<Perfil />} />
              <Route path="editar" element={<EditProfile />} />
            </Route>
            <Route path="/crear-usuario" element={<RutaProtegidaLayout/>}>
              <Route index element={<CrearUsuario />} />
            </Route>
            <Route path="/crear-curso" element={<RutaProtegidaLayout/>}>
              <Route index element={<CrearCurso />} />
            </Route>
            <Route path="/home" element={<RutaProtegidaLayout/>}>
              <Route index element={<HomeUsuario />} />
            </Route>
            <Route path="/busqueda" element={<RutaProtegidaLayout/>}>
              <Route index element={<ListadoCursos />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
