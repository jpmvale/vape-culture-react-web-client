import { createGlobalStyle } from "styled-components";

//import 'react-circular-progressbar/dist/styles.css';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        background: #fff;
        text-rendering: optimizeLegibility;
        -web-font-smoothing: antialiased;
    }

    html, body #root {
        height: 100%;
    }
`;
