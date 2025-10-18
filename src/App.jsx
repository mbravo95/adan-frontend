import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./usuario/Login";
import Register from "./usuario/Register";
import RutaProtegidaLayout from "./layout/RutaProtegidaLayout";
import AuthLayout from "./layout/AuthLayout";
import HomeCurso from "./cursos/HomeCurso";
import CrearCurso from "./cursos/CrearCurso";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />}/>
            <Route path="registro" element={<Register />}/>
          </Route>
          <Route path="/curso" element={<RutaProtegidaLayout/>}>
            <Route index element={<HomeCurso />} />
            <Route path="crear" element={<CrearCurso />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
