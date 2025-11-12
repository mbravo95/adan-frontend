
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaginaTematica = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { recursoId } = useParams();

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

                // Endpoint correcto según tu API
                const response = await axios.get(`${urlBase}/recursos/${recursoId}`, config);
                
                // Extraer el HTML del campo urlHtml
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

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            {/* Mostrar el HTML recibido de la API */}
            <div 
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{ 
                    width: '100%', 
                    minHeight: '400px',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            />
        </div>
    );
};

export default PaginaTematica;