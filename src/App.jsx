import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./usuario/Login";
import RutaProtegidaLayout from "./layout/RutaProtegidaLayout";
import AuthLayout from "./layout/AuthLayout";
import CrearCurso from "./cursos/CrearCurso";
import HomeUsuario from "./usuario/HomeUsuario";
import EditProfile from "./usuario/EditProfile";
import CrearUsuario from "./usuario/CrearUsuario";
import CursosUsuario from "./cursos/CursosUsuario";
import PaginaCurso from "./cursos/PaginaCurso";
import Perfil from "./usuario/Perfil";
import CrearSeccion from "./seccion/CrearSeccion";
import ParticipantesCurso from "./cursos/ParticipantesCurso";
import MatricularEstudianteCurso from "./cursos/MatricularEstudianteCurso";
import SubirMaterial from "./recursos/SubirMaterial"; 
import { AuthProvider } from "./context/AuthProvider";
import OlvidoPassword from "./usuario/OlvidoPassword";
import ListadoCursos from "./cursos/ListadoCursos";
import NotFound from "./general/NotFound";
import VerCurso from "./cursos/VerCurso";
import CrearTarea from "./recursos/CrearTarea";
import CrearForo from "./recursos/CrearForo";
import HomeCurso from "./cursos/HomeCurso";

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
              <Route path="/login" element={<Login />}/>
              <Route path="/olvido-password" element={<OlvidoPassword />}/>
            </Route>
            <Route element={<RutaProtegidaLayout/>}>
              <Route path="/usuario" element={<Perfil />} />
              <Route path="/usuario/editar" element={<EditProfile />} />
              <Route path="/crear-usuario" element={<CrearUsuario />} />
              <Route path="/crear-curso" element={<CrearCurso />} />
              <Route path="/crear-foro" element={<CrearForo />} />
              <Route path="/home" element={<HomeUsuario />} />
              <Route path="/busqueda" element={<ListadoCursos />} />
              <Route path="/curso/:id" element={<VerCurso />} />
            </Route>
            <Route path="/curso/:codigo/:seccion/crear-tarea" element={<RutaProtegidaLayout />}>
              <Route index element={<CrearTarea />} />
            </Route>
            <Route path="*" element={<NotFound />} />
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
            <Route path="/curso/:codigo/participantes" element={<RutaProtegidaLayout />}>
          <Route index element={<ParticipantesCurso />} />
          </Route>
            <Route path="/curso/:codigo/participantes/matricular" element={<RutaProtegidaLayout />}>
          <Route index element={<MatricularEstudianteCurso />} />
          </Route>
            <Route path="/curso/:codigo/subir-material" element={<RutaProtegidaLayout />}>
          <Route index element={<SubirMaterial />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
