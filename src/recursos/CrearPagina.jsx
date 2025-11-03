import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Heading, BlockQuote, Font, Link, List, CodeBlock, Indent } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import Spinner from '../general/Spinner';
import useCursoData from "../hooks/useCursoData";

const CrearPagina = () => {

    const [pagina, setPagina] = useState("");
    const [nombre, setNombre] = useState("");
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { codigo, seccion, idpagina } = useParams();

    const { esProfesor, loadingSecciones  } = useCursoData(codigo);
    const rol = localStorage.getItem("tipo");
    if (!loadingSecciones && rol !== "ADMINISTRADOR" && !esProfesor) {
      return <Navigate to="/home" />;
    }

    useEffect(() => {
        const fetchPagina = async () => {
            if(idpagina == null) {
              setLoading(false);
              return;
            } 
            
            try {
                const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`${urlBase}/recursos/${idpagina}`, config);
                console.log(response);
                const {data} = response;
                const {nombre, urlHtml, visible} = data;
                setNombre(nombre);
                setPagina(urlHtml);
                setVisible(visible);
            } catch (error) {
                console.error("Error al obtener los datos de la página:", error);
                toast.error("No se pudieron cargar los datos de la página.");
            } finally {
                setLoading(false);
            }
        };

        fetchPagina();
    }, []);

    const enviarDatos = async () => {
      if(nombre == "" || pagina == ""){
          toast.error("Debe ingresar todos los campos", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          });
          return;
      }
      

      try {
            const urlBase = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${urlBase}/recursos/paginas-tematicas`, {nombre, visible, idSeccion: Number(seccion), urlHtml: pagina}, config);
            console.log(response);
            toast.success("Página agregada exitosamente", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate(`/curso/${codigo}`);
        } catch (error) {
            console.log(error);
            toast.error("Ya existe una página con ese título en la sección seleccionada", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };


    const actualizarDatos = async () => {
      if(nombre == "" || pagina == ""){
          toast.error("No puede dejar campos vacíos", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          });
          return;
      }

      try {
        const urlBase = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const config = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${urlBase}/recursos/paginas-tematicas/${idpagina}`, {nombre, visible, urlHtml: pagina}, config);
        console.log(response);
        toast.success("Página actualizada exitosamente", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        navigate(`/curso/${codigo}`);
      } catch (error) {
        console.log(error);
        toast.error("Ya existe una página con ese título en la sección seleccionada", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
      }
    }


  return (
    <>
        <GlobalCKEditorStyles />

        {loading && <Spinner />}
        
        { !loading &&
          <>
            <Title>{idpagina ? "Editar página" : "Crea una nueva página"}</Title>
            <Centrar>
              <Margen>
                <Label htmlFor="nombre-input">Titulo</Label>
              </Margen>
                <Input 
                      id="nombre-input"
                      type="text" 
                      value={nombre} 
                      onChange={(e) => setNombre(e.target.value)} 
                      placeholder="Introduce el titulo de la página"
                />
            </Centrar >
            
            <DivEditor>
                <CKEditor
                editor={ ClassicEditor }
                config={ {
                    licenseKey: 'GPL',
                    plugins: [ Essentials, Paragraph, Bold, Italic, Heading, BlockQuote, Font, Link, List, CodeBlock, Indent ],
                    toolbar: ['undo', 'redo','|','heading','|','fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor','|','bold', 'italic','|','link', 'blockQuote', 'codeBlock','|','bulletedList', 'numberedList', 'outdent', 'indent'],
                    initialData: pagina,
                } }
                onChange={ ( event, editor ) => {
                    setPagina(editor.getData());
                } }
                />
            </DivEditor>
            <CheckboxGroup>
              <CheckboxLabel htmlFor="task-visible">
                  <CheckboxInput type="checkbox" id="task-visible" onChange={() => setVisible(!visible)} checked={visible} />
                  <CustomCheckbox />
                  Visible
              </CheckboxLabel>
            </CheckboxGroup>
            <ButtonGroup>
                {idpagina && <CreateButton onClick={actualizarDatos}>Actualizar página</CreateButton>}
                {!idpagina && <CreateButton onClick={enviarDatos}>Crear página</CreateButton>}
                <CancelButton onClick={() => navigate(`/curso/${codigo}`)}> {!idpagina ? "Descartar página" : "Descartar cambios"} </CancelButton>
            </ButtonGroup>
          </>
        }
    </>
  )
}

export default CrearPagina;



const GlobalCKEditorStyles = createGlobalStyle`
  .ck-editor__editable_inline {
    min-height: 400px;
    max-height: 600px;
    overflow-y: auto;
  }
`;

const Title = styled.h1`
  font-size: 1.5em;
  color: black;
  text-align: center;
`;

const Button = styled.button`
  padding: 14px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
`;

const CreateButton = styled(Button)`
  background-color: #4C241D;
  color: white;
  
  &:hover {
    background-color: #3a1b16;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #999;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #bbb;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1e1e1e;
  font-size: 16px;
  min-width: 80px;
  text-align: right;
`;

const Input = styled.input`
  width: 400px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #4C241D;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const DivEditor = styled.div`
  margin: 0 auto;
  width: 80%;
  max-width: 900px;
`;

const Margen = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
`;

const Centrar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  margin-top: 40px;
`;

const CheckboxGroup = styled.div`
    margin-top: 25px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    justify-content: center;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.1em;
    color: #333;
    font-weight: 500;
`;

const CheckboxInput = styled.input`
    opacity: 0;
    position: absolute;
`;

const CustomCheckbox = styled.span`
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #5a2e2e;
    margin-right: 10px;
    flex-shrink: 0;
    transition: all 0.2s ease;
    position: relative;
    background-color: white;

    ${CheckboxInput}:checked + & {
        background-color: #60a5fa;
        border-color: #60a5fa;
    }

    ${CheckboxInput}:checked + &::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
    }
    

    ${CheckboxInput}:focus + & {
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
    }
`;