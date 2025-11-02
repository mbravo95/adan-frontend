// GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');


  body, html, #root {
    font-family: 'Inter', sans-serif;
    line-height: 1.5;
    min-height: 100vh; 
  }

  * {
    box-sizing: border-box;
    font-family: inherit; 
  }
`;

export default GlobalStyles;