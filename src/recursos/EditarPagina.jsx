import { useParams, useNavigate } from "react-router-dom";

const EditarPagina = () => {
    const { codigo, idpagina } = useParams();
    const navigate = useNavigate();

    console.log("Codigo del curso:", codigo);
    console.log("ID de la página:", idpagina);

  return (
    <>
        <h1>Editar Página</h1>
        <p>Aquí puedes editar el contenido de la página.</p>
    </>
  )
}

export default EditarPagina