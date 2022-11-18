import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CreateClass from '../pages/CreateClass'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import SearchClass from '../pages/SearchClass'
import { RequireAuth } from './auth-provider'

const Router = () => (
  <Routes>
    <Route exact path='/' element={
      <RequireAuth redirectTo="/">
        <HomePage />
      </RequireAuth>
    } />
    <Route exact path='/home' element={<HomePage />} />
    <Route exact path='/create-class' element={<CreateClass />} />
    <Route exact path='/search-class' element={<SearchClass />} />
    <Route exact path='/register' element={<RegisterPage />} />
    <Route exact path='/login' element={<LoginPage />} />
  </Routes>
);

export default Router
