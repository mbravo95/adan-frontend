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
import SubirMaterial from "./recursos/subirMaterial"; 
import { AuthProvider } from "./context/AuthProvider";
import OlvidoPassword from "./usuario/OlvidoPassword";
import ListadoCursos from "./cursos/ListadoCursos";
import NotFound from "./general/NotFound";
import VerCurso from "./cursos/VerCurso";
import CrearTarea from "./recursos/CrearTarea";
import CrearForo from "./recursos/CrearForo";
import HomeCurso from "./cursos/HomeCurso";
import CrearPagina from "./recursos/CrearPagina";
import PaginaTarea from "./recursos/PaginaTarea";
import PaginaForo from "./recursos/PaginaForo";
import CambiarContrasena from "./usuario/CambiarContrasena";
import AsignarDocente from "./cursos/AsignarDocente";
import DesasignarDocente from "./cursos/DesasignarDocente";
import Busqueda from "./usuario/Busqueda";
import CalificacionEstudianteCurso from "./cursos/CalificacionPerfilEstudiante";
import CalificarEstudiante from "./cursos/CalificarEstudiante";
import Foro from "./recursos/Foro";
import EditarTarea from "./recursos/editarTarea";
import EditarForo from "./recursos/EditarForo";
import Hilo from "./recursos/Hilo";
import CrearHiloForo from "./recursos/CrearHiloForo";
import PublicarMensajeHiloForo from "./recursos/PublicarMensajeHiloForo";

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
              <Route path="/reset-password" element={<CambiarContrasena />} />
            </Route>
            <Route element={<RutaProtegidaLayout/>}>
              <Route path="/home" element={<HomeUsuario />} />
              <Route path="/busqueda" element={<ListadoCursos />} />
              <Route path="/cursos" element={<CursosUsuario />} />
              <Route path="/admin-cursos" element={<HomeCurso />} />
              <Route path="/admin-cursos/asignar-profesor" element={<AsignarDocente />} />
              <Route path="/admin-cursos/desasignar-profesor" element={<DesasignarDocente />} />
              <Route path="/buscar-usuarios" element={<Busqueda />} />
              <Route path="/usuario" element={<Perfil />} />
              <Route path="/usuario/editar" element={<EditProfile />} />
              <Route path="/usuario/cambiar-contrasena" element={<CambiarContrasena />} />
              <Route path="/crear-usuario" element={<CrearUsuario />} />
              <Route path="/crear-curso" element={<CrearCurso />} />
              <Route path="/curso/:codigo" element={<PaginaCurso />} />
              <Route path="/curso/:id" element={<VerCurso />} />
              <Route path="/curso/:codigo/alta-seccion" element={<CrearSeccion />} />
              <Route path="/curso/:codigo/participantes" element={<ParticipantesCurso />} />
              <Route path="/curso/:codigo/participantes/matricular" element={<MatricularEstudianteCurso />} />
              <Route path="/curso/:codigo/:seccion/crear-tarea" element={<CrearTarea />} />
              <Route path="/curso/:codigo/:seccion/crear-pagina" element={<CrearPagina />} />
              <Route path="/curso/:codigo/pagina/:idpagina/editar" element={<CrearPagina />} />
              <Route path="/curso/:codigo/:seccion/subir-material" element={<SubirMaterial />} />
              <Route path="/curso/:codigo/:seccion/crear-foro" element={<CrearForo />} />
              <Route path="/curso/:codigo/tarea/:tareaId" element={<PaginaTarea />} />
              <Route path="/curso/:codigo/foro/:foroId" element={<Foro />} />
              <Route path="/curso/:id/estudiante/:estudianteId/calificacion" element={<CalificacionEstudianteCurso />} />
              <Route path="/curso/:id/estudiante/:estudianteId/calificar" element={<CalificarEstudiante />} />
              <Route path="/curso/:codigo/:seccion/:recursoId/editar" element={<EditarTarea />} />
              <Route path="/curso/:codigo/:seccion/foro/:recursoId/editar" element={<EditarForo />} />
              <Route path="/curso/:codigo/seccion/:seccion/foro/:recursoId/hilo/:hiloId" element={<Hilo />} />
              <Route path="/curso/:codigo/seccion/:seccion/foro/:recursoId/crear-hilo" element={<CrearHiloForo />} />
              <Route path="/curso/:codigo/seccion/:seccion/foro/:recursoId/hilo/:hiloId/publicar-mensaje" element={<PublicarMensajeHiloForo />} />

            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
