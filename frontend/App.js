import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import MainGrid from './dashboard/components/MainGrid';
import EmployeeGrid from './dashboard/components/employees/EmployeeGrid';
import HeatmapGrid from './dashboard/components/heatmap/HeatmapGrid';
import DeviceGrid from './dashboard/components/devices/DeviceGrid';
import EmployeeHeatmapGrid from './dashboard/components/employees/EmployeeHeatmapGrid';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import EmployeeTrackerGrid from './dashboard/components/employees/EmployeeTrackerGrid';
import DeviceHeatmapGrid from './dashboard/components/devices/DeviceHeatmapGrid';
import DeviceHistoryGrid from './dashboard/components/deviceHistory/DeviceHistoryGrid';
import { UserProvider } from './contexts/UserContext';
//import NotFound from './NotFound';


function App() {
  return (
    <UserProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Routes>
          <Route path="/index" element={<Dashboard><MainGrid /></Dashboard>} />
          <Route path="/employees" element={<Dashboard><EmployeeGrid /></Dashboard>} />
          <Route path="/employees/:employee_id/heatmap" element={<Dashboard><EmployeeHeatmapGrid /></Dashboard>} />
          <Route path="/employees/:employee_id/tracker" element={<Dashboard><EmployeeTrackerGrid /></Dashboard>} />
          <Route path="/devices" element={<Dashboard><DeviceGrid /></Dashboard>} />
          <Route path="/devices/:device_id/heatmap" element={<Dashboard><DeviceHeatmapGrid /></Dashboard>} />
          <Route path="/device-histories" element={<Dashboard><DeviceHistoryGrid /></Dashboard>} />
          <Route path="/heatmap" element={<Dashboard><HeatmapGrid /></Dashboard>} />

          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </LocalizationProvider>
    </UserProvider>
  );
}

export default App;