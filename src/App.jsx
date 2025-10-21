import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./usuario/Login";
import RutaProtegidaLayout from "./layout/RutaProtegidaLayout";
import AuthLayout from "./layout/AuthLayout";
import HomeCurso from "./cursos/HomeCurso";
import CrearCurso from "./cursos/CrearCurso";
import HomeUsuario from "./usuario/HomeUsuario";
import EditProfile from "./usuario/EditProfile";
import CrearUsuario from "./usuario/CrearUsuario";
import CursosUsuario from "./cursos/CursosUsuario";
import PaginaCurso from "./cursos/PaginaCurso";
import Perfil from "./usuario/Perfil";
import CrearSeccion from "./seccion/CrearSeccion";

function App() {

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />}/>
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
          <Route path="/cursos" element={<RutaProtegidaLayout />}>
            <Route index element={<CursosUsuario />} />
          </Route>
          <Route path="/admin-cursos" element={<RutaProtegidaLayout />}>
            <Route index element={<HomeCurso />} />
          </Route>
          <Route path="/curso/:codigo" element={<RutaProtegidaLayout />}>
            <Route index element={<PaginaCurso />} />
          </Route>
          <Route path="/curso/:codigo/alta-seccion" element={<RutaProtegidaLayout />}>
            <Route index element={<CrearSeccion />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
