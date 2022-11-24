import React, { createContext, useState, useContext } from 'react'
import { useLocation, Navigate } from 'react-router-dom'

export const AuthContext = createContext({
  authed: false,
  login: () => { },
  logout: () => { },
  role: null,
  skip: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token')
  let role = localStorage.getItem('role')
  let skip = localStorage.getItem('skip_w')
  const [authed, setAuthed] = useState(false);

  const login = (auth) => {
    setAuthed(true);
    localStorage.setItem('token', auth.token)
    localStorage.setItem('role', auth.role)
    localStorage.setItem('skip_w', auth.skip)
  }

  const logout = () => {
    setAuthed(false);
  }

  let value = { authed, token, login, logout, role, skip }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const RequireAuth = ({ children }) => {
  let location = useLocation();
  const { token } = useAuth();
  return token  ? children : <Navigate to="/login" state={{ from: location }} />
}

export default AuthProvider
