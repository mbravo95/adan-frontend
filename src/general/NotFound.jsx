import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

    const goToHome = () => {
        navigate('/home');
    };

  return (
    <>
        <Container>
            <ContentWrapper>
                <LogoImage src="/logo.jpeg" alt="Logo de ADÁN" />
                <ErrorCode>404</ErrorCode>
                <Title>¡Vaya! Página No Encontrada</Title>
                <Message>
                    Parece que intentaste acceder a una ruta que no existe. 
                    No te preocupes, puedes volver a la página principal.
                </Message>
                <HomeButton onClick={goToHome}>
                    Ir al Home
                </HomeButton>
            </ContentWrapper>
        </Container>
    </>
  )
}

export default NotFound;


const BackgroundColor = '#9DCBD7'; 
const PrimaryColor = '#4C241D';
const AccentColor = 'white'; 

const Container = styled.div`
  background-color: ${BackgroundColor};
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center; 
  padding: 40px 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  background-color: ${AccentColor};
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;
  width: 90%;
`;

const LogoImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
    overflow: hidden; 
    border: 4px solid ${PrimaryColor};
    padding: 5px;
`;

const ErrorCode = styled.h1`
  font-size: 6em;
  color: ${PrimaryColor};
  margin: 0;
  font-weight: 800;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2em;
  color: #333;
  margin: 10px 0 15px 0;
  font-weight: 700;
`;

const Message = styled.p`
  font-size: 1.1em;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const HomeButton = styled.button`
  background-color: ${PrimaryColor};
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a1b16;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;