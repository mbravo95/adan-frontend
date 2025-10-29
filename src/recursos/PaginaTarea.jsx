import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";

const PaginaTarea = () => {

    const { codigo, tareaId } = useParams();

    console.log("Código del curso:", codigo);
    console.log("ID de la tarea:", tareaId);
  return (
    <>
      <h1>Tarea</h1>
    </>
  )
}

export default PaginaTarea