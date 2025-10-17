import styled from "styled-components";

const Input = styled.input`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
  width: 327px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

const Button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 16px;
  gap: 8px;
  width: 327px;
  height: 40px;
  background: #4C241D;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  color: white;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 24px;
  gap: 22px;
  position: absolute;
  width: 412px;
  height: 258px;
  left: 52px;
  top: 284px;
`;

const Div2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 327px;
  height: 96px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

const Link = styled.a`
  width: 364px;
  height: 18px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: center;
  color: #4C241D;
  mix-blend-mode: darken;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  flex: none;
  order: 3;
  align-self: stretch;
  flex-grow: 0;
`;

const Image = styled.img`
  position: absolute;
  width: 412px;
  height: 412px;
  left: 464px;
  top: 165px;
`;

const Login = () => {
  return (
    <>
        <Div>
          <Input placeholder="adan@email.com" />
          <Div2>
            <Input placeholder="**************" />
            <Button>Iniciar sesion</Button>
          </Div2>
          <Link>Olvido su contrasenia?</Link>
        </Div>
        <Image src = "/logo.jpeg" />
    </>
  )
}

export default Login