import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/register' element={<RegisterPage />} />
        <Route exact path='/login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
