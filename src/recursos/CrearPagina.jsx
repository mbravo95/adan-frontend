import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Heading, BlockQuote, Font, Link, List, CodeBlock, Indent, Image, ImageInsert } from 'ckeditor5';
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
    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { codigo, seccion, idpagina } = useParams();
    // Obtener el nombre de la sección desde location.state
    let nombreSeccion = "";
    if (window.history.state && window.history.state.usr && window.history.state.usr.nombreSeccion) {
      nombreSeccion = window.history.state.usr.nombreSeccion;
    }

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
              setLoading(true);  
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
                const {nombre, urlHtml} = data;
                setNombre(nombre);
                setPagina(urlHtml);
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
      console.log('[CREAR_PAGINA] Variables antes del envío:', {
        nombre,
        pagina: pagina ? pagina.substring(0, 100) + '...' : pagina, // Solo primeros 100 caracteres para evitar spam
        seccion,
        codigo
      });
      
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
          const payload = {nombre, idSeccion: Number(seccion), urlHtml: pagina};
          console.log('[CREAR_PAGINA] URL:', `${urlBase}/recursos/paginas-tematicas`);
          console.log('[CREAR_PAGINA] Payload enviado:', payload);
          console.log('[CREAR_PAGINA] Config:', config);

          const response = await axios.post(`${urlBase}/recursos/paginas-tematicas`, payload, config);
          console.log('[CREAR_PAGINA] Respuesta exitosa:', response);

          if (nombreSeccion && nombreSeccion === "Cartelera de novedades") {
            try {
              let idCurso = null;
              if (window.history.state && window.history.state.usr && window.history.state.usr.idCurso) {
                idCurso = window.history.state.usr.idCurso;
              } else if (localStorage.getItem('idCurso')) {
                idCurso = localStorage.getItem('idCurso');
              }
              console.log('[NOTIFICACION] Llamando a:', `${urlBase}/notificaciones/avisoNuevaNovedad/curso/${idCurso}`);
              console.log('[NOTIFICACION] Config:', config);
              await axios.post(`${urlBase}/notificaciones/avisoNuevaNovedad/curso/${idCurso}`, {}, config);
              console.log('[NOTIFICACION] Llamada exitosa');
            } catch (notifError) {
              console.error("Error enviando notificación de nueva novedad", notifError);
            }
          }

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
        const response = await axios.put(`${urlBase}/recursos/paginas-tematicas/${idpagina}`, {nombre, urlHtml: pagina}, config);
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
        <Container>
          <ContentWrapper>
            <FormWrapper>
              {/*<Title>{idpagina ? "Editar página" : "Crear página"}</Title>*/}
              {loading && <Spinner />}
              {!loading && (
                <form>
                  <FormGroup>
                    <Label htmlFor="nombre-input">Título</Label>
                    <Input 
                      id="nombre-input"
                      type="text" 
                      value={nombre} 
                      onChange={(e) => setNombre(e.target.value)} 
                      placeholder="Título de la página"
                    />
                  </FormGroup>

                  <FormGroup>
                    <DivEditor>
                      <CKEditor
                        editor={ClassicEditor}
                        config={{
                          licenseKey: 'GPL',
                          plugins: [Essentials, Paragraph, Bold, Italic, Heading, BlockQuote, Font, Link, List, CodeBlock, Indent, Image, ImageInsert],
                          toolbar: ['undo', 'redo','|','heading','|','fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor','|','bold', 'italic','|','link', 'insertImage', 'blockQuote', 'codeBlock','|','bulletedList', 'numberedList', 'outdent', 'indent'],
                          image: {
                            insert: {
                              integrations: ['url']
                            }
                          },
                          initialData: pagina,
                        }}
                        onChange={(event, editor) => {
                          setPagina(editor.getData());
                        }}
                      />
                    </DivEditor>
                  </FormGroup>

                  <ButtonGroup>
                    {idpagina && <CreateButton type="button" onClick={actualizarDatos}>Actualizar</CreateButton>}
                    {!idpagina && <CreateButton type="button" onClick={enviarDatos}>Aceptar</CreateButton>}
                    <CancelButton type="button" onClick={() => navigate(`/curso/${codigo}`)}>
                      {!idpagina ? "Cancelar" : "Cancelar"}
                    </CancelButton>
                  </ButtonGroup>
                </form>
              )}
            </FormWrapper>
          </ContentWrapper>
        </Container>
    </>
  );
}

export default CrearPagina;


const GlobalCKEditorStyles = createGlobalStyle`
  .ck-editor__editable_inline {
    min-height: 280px;
    max-height: 70vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const Container = styled.div`
  background-color: #ffffffff;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 70px;
  /*padding-bottom: 40px;*/
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 900px;
`;

const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 25px;
  text-align: center;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  font-size: 1em;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
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
  width: 100%;
  box-sizing: border-box;
`;

const CheckboxGroup = styled.div`
  margin-top: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1em;
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
    background-color: #5a2e2e;
    border-color: #5a2e2e;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 14px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
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