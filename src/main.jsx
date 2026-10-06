import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';

const root = document.getElementById('root');
document.body.replaceChildren(root);

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
