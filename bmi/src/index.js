import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import './i18n'; // Temporarily commented out as i18n setup was removed

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Provides a baseline for styling (normalizes CSS) */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);


