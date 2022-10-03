import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/signin/signin.scss'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/auth-provider'
import ApiStore from '../components/api-store'

const LoginPage = () => {
  document.title = "TeamUp Sign in"
  const navigate = useNavigate()
  const { login } = useAuth()

  const initLoginState = {
    email: '',
    password: ''
  }

  const [loginState, setLoginState] = useState(initLoginState)

  const handleChange = (e, property) => {
    let updatedValue = {};
    updatedValue = { [property]: e.target.value };
    setLoginState(loginState => ({
          ...loginState,
          ...updatedValue
        }));
    }

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await ApiStore.getToken(loginState)
    const token = JSON.parse(res)
    login(token);
    navigate('/');
  }

  return (
    <>
      <img src='images/background_waves_3.svg' alt='background waves' className='waves' ></img>

      <div className='signin'>
        <div className='signin-card'>
          <div className='signin-card-logo'>
            <img src='images/TeamUp.png' alt='logo' />
          </div>

          <div className='signin-card-header'>
            <h1>Welcome to TeamUp</h1>
            <div>Sign in to team up with friends, classmates and the whole world with ease</div>
          </div>

          <form className='signin-card-form' onSubmit={onSubmit}>
            <div className='form-item'>
              <span className='form-item-icon material-icons dark-blue'>mail</span>
              <input className='form-input' type='text' placeholder='Enter Email' defaultValue={loginState.email} onChange={(e) => handleChange(e, 'email')} required autoFocus />
            </div>
            <div className='form-item'>
              <span className='form-item-icon material-icons dark-blue'>lock</span>
              <input className='form-input' type='password' placeholder='Enter Password' defaultValue={loginState.password} onChange={(e) => handleChange(e, 'password')} required autoFocus />
            </div>
            <div className='form-item-other'>
              <div className='checkbox'>
                <input type='checkbox' id='rememberMeCheckBox' />
                <label htmlFor='rememberMeCheckBox'>Remember Me</label>
              </div>

              <Link to='/password-recovery'>Forgot Password?</Link>
            </div>

            <button type='submit'>Sign in</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginPage
