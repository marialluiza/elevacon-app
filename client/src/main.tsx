// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'
// import { Toaster } from 'sonner'
// import { BrowserRouter } from 'react-router-dom'
// import { ProvedorAutentica } from './contexts/auth/ProvedorAutentica.tsx'

// // a apartir de '<BrowserRouter> ' todo o '<App/>' tem suporte a rotas
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ProvedorAutentica>
//       <BrowserRouter>
//         <App />
//         <Toaster richColors />
//       </BrowserRouter>
//     </ProvedorAutentica>
//   </React.StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

ReactDOM.render(
  <React.StrictMode>
    
    <Theme>
      <App />
    </Theme>
    
  </React.StrictMode>,
  document.getElementById('root')
);
