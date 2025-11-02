import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HomeUsuario = () => {
    const navigate = useNavigate();
    const userRole = 'PROFESOR'; 

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Container>
            <ContentWrapper>
                <Title>Home</Title>
                <MenuContainer>
                    
                    <CentralLogo>
                        <LogoImage src="/logo.jpeg" alt="Logo de la Aplicación" />
                    </CentralLogo>
                    
                    <ActionCard position="bottom-center" onClick={() => handleNavigation('/usuario')}>
                        <IconWrapper>👤</IconWrapper>
                        <ActionText>Mi Perfil</ActionText>
                    </ActionCard>

                    <ActionCard position="top-right" onClick={() => handleNavigation('/mensajes')}>
                        <IconWrapper>✉️</IconWrapper>
                        <ActionText>Mensajes</ActionText>
                    </ActionCard>

                    <ActionCard position="top-left" onClick={() => handleNavigation('/cursos')}>
                        <IconWrapper>📚</IconWrapper>
                        <ActionText>Mis Cursos</ActionText>
                    </ActionCard>
                     {/* Acciones extra o para el admin
                    <ActionCard position="bottom-right" onClick={() => handleNavigation('/recursos')}>
                        <IconWrapper>📁</IconWrapper>
                        <ActionText>Recursos</ActionText>
                    </ActionCard>
                    
                    {userRole === 'ADMINISTRADOR' && (
                        <ActionCard position="bottom-center" onClick={() => handleNavigation('/admin')}>
                            <IconWrapper>⚙️</IconWrapper>
                            <ActionText>Administración</ActionText>
                        </ActionCard>
                    )}
                    */}
                    
                </MenuContainer>
            </ContentWrapper>
        </Container>
    );
};

export default HomeUsuario;


const BackgroundColor = '#9DCBD7'; 
const PrimaryColor = '#5a2e2e'; 
const AccentColor = 'white';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  background-color: ${BackgroundColor};
  width: 100vw;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center; 
  padding: 40px 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  min-height: 500px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  margin-bottom: 10px;
  letter-spacing: 1px;
  font-weight: 800;
  text-align: center;
`;

const MenuContainer = styled.div`
  position: relative;
  width: 500px; 
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 600px) {
    width: 300px;
    height: 300px;
  }
`;


const CentralLogo = styled.div`
  width: 200px;
  height: 200px;
  background-color: ${AccentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute; 
  z-index: 10;
  overflow: hidden;
  
  @media (max-width: 600px) {
    width: 120px;
    height: 120px;
  }
`;


const LogoImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-sizing: border-box;
`;

const ActionCard = styled.div`
  position: absolute;
  width: 180px; 
  height: 60px; 
  padding: 10px;
  background-color: ${AccentColor};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 5;
  transition: all 0.3s ease;
  
  
  ${props => props.position === 'top-left' && `
    top: 50px;
    left: 0px;
  `}
  ${props => props.position === 'top-right' && `
    top: 50px;
    right: 0px;
  `}
  ${props => props.position === 'bottom-left' && `
    bottom: 50px;
    left: 0px;
  `}
  ${props => props.position === 'bottom-right' && `
    bottom: 50px;
    right: 0px;
  `}
  ${props => props.position === 'bottom-center' && `
    bottom: 50px;
  `}

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
    transform: scale(1.05);
    animation: ${float} 2s ease-in-out infinite;
  }
  
  @media (max-width: 600px) {
    width: 100px;
    height: 40px;
    
    ${props => props.position === 'top-left' && `
      top: 20px; left: 0px;
    `}
    ${props => props.position === 'top-right' && `
      top: 20px; right: 0px;
    `}
    ${props => props.position === 'bottom-left' && `
      bottom: 20px; left: 0px;
    `}
    ${props => props.position === 'bottom-right' && `
      bottom: 20px; right: 0px;
    `}
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${PrimaryColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  margin-right: 10px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 30px;
    height: 30px;
    font-size: 0.9em;
  }
`;

const ActionText = styled.span`
  font-size: 1em;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 600px) {
    font-size: 0.7em;
  }
`;