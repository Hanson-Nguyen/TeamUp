import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CreateClass from '../pages/CreateClass'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import SearchClass from '../pages/SearchClass'
import AdminPage from '../pages/AdminPage'
import { RequireAuth } from './auth-provider'

const Router = () => (
  <Routes>
    <Route exact path='/dashboard' element={
      <RequireAuth redirectTo="/dashboard">
        <HomePage />
      </RequireAuth>
    } />

    <Route exact path='/dashboard/create-class' element={
      <RequireAuth redirectTo="/dashboard">
        <CreateClass />
      </RequireAuth>
    } />

    <Route exact path='/dashboard/search-class' element={
      <RequireAuth redirectTo="/dashboard">
        <SearchClass />
      </RequireAuth>
    } />

    <Route exact path='/dashboard/admin' element={
      <RequireAuth redirectTo="/dashboard">
        <AdminPage />
      </RequireAuth>
    } />

    <Route exact path='/register' element={<RegisterPage />} />
    <Route exact path='/login' element={<LoginPage />} />
    <Route path='/' element={
      <Navigate replace to='/dashboard' />
    } />
  </Routes>
);

export default Router
