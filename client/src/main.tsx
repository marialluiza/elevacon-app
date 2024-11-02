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
