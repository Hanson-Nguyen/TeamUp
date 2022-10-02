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
  const [authed, setAuthed] = useState(false);

  const login = () => setAuthed(true);
  const logout = () => setAuthed(false);

  let value = { authed, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const RequireAuth = ({ children }) => {
  let location = useLocation();
  const { authed } = useAuth();
  return authed ? children : <Navigate to="/login" state={{ from: location }} />
}

export default AuthProvider
