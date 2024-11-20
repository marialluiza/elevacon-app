import { createTheme } from "@mui/material/styles";

// Definindo as cores e fontes no tema global
const theme = createTheme({
  palette: {
    primary: {
      main: "#172D62", // Cor principal
    },
    secondary: {
      main: "#ffffff", // Cor secundária
    },
    background: {
      default: "#f4f4f4", // Cor de fundo padrão
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Arial', sans-serif", // Fonte global
    h1: {
      fontSize: "2.5rem", // Estilo de título
    },
    h2: {
      fontSize: "2rem", // Estilo de subtítulo
    },
  },
});

export default theme;