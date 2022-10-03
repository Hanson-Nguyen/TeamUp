import React, { createContext, useState, useContext } from 'react'
import { useLocation, Navigate } from 'react-router-dom'

export const AuthContext = createContext({
  authed: false,
  login: () => { },
  logout: () => { }
});

export const useAuth = () => {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token')
  const [authed, setAuthed] = useState(false);

  const login = (auth) => {
    setAuthed(true);
    localStorage.setItem('token', auth.token)
  }
  const logout = () => {
    setAuthed(false);
  }

  let value = { authed, token, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const RequireAuth = ({ children }) => {
  let location = useLocation();
  const { token } = useAuth();
  return token  ? children : <Navigate to="/login" state={{ from: location }} />
}

export default AuthProvider
