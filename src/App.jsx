import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./usuario/Login";
function App() {

  return (
    <>
      <h1>Adan frontend</h1>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
