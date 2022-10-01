import { Link } from 'react-router-dom'
import '../css/signin/signin.scss'

function LoginPage() {
  document.title = "TeamUp Sign in"
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

          <form className='signin-card-form'>
            <div className='form-item'>
              <span className='form-item-icon material-icons dark-blue'>mail</span>
              <input className='form-input' type='text' placeholder='Enter Email' required autoFocus />
            </div>
            <div className='form-item'>
              <span className='form-item-icon material-icons dark-blue'>lock</span>
              <input className='form-input' type='password' placeholder='Enter Password' required autoFocus />
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
