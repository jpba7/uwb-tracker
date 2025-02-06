import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './dashboard/Dashboard'

// Garantir que ReactDOM não seja minificado incorretamente
window.React = React;

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("root");
  createRoot(container).render(<Dashboard />);
});
