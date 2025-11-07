import React from "react";
import styled from "styled-components";

const ArbolImg = styled.img`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 320px;
  height: auto;
  z-index: -1;
  pointer-events: none;
  opacity: 0.7;
`;

const ArbolFondo = () => (
  <ArbolImg src="/arbolFondo.png" alt="Fondo árbol" />
);

export default ArbolFondo;
