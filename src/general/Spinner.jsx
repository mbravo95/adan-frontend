import styled, { keyframes } from 'styled-components';

const Spinner = () => {
  return (
    <SpinnerContainer>
      <SpinnerBody />
      <LoadingText>Cargando, por favor espere...</LoadingText>
    </SpinnerContainer>
  );
};

export default Spinner;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;


const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;


const SpinnerBody = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4C241D;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 15px;
`;


const LoadingText = styled.p`
  color: #333;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;