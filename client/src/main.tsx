import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

ReactDOM.render(
  <React.StrictMode>
    {/* Envolvendo o App com ambos os provedores de tema */}
    <Theme>
      <ThemeProvider theme={theme}>
        <App />
        <ThemePanel></ThemePanel>
      </ThemeProvider>
    </Theme>
  </React.StrictMode>,
  document.getElementById("root")
);