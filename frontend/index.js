import React from 'react';
import { createRoot } from 'react-dom/client';
import SignIn from './sign-in/SignIn';

// Garantir que ReactDOM não seja minificado incorretamente
window.React = React;

// Expor a função globalmente
window.renderSignIn = function () {
  createRoot(document.getElementById('root')).render(<SignIn />);
};