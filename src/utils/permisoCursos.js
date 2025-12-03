export function esUsuarioRegular() {
  return localStorage.getItem("tipo") !== "ADMINISTRADOR";
}

export function esProfesorCurso(pathname) {
  const codigosCursosProfesor = JSON.parse(localStorage.getItem("codigosCursosProfesor")) || [];
  const match = pathname.match(/^\/curso\/([^\/]+)/);
  const codigoCurso = match ? match[1] : null;
  return !!(codigoCurso && codigosCursosProfesor.includes(codigoCurso));
}

export function puedeAdministrarCursos(pathname, codigoCursoDirecto = null) {
  if (!esUsuarioRegular()) return true;
  
  if (codigoCursoDirecto) {
    const codigosCursosProfesor = JSON.parse(localStorage.getItem("codigosCursosProfesor")) || [];
    return codigosCursosProfesor.includes(codigoCursoDirecto);
  }
  
  return esProfesorCurso(pathname);
}