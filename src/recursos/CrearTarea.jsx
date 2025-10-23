import { useLocation } from "react-router-dom";

const CrearTarea = () => {

    const location = useLocation();
    const codigoQR = location.state.seccionid;

    console.log(`Recibi la seccion ${seccionid}`);

  return (
    <>
        <h1>Crear Tarea</h1>
    </>
  )
}

export default CrearTarea