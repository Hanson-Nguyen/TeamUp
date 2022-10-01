import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/signup/signup.scss'

function RegisterPage() {
  document.title = 'TeamUp Create Account'

  const [showPasswordDisplay, setPasswordDisplay] = useState(false);

  function togglePasswordDisplay() {
    setPasswordDisplay(!showPasswordDisplay)
  }

  return (
    <>
      <img src='images/background_waves_3.svg' alt='background waves' className='waves' />

      <div className='signup'>
        <div className='signup-card'>
          <div className='signup-card-logo'>
            <img src='images/TeamUp.png' alt='logo' />
          </div>

          <div className='signup-card-header'>
            <h1>Welcome to TeamUp</h1>
            <div>Create an account to team up with friends, classmates and the whole world with ease</div>
          </div>

          <form className='signup-card-form'>
            <div className='form-title'>First Name</div>
            <div className='form-item'>
              <input className='form-input' type='text' required autoFocus />
            </div>

            <div className='form-title'>Last Name</div>
            <div className='form-item'>
              <input className='form-input' type='text' required autoFocus />
            </div>

            <div className='form-title'>Email Address</div>
            <div className='form-item'>
              <input className='form-input' type='text' required autoFocus />
            </div>

            <div className='form-title'>Password</div>
            <div className='form-item'>
              <input className='form-input' type={showPasswordDisplay ? 'text' : 'password'} id='passwordInput' required autoFocus />
            </div>

            <div className='form-item-other'>
              <div className='checkbox'>
                <input type='checkbox' id='showPasswordBox' onChange={togglePasswordDisplay} />
                <label htmlFor='showPasswordBox'>Show Password</label>
              </div>
            </div>

            <button type='submit'>Create Account</button>
          </form>

          <div className='signup-card-footer'>
            Already have an account? <Link to='/login'>Sign in</Link>.
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
