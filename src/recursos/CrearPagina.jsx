import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Heading, BlockQuote, Font, Link, List, CodeBlock, Indent } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styled from 'styled-components';


const Title = styled.h1`
  font-size: 1.5em;
  color: black;
  font-family: 'Roboto', sans-serif;
  text-align: center;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
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
  color: #333;
  font-size: 14px;
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
  margin-left: 10%;
  margin-right: 10%;
`;

const DivBoton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const Margen = styled.div`
  margin-right: 10px;
`;

const Centrar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 5 px;
`;

const CrearPagina = () => {
    const [pagina, setPagina] = useState("");
    const [nombre, setNombre] = useState("");

    const enviarDatos = () => {
      console.log(pagina);
    };
  return (
    <>
        <Title>Crea una nueva pagina</Title>
        <Centrar>
          <Margen>
          <Label>Nombre</Label>
          </Margen>
            <Input type="text" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} />
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
            <CreateButton onClick={() => enviarDatos()}>Crear pagina</CreateButton>
            <CancelButton onClick={() => enviarDatos()}>Descartar pagina</CancelButton>
        </ButtonGroup>
    </>
  )
}

export default CrearPagina