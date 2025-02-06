import React from 'react';
import { createRoot } from 'react-dom/client';
import SignIn from './sign-in/SignIn';

// Garantir que ReactDOM não seja minificado incorretamente
window.React = React;

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("root");
  createRoot(container).render(<SignIn />);
});