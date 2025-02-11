import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import MainGrid from './dashboard/components/MainGrid';
import EmployeeGrid from './dashboard/components/employees/EmployeeGrid';

// import NotFound from './NotFound';
{/* <Route path="*" element={<NotFound />} /> */}

function App() {
  return (
    <Routes>
      <Route path="/index" element={<Dashboard><MainGrid /></Dashboard>} />
      <Route path="/employees" element={<Dashboard><EmployeeGrid /></Dashboard>} />
    </Routes>
  );
}

export default App;