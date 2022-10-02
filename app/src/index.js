import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './components/auth-provider';
import Router from './components/router'

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  )
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
