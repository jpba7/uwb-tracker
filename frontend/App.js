import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import MainGrid from './dashboard/components/MainGrid';
import EmployeeGrid from './dashboard/components/employees/EmployeeGrid';
import HeatmapGrid from './dashboard/components/heatmap/HeatmapGrid';
import EmployeeHeatmapGrid from './dashboard/components/employees/EmployeeHeatmapGrid';
//import NotFound from './NotFound';


function App() {
  return (
    <Routes>
      <Route path="/index" element={<Dashboard><MainGrid /></Dashboard>} />
      <Route path="/employees" element={<Dashboard><EmployeeGrid /></Dashboard>} />
      <Route path="/employees/:cpf/heatmap" element={<Dashboard><EmployeeHeatmapGrid /></Dashboard>} />
      <Route path="/heatmap" element={<Dashboard><HeatmapGrid /></Dashboard>} />
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}

export default App;