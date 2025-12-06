import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const PaginaTematica = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { codigo, recursoId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaginaContent = async () => {
            try {
                setLoading(true);
                
                const urlBase = import.meta.env.VITE_BACKEND_URL;
                const token = localStorage.getItem('token');
                
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const response = await axios.get(`${urlBase}/recursos/${recursoId}`, config);
                setHtmlContent(response.data.urlHtml || '');
                
            } catch (err) {
                setError('Error al cargar la página');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (recursoId) {
            fetchPaginaContent();
        }
    }, [recursoId]);

    const volverAlCurso = () => {
        navigate(`/curso/${codigo}`);
    };

    if (loading) return <LoadingMessage>Cargando...</LoadingMessage>;
    if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;

    return (
        <Container>
            <BackButton onClick={volverAlCurso}>
                ← Volver al curso
            </BackButton>
            <ScrollWrapper>
                <ContentWrapper>
                    <HtmlContent dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </ContentWrapper>
            </ScrollWrapper>
        </Container>
    );
};

export default PaginaTematica;

const Container = styled.div`
    background-color: #ffffffff;
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 90px;
    padding-bottom: 20px;
    position: relative;
`;

const BackButton = styled.button`
    background-color: #e0e0e0;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    position: absolute;
    left: 20px;
    top: 90px;
    
    &:hover {
        background-color: #d0d0d0;
    }
`;

const ScrollWrapper = styled.div`
    width: 840px;
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const HtmlContent = styled.div`
    width: 100%;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    /* Asegurar que el contenido se ajuste correctamente */
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    
    /* Evitar que imágenes y otros elementos se salgan */
    & img {
        max-width: 100%;
        height: auto;
    }
    
    & p, & div {
        margin: 0;
    }
`;

const LoadingMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 16px;
    color: #666;
`;

const ErrorMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 16px;
    color: #d32f2f;
`;