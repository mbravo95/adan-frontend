import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Heading, BlockQuote, Font, Link, List, CodeBlock, Indent } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { createGlobalStyle } from 'styled-components';


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
  font-family: 'Roboto', sans-serif;
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
  font-family: 'Arial', sans-serif;
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
  margin-top: 25px;
`;

const CrearPagina = () => {

    const [pagina, setPagina] = useState("");
    const [nombre, setNombre] = useState("");

    const navigate = useNavigate();
    const { codigo, seccion } = useParams();

    console.log("Codigo del curso:", codigo);
    console.log("ID de la sección:", seccion);

    const enviarDatos = () => {
      console.log("Nombre:", nombre);
      console.log("Contenido:", pagina);
    };
  return (
    <>
        <GlobalCKEditorStyles />
        <Title>Crea una nueva página</Title>
        <Centrar>
          <Margen>
            <Label htmlFor="nombre-input">Titulo</Label>
          </Margen>
            <Input 
                  id="nombre-input"
                  type="text" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Introduce el nombre de la página"
            />
        </Centrar >
        <DivEditor>
            <CKEditor
            editor={ ClassicEditor }
            config={ {
                licenseKey: 'GPL',
                plugins: [ Essentials, Paragraph, Bold, Italic, Heading, BlockQuote, Font, Link, List, CodeBlock, Indent ],
                toolbar: ['undo', 'redo','|','heading','|','fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor','|','bold', 'italic','|','link', 'blockQuote', 'codeBlock','|','bulletedList', 'numberedList', 'outdent', 'indent'],
                initialData: location.state ? location.state.contenido : '',
            } }
            onChange={ ( event, editor ) => {
                setPagina(editor.getData());
            } }
            />
        </DivEditor>
        <ButtonGroup>
            <CreateButton onClick={enviarDatos}>Crear página</CreateButton>
            <CancelButton onClick={() => navigate(`/curso/${codigo}`)}>Descartar página</CancelButton>
        </ButtonGroup>
    </>
  )
}

export default CrearPagina;