import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

ReactDOM.render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>,
  document.getElementById("root")
);

// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// // import './index.css';
// // import '@radix-ui/themes/styles.css';
// // import { Theme } from '@radix-ui/themes';
// import theme from "./theme/theme";
// import { ThemeProvider } from "@mui/material/styles";
// import { StyledEngineProvider } from "@mui/material/styles";

// ReactDOM.render(
//   <React.StrictMode>
//     {/* <StyledEngineProvider injectFirst> */}
//     <ThemeProvider theme={theme}>
//       <App />
//     </ThemeProvider>
//     {/* </StyledEngineProvider> */}
//   </React.StrictMode>,
//   document.getElementById("root")
// );
