import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CashierDashboard from './pages/CashierDashboard';

function App() {
  return (
    <>
      <CashierDashboard />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
